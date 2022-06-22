import nodemailer from "nodemailer";
import { confirmMail } from "~/mail/confirm";

type Props = {
  subject: string;
  to: string;
  html: string;
};

export async function sendMail({ html, subject, to }: Props) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: subject,
      html,
      text: html,
    });
  } catch (e) {
    console.error(e);
  }
}
