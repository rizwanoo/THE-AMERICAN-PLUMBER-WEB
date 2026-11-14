import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

function getCsrfSecret(): string {
  return process.env.CSRF_SECRET && process.env.CSRF_SECRET.length >= 16
    ? process.env.CSRF_SECRET
    : 'tap-vercel-fallback-csrf-key-change-in-env';
}

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const issuedAt = Date.now();
  const payload = `${nonce}.${issuedAt}`;
  const hmac = crypto.createHmac('sha256', getCsrfSecret()).update(payload).digest('hex');
  const token = `${payload}.${hmac}`;

  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const secureFlag = isProd ? '; Secure' : '';

  res.statusCode = 200;
  res.setHeader(
    'Set-Cookie',
    `tap_csrf=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200${secureFlag}`
  );
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ csrfToken: token, issuedAt }));
}
