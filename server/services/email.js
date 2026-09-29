import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } =
  process.env;

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_TO_EMAIL);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 465),
      secure: SMTP_SECURE !== "false",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

/** Owner notification */
export async function notifyOwner({ name, email, message }) {
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping notification.");
    return false;
  }
  await transporter.sendMail({
    from: `"Portfolio Bot" <${SMTP_USER}>`,
    to: CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `📬 New portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px">
        <h2 style="color:#10B981">New portfolio message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <hr />
        <p style="white-space:pre-line">${escapeHtml(message)}</p>
      </div>`,
  });
  return true;
}

/** Automated acknowledgement to the sender */
export async function sendAutoReply({ name, email }) {
  if (!transporter) return false;
  await transporter.sendMail({
    from: `"Portfolio" <${SMTP_USER}>`,
    to: email,
    subject: "Thanks for reaching out!",
    text: `Hi ${name},\n\nThanks for your message — I've received it and will get back to you within 24 hours.\n\nBest regards.`,
  });
  return true;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
