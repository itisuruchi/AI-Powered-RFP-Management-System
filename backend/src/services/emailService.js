// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT, 10),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// module.exports = async function sendEmail({ to, subject, text, html }) {
//   return transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to,
//     subject,
//     text,
//     html
//   });
// };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Test email
transporter.sendMail({
  from: process.env.SMTP_EMAIL,
  to: "receiver@gmail.com",
  subject: "Test Email",
  text: "SMTP is working 🚀"
}, (err, info) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Email sent:", info.response);
  }
});
