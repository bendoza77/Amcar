/* ------------------------------------------------------------------ */
/* Email templates                                                     */
/* ------------------------------------------------------------------ */

const BRAND = "#FF6B00";
const INK = "#111317";
const MUTED = "#6b7280";
const SUPPORT_EMAIL = process.env.MAIL_TO || "amcar2drivers@gmail.com";

/** Shared outer shell — branded header, white card, footer. */
function layout(innerHtml) {
  return `
  <div style="margin:0;padding:24px;background:#f4f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
      <tr>
        <td style="padding:8px 4px 20px;">
          <span style="font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${INK};">Amcar</span>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;border:1px solid #ececf0;border-radius:16px;overflow:hidden;">
          <div style="height:4px;background:${BRAND};"></div>
          <div style="padding:32px;">
            ${innerHtml}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 4px;color:${MUTED};font-size:12px;line-height:1.6;">
          Amcar · <a href="mailto:${SUPPORT_EMAIL}" style="color:${MUTED};">${SUPPORT_EMAIL}</a><br/>
          You're receiving this because you contacted Amcar.
        </td>
      </tr>
    </table>
  </div>`;
}

function row(label, value) {
  return `
    <tr>
      <td style="padding:8px 0;color:${MUTED};font-size:13px;width:90px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:${INK};font-size:14px;font-weight:600;">${value}</td>
    </tr>`;
}

/** Internal notification (to the business inbox). */
function notificationEmail({ name, email, subject, message }) {
  return layout(`
    <h1 style="margin:0 0 6px;font-size:20px;font-weight:800;color:${INK};">New contact message</h1>
    <p style="margin:0 0 20px;color:${MUTED};font-size:14px;">Someone reached out through the website form.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;border-bottom:1px solid #eee;margin-bottom:20px;">
      ${row("Name", escapeHtml(name))}
      ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND};text-decoration:none;">${escapeHtml(email)}</a>`)}
      ${row("Subject", escapeHtml(subject))}
    </table>
    <p style="margin:0 0 8px;color:${MUTED};font-size:13px;">Message</p>
    <div style="background:#f9f9fb;border:1px solid #eee;border-radius:12px;padding:16px;color:${INK};font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</div>
    <a href="mailto:${escapeHtml(email)}" style="display:inline-block;margin-top:24px;background:${BRAND};color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;">Reply to ${escapeHtml(name)}</a>
  `);
}

/** Confirmation (to the visitor who submitted the form). */
function confirmationEmail({ name, subject, message }) {
  return layout(`
    <h1 style="margin:0 0 6px;font-size:20px;font-weight:800;color:${INK};">Thanks, ${escapeHtml(name)}! 👋</h1>
    <p style="margin:0 0 20px;color:${MUTED};font-size:14px;line-height:1.6;">
      We've received your message and our team will get back to you shortly.
      Here's a copy for your records.
    </p>
    <p style="margin:0 0 8px;color:${MUTED};font-size:13px;">Subject</p>
    <p style="margin:0 0 16px;color:${INK};font-size:14px;font-weight:600;">${escapeHtml(subject)}</p>
    <p style="margin:0 0 8px;color:${MUTED};font-size:13px;">Your message</p>
    <div style="background:#f9f9fb;border:1px solid #eee;border-radius:12px;padding:16px;color:${INK};font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</div>
    <p style="margin:24px 0 0;color:${MUTED};font-size:14px;line-height:1.6;">
      Need to add something? Just reply to this email and it'll reach us at
      <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND};text-decoration:none;">${SUPPORT_EMAIL}</a>.
    </p>
    <p style="margin:16px 0 0;color:${INK};font-size:14px;font-weight:700;">— The Amcar team</p>
  `);
}

/** Minimal HTML escaping so submitted text can't inject markup into the email. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { notificationEmail, confirmationEmail };
