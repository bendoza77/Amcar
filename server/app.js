require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    // Comma-separated list of allowed origins, e.g. "https://www.amcar.ge,https://amcar.ge"
    origin: (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim()),
  })
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Where replies should land (your inbox). Falls back to MAIL_TO.
const REPLY_TO = process.env.MAIL_REPLY_TO || process.env.MAIL_TO;

const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  // Validation
  if (!name || !isEmail(email) || !message) {
    return res.status(400).json({ ok: false, error: "INVALID_INPUT" });
  }
  if (name.length > 200 || (subject && subject.length > 200) || message.length > 5000) {
    return res.status(400).json({ ok: false, error: "TOO_LONG" });
  }

  const cleanSubject = subject?.trim() || "New contact message";

  try {
    // 1) Notify the business inbox.
    const notify = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: [process.env.MAIL_TO],
      replyTo: email, // reply goes back to the visitor
      subject: `[Amcar] ${cleanSubject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${cleanSubject}\n\n${message}`,
      html: notificationEmail({ name, email, subject: cleanSubject, message }),
    });

    if (notify.error) {
      console.error("Resend notify error:", notify.error);
      return res.status(502).json({ ok: false, error: "SEND_FAILED" });
    }

    // 2) Send a confirmation copy to the visitor. Reply-To points to your Gmail
    //    so the visitor can reply and reach amcar2drivers@gmail.com.
    const confirm = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: [email],
      replyTo: REPLY_TO,
      subject: "We received your message — Amcar",
      text: `Hi ${name},\n\nThanks for reaching out to Amcar. We've received your message and will get back to you shortly.\n\nYour message:\n${message}\n\n— The Amcar team\n${REPLY_TO}`,
      html: confirmationEmail({ name, subject: cleanSubject, message }),
    });

    if (confirm.error) {
      // The business was still notified; surface a softer failure.
      console.error("Resend confirmation error:", confirm.error);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
    return res.status(502).json({ ok: false, error: "SEND_FAILED" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
