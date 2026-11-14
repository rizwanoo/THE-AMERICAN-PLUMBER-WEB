import type { IncomingMessage, ServerResponse } from 'node:http';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.CONTACT_RECIPIENT_EMAIL?.trim()
  );

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(
    JSON.stringify({
      brandName: 'THE AMERICAN PLUMBER',
      instagramHandle: '@the_american_plumber',
      instagramUrl: 'https://www.instagram.com/the_american_plumber/?hl=en',
      businessLocation: process.env.BUSINESS_LOCATION?.trim() || null,
      businessPhone: process.env.BUSINESS_PHONE?.trim() || null,
      businessEmail: process.env.BUSINESS_EMAIL?.trim() || null,
      smtpConfigured,
    })
  );
}
