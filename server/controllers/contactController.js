const { Resend } = require("resend");
const { notificationEmail, confirmationEmail } = require("../utils/emailTemplates");

const resend = new Resend(process.env.RESEND_API_KEY);

// Where replies should land (your inbox). Falls back to MAIL_TO.
const REPLY_TO = process.env.MAIL_REPLY_TO || process.env.MAIL_TO;

const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * POST /api/contact — validates a website contact submission, emails the
 * business inbox, and sends a confirmation copy back to the visitor.
 */
async function sendContact(req, res) {
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

    // 2) Send a confirmation copy to the visitor.
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
}

module.exports = { sendContact };
