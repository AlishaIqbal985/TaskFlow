
import { Resend } from "resend";

export default async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing from server/.env");
  }

  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL is missing from server/.env");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [email],
    subject: "Reset your TaskFlow password",

    text: `Hi ${name},

We received a request to reset your TaskFlow password.

Use this link to reset your password:
${resetUrl}

This link expires in 15 minutes. If you did not request this, you can ignore this email.`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 28px; color: #1f2937;">
        <h2 style="color: #0f766e;">Reset your TaskFlow password</h2>

        <p>Hi ${escapeHtml(name)},</p>

        <p>We received a request to reset your TaskFlow password.</p>

        <p style="margin: 28px 0;">
          <a
            href="${escapeHtml(resetUrl)}"
            style="background: #0f766e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;"
          >
            Reset Password
          </a>
        </p>

        <p>This link expires in 15 minutes.</p>

        <p>If you did not request this, you can safely ignore this email.</p>

        <p style="font-size: 12px; color: #6b7280;">
          TaskFlow Account Security
        </p>
      </div>
    `,
  });

 if (error) {
  console.error("Resend API error details:", JSON.stringify(error));
  throw new Error(
    error.message || "Unable to send password reset email."
  );
}

  return data;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}
