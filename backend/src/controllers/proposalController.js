const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text,
    });

    return res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
