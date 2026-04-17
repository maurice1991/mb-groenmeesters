import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Naam, e-mailadres en bericht zijn verplicht."
    });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({
      error: "SMTP omgevingsvariabelen ontbreken."
    });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.transip.email",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
  });

  try {
    const verifyResult = await transporter.verify();
    console.log("SMTP verify success:", verifyResult);

    const info = await transporter.sendMail({
      from: `"MB Groenmeesters" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: subject || "Nieuwe aanvraag via website",
      html: `
        <h2>Nieuwe aanvraag via website</h2>
        <p><strong>Naam:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefoon:</strong> ${escapeHtml(phone || "-")}</p>
        <p><strong>Onderwerp:</strong> ${escapeHtml(subject || "-")}</p>
        <p><strong>Bericht:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log("Mail sent:", info);

    return res.status(200).json({
      success: true,
      message: "Mail succesvol verzonden."
    });
  } catch (error) {
    console.error("MAIL ERROR FULL:", error);

    return res.status(500).json({
      error: error.message || "Mail versturen mislukt."
    });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}