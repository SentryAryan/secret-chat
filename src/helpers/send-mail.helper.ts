import nodemailer from "nodemailer";
import { generateApiError } from "./api-error.helper";

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<nodemailer.SentMessageInfo> => {
  try {
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || "465"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw generateApiError(
      500,
      `Failed to send email: ${error.message}`,
      error.errors || [error.message]
    );
  }
};
