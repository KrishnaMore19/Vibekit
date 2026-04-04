// netlify/functions/contact-submit.js
// Handles POST /api/public/pages/:slug/contact
// 1. Validates inputs
// 2. Verifies the page exists and is PUBLISHED
// 3. Stores submission in contact_submissions table
// 4. Sends notification email to the page owner via Resend

const { Client } = require('pg');

// ─── CORS headers (public endpoint — anyone can submit) ──────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const ok   = (body) => ({ statusCode: 200, headers: CORS, body: JSON.stringify(body) });
const fail = (code, msg) => ({ statusCode: code, headers: CORS, body: JSON.stringify({ error: msg }) });

// ─── Main handler ─────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return fail(405, 'Method not allowed');

  // ── Extract slug from path ─────────────────────────────────────────────────
  // Path shape: /api/public/pages/:slug/contact
  // event.path preserves the original request path even after redirect
  const parts = event.path.replace(/\/$/, '').split('/');
  // parts: ['', 'api', 'public', 'pages', '<slug>', 'contact']
  const contactIdx = parts.lastIndexOf('contact');
  const slug = contactIdx > 0 ? parts[contactIdx - 1] : null;

  if (!slug) return fail(400, 'Missing page slug');

  // ── Parse & validate body ──────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return fail(400, 'Invalid JSON body');
  }

  const name    = (body.name    || '').trim();
  const email   = (body.email   || '').trim();
  const message = (body.message || '').trim();

  if (!name)    return fail(400, 'Name is required');
  if (!email)   return fail(400, 'Email is required');
  if (!message) return fail(400, 'Message is required');

  if (name.length > 200)       return fail(400, 'Name is too long (max 200 chars)');
  if (message.length > 2000)   return fail(400, 'Message is too long (max 2000 chars)');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, 'Invalid email address');

  // ── Database ───────────────────────────────────────────────────────────────
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    // Find the published page + owner email in one query
    const { rows } = await client.query(
      `SELECT
         p.id           AS page_id,
         p.title        AS page_title,
         u.email        AS owner_email,
         u.name         AS owner_name
       FROM pages p
       JOIN users u ON u.id = p.user_id
       WHERE p.slug = $1 AND p.status = 'PUBLISHED'
       LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return fail(404, 'Page not found or not published');
    }

    const { page_id, page_title, owner_email, owner_name } = rows[0];

    // ── Store submission in DB ─────────────────────────────────────────────
    await client.query(
      `INSERT INTO contact_submissions (page_id, page_slug, name, email, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [page_id, slug, name, email, message]
    );

    // ── Send email via Resend (non-fatal — DB already saved) ───────────────
    if (process.env.RESEND_API_KEY) {
      try {
        await sendResendEmail({
          to:         owner_email,
          ownerName:  owner_name || owner_email.split('@')[0],
          pageTitle:  page_title,
          slug,
          senderName:    name,
          senderEmail:   email,
          senderMessage: message,
        });
      } catch (emailErr) {
        // Log but don't fail the request — submission is already in DB
        console.error('[contact-submit] Resend email failed:', emailErr.message);
      }
    }

    return ok({ success: true, message: 'Message received!' });

  } catch (err) {
    console.error('[contact-submit] DB error:', err);
    return fail(500, 'Failed to submit contact form. Please try again.');
  } finally {
    await client.end().catch(() => {});
  }
};

