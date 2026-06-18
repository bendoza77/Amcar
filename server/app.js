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
    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM, // must be a verified Resend sender/domain
      to: [process.env.MAIL_TO],
      replyTo: email,
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

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ ok: false, error: "SEND_FAILED" });
    }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
