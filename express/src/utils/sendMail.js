import nodemailer from "nodemailer";
import logger from "../config/logger.js";
import dotenv from "dotenv";

dotenv.config();

// You can put these in .env for security & flexibility
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM_EMAIL,
  SMTP_FROM_NAME,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  logger.error("Missing SMTP configuration in environment variables");
}

console.log({
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS: SMTP_PASS ? "****" : null, // Don't print real pass
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendMail({ to, subject, text, html }) {
  if (!to || !subject || (!text && !html)) {
    logger.error("Missing required fields: to, subject, and text or html");
  }

  const mailOptions = {
    from: SMTP_FROM_NAME
      ? `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`
      : SMTP_FROM_EMAIL,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}

export default sendMail;
