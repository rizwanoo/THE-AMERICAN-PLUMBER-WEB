import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';

type VercelRequest = IncomingMessage & {
  body?: unknown;
  headers: IncomingMessage['headers'] & {
    'x-forwarded-for'?: string;
    'x-csrf-token'?: string;
  };
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const ipSubmissions = new Map<string, number[]>();

function getCsrfSecret(): string {
  return process.env.CSRF_SECRET && process.env.CSRF_SECRET.length >= 16
    ? process.env.CSRF_SECRET
    : 'tap-vercel-fallback-csrf-key-change-in-env';
}

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function verifyCsrfToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [nonce, issuedAtRaw, signature] = parts;
  const issuedAt = Number(issuedAtRaw);
  if (!nonce || !Number.isFinite(issuedAt) || !signature) return false;
  if (Date.now() - issuedAt > 2 * 60 * 60 * 1000) return false;

  const expected = crypto
    .createHmac('sha256', getCsrfSecret())
    .update(`${nonce}.${issuedAtRaw}`)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    if (key) result[key] = val;
  }
  return result;
}

async function readJsonBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as Record<string, unknown>;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(req: VercelRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') ||
      req.socket?.remoteAddress ||
      'unknown';

    const now = Date.now();
    const recentForIp = (ipSubmissions.get(clientIp) || []).filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );
    if (recentForIp.length >= RATE_LIMIT_MAX) {
      sendJson(res, 429, {
        ok: false,
        error: 'Too many requests from this connection. Please wait a few minutes before submitting again.',
      });
      return;
    }

    const cookies = parseCookies(req.headers.cookie);
    const cookieToken = cookies['tap_csrf'] || '';
    const headerToken = String(req.headers['x-csrf-token'] || '');

    if (!cookieToken || !headerToken || cookieToken !== headerToken || !verifyCsrfToken(headerToken)) {
      sendJson(res, 403, {
        ok: false,
        error: 'Security verification expired. Please refresh the form token and try again.',
      });
      return;
    }

    const body = await readJsonBody(req);

    if (typeof body.websiteUrl === 'string' && body.websiteUrl.trim().length > 0) {
      sendJson(res, 400, { ok: false, error: 'Submission rejected by spam filter.' });
      return;
    }

    const startedAt = Number(body.startedAt);
    if (Number.isFinite(startedAt) && now - startedAt < 1200) {
      sendJson(res, 400, {
        ok: false,
        error: 'Submission arrived too quickly. Please review your details and submit again.',
      });
      return;
    }

    const customerName = sanitizeText(body.customerName, 120);
    const email = sanitizeText(body.email, 160);
    const phone = sanitizeText(body.phone, 40);
    const serviceAddress = sanitizeText(body.serviceAddress, 240);
    const serviceCategory = sanitizeText(body.serviceCategory, 100) || 'General Plumbing Inquiry';
    const preferredContact = sanitizeText(body.preferredContact, 32);
    const plumbingIssue = sanitizeText(body.plumbingIssue, 2000);

    const fieldErrors: Record<string, string> = {};
    if (customerName.length < 2) fieldErrors.customerName = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }
    const digitCount = phone.replace(/\D/g, '').length;
    if (digitCount < 7 || digitCount > 15) {
      fieldErrors.phone = 'Please enter a valid phone number.';
    }
    if (serviceAddress.length < 5) {
      fieldErrors.serviceAddress = 'Please enter the service street address or city.';
    }
    if (!['email', 'phone', 'instagram'].includes(preferredContact)) {
      fieldErrors.preferredContact = 'Please select a preferred contact method.';
    }
    if (plumbingIssue.length < 12) {
      fieldErrors.plumbingIssue = 'Please describe the plumbing work or issue (at least 12 characters).';
    }

    if (Object.keys(fieldErrors).length > 0) {
      sendJson(res, 422, {
        ok: false,
        error: 'Please correct the highlighted fields.',
        fieldErrors,
      });
      return;
    }

    recentForIp.push(now);
    ipSubmissions.set(clientIp, recentForIp);

    const referenceId = `TAP-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const receivedAt = new Date().toISOString();

    const smtpConfigured = Boolean(
      process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim() &&
        process.env.CONTACT_RECIPIENT_EMAIL?.trim()
    );

    if (smtpConfigured) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const recipient = process.env.CONTACT_RECIPIENT_EMAIL!;
      const fromAddress = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER!;

      await transporter.sendMail({
        from: `"THE AMERICAN PLUMBER Website" <${fromAddress}>`,
        to: recipient,
        replyTo: email,
        subject: `[Service Request ${referenceId}] ${serviceCategory} — ${customerName}`,
        text: [
          `Reference: ${referenceId}`,
          `Submitted: ${receivedAt}`,
          `Name: ${customerName}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          `Service Address: ${serviceAddress}`,
          `Service Focus: ${serviceCategory}`,
          `Preferred Contact: ${preferredContact}`,
          '',
          'Plumbing Issue / Scope:',
          plumbingIssue,
        ].join('\n'),
        html: `
          <h2>New Service Request (${escapeHtml(referenceId)})</h2>
          <p><strong>Customer Name:</strong> ${escapeHtml(customerName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Service Address:</strong> ${escapeHtml(serviceAddress)}</p>
          <p><strong>Service Focus:</strong> ${escapeHtml(serviceCategory)}</p>
          <p><strong>Preferred Contact:</strong> ${escapeHtml(preferredContact)}</p>
          <p><strong>Issue Description:</strong></p>
          <p>${escapeHtml(plumbingIssue).replace(/\n/g, '<br>')}</p>
        `,
      });

      sendJson(res, 200, {
        ok: true,
        delivered: true,
        status: 'smtp_delivered',
        referenceId,
        receivedAt,
        message: 'Your service request has been validated and dispatched via configured SMTP mail delivery.',
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      delivered: false,
      status: 'smtp_not_configured',
      referenceId,
      receivedAt,
      message:
        'Your inquiry passed server validation and was assigned a reference ID, however outbound SMTP email delivery is not configured on this server yet. Please also reach out directly via @the_american_plumber on Instagram.',
    });
  } catch (err) {
    console.error('Vercel service-request error:', err);
    sendJson(res, 500, {
      ok: false,
      error:
        'Unable to process your request right now due to a server mail transport error. Please try again or contact @the_american_plumber directly on Instagram.',
    });
  }
}
