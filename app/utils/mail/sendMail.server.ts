import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import { htmlToText } from "html-to-text";
import juice from "juice";
import { MailTemplates } from "~/utils/mail/types";

type Props<TemplateVars> = {
  templateFile: MailTemplates;
  subject: string;
  to: string;
  templateVars: TemplateVars;
};

export async function sendMail<TemplateVars>({
  templateVars,
  templateFile,
  subject,
  to,
}: Props<TemplateVars>) {
  console.log({ host: process.env.SMTP_HOST });
  console.log({ port: process.env.SMTP_PORT });
  console.log({ pass: process.env.SMTP_PASS });
  console.log({ user: process.env.SMTP_USER });
  console.log({ user: process.env.MAIL_FROM });

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const templatePath = `app/mail/${templateFile}`;

  console.log({ filePathExists: fs.existsSync(templatePath) });
  if (templateFile && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, templateVars);
    const text = htmlToText(html);
    const htmlWithStylesInlined = juice(html);

    try {
      console.log("I was here to send mails");
      await transport.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: subject,
        html: htmlWithStylesInlined,
        text: text,
      });
    } catch (e) {
      console.log("I was here to report errors");
      console.error(e);
    }
  }
}
