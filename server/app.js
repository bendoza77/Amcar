require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    // Comma-separated list of allowed origins, e.g. "https://amcar.ge,http://localhost:5173"
    origin: (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim()),
  })
);

// One shared transporter, reused across requests.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

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
    await transporter.sendMail({
      from: `"Amcar Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `[Amcar] ${cleanSubject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${cleanSubject}\n\n${message}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
    return res.status(502).json({ ok: false, error: "SEND_FAILED" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/** Minimal HTML escaping so submitted text can't inject markup into the email. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