// ─── Resend email sender ──────────────────────────────────────────────────────
async function sendResendEmail({ to, ownerName, pageTitle, slug, senderName, senderEmail, senderMessage }) {
  // RESEND_FROM_EMAIL: set this in Netlify env vars if you have a verified domain.
  // Otherwise Resend's free tier allows sending from onboarding@resend.dev only.
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const fromLabel = 'VibeKit Studio';
  const siteUrl   = process.env.URL || 'https://your-site.netlify.app'; // Netlify sets $URL automatically

  const html = buildEmailHtml({ ownerName, pageTitle, slug, senderName, senderEmail, senderMessage, siteUrl });
  const text = buildEmailText({ ownerName, pageTitle, slug, senderName, senderEmail, senderMessage, siteUrl });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    `${fromLabel} <${fromEmail}>`,
      to:      [to],
      // Also CC the sender so they have a copy
      reply_to: senderEmail,
      subject: `📬 New message on your page "${pageTitle}"`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API ${res.status}: ${err}`);
  }

  return res.json();
}

// ─── Email HTML template ──────────────────────────────────────────────────────
function buildEmailHtml({ ownerName, pageTitle, slug, senderName, senderEmail, senderMessage, siteUrl }) {
  const pageUrl = `${siteUrl}/p/${slug}`;
  const safeMsg = senderMessage.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New contact message — VibeKit Studio</title>
</head>
<body style="margin:0;padding:0;background:#F7F3EC;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EC;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:32px;height:32px;background:#100E09;border-radius:8px;display:inline-block;line-height:32px;text-align:center;">
                  <span style="color:#F7F3EC;font-size:16px;font-weight:bold;">⚡</span>
                </div>
                <span style="font-size:18px;font-weight:700;color:#100E09;letter-spacing:-0.01em;">VibeKit Studio</span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#FFFFFF;border-radius:16px;border:1px solid rgba(16,14,9,0.12);overflow:hidden;">

              <!-- Card top stripe -->
              <div style="background:#100E09;height:4px;"></div>

              <!-- Card body -->
              <div style="padding:36px 36px 28px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(16,14,9,0.40);">New message</p>
                <h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:#100E09;line-height:1.2;">${pageTitle}</h1>
                <p style="margin:0 0 28px;font-size:14px;color:rgba(16,14,9,0.50);">
                  Hi ${ownerName}, someone filled out the contact form on your VibeKit page.
                </p>

                <!-- Sender details -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EC;border-radius:10px;border:1px solid rgba(16,14,9,0.10);margin-bottom:20px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom:12px;">
                            <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:rgba(16,14,9,0.40);">From</span><br/>
                            <span style="font-size:16px;font-weight:700;color:#100E09;">${senderName}</span>
                            <span style="font-size:14px;color:rgba(16,14,9,0.50);margin-left:8px;">&lt;${senderEmail}&gt;</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:rgba(16,14,9,0.40);">Message</span><br/>
                            <p style="margin:6px 0 0;font-size:15px;color:#100E09;line-height:1.65;">${safeMsg}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <p style="margin:0 0 20px;font-size:14px;color:rgba(16,14,9,0.55);">
                  Reply directly to this email to respond — it goes straight to ${senderEmail}.
                </p>
                <a href="mailto:${senderEmail}?subject=Re: Your message on ${encodeURIComponent(pageTitle)}"
                   style="display:inline-block;padding:12px 28px;background:#100E09;color:#F7F3EC;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.01em;">
                  Reply to ${senderName}
                </a>
              </div>

              <!-- Card footer -->
              <div style="padding:18px 36px;border-top:1px solid rgba(16,14,9,0.08);">
                <p style="margin:0;font-size:12px;color:rgba(16,14,9,0.35);">
                  This message was sent via your VibeKit page
                  <a href="${pageUrl}" style="color:#C09040;text-decoration:none;">/p/${slug}</a>.
                  <br/>This submission has been saved to your dashboard.
                </p>
              </div>
            </td>
          </tr>

          <!-- Bottom note -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(16,14,9,0.35);">
                Sent by <a href="${siteUrl}" style="color:#C09040;text-decoration:none;">VibeKit Studio</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Plain-text fallback ──────────────────────────────────────────────────────
function buildEmailText({ ownerName, pageTitle, slug, senderName, senderEmail, senderMessage, siteUrl }) {
  return `New message on your VibeKit page "${pageTitle}"

Hi ${ownerName},

${senderName} (${senderEmail}) sent you a message via your page /p/${slug}:

---
${senderMessage}
---

Reply to: ${senderEmail}

This submission has been saved to your VibeKit dashboard.
${siteUrl}
`;
}