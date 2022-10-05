import { readFileSync } from "fs";
import { compile } from "handlebars";
import { SendVerificationRequestParams } from "next-auth/providers";
import { createTransport } from "nodemailer";
import { join, resolve } from "path";

const transporter = createTransport({
  host: process.env.POSTMARK_SMTP_SERVER,
  port: parseInt(process.env.POSTMARK_SMTP_PORT || "0"),
  auth: {
    user: process.env.POSTMARK_SMTP_USERNAME,
    pass: process.env.POSTMARK_SMTP_PASSWORD,
  },
  //secure: true,
});

export const templatesDirectory = resolve(
  process.cwd(),
  "app/utility/mail/templates"
);
export const sendVerificationRequest = async (
  params: SendVerificationRequestParams
) => {
  const emailFile = readFileSync(join(templatesDirectory, "confirm.html"), {
    encoding: "utf8",
  });
  const emailTemplate = compile(emailFile);
  const result = await transporter.sendMail({
    from: `"Sahti.ma" ${process.env.POSTMARK_SMTP_FROM}`,
    to: params.identifier,
    subject: `Votre super lien de connexion - Sahti.ma`,
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: params.url,
      email: params.identifier,
    }),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
};

export default transporter;
