import { sendMail } from "~/utils/mail/sendMail.server";
import { ConfirmType } from "~/utils/mail/types";
import { UserType } from "~/utils/enums/UserType";

type SendConfirmationMail = {
  token: string;
  to: string;
  userType: UserType;
};
export async function sendConfirmationMail({
  token,
  to,
  userType,
}: SendConfirmationMail) {
  let userRoute = userType === UserType.USER ? "user" : "admin";

  const confirmLink = `http://localhost:3000/${userRoute}/verify/${token}`;
  await sendMail<ConfirmType>({
    templateVars: { confirmLink },
    templateFile: "confirm.html",
    subject: "Account bestätigen",
    to,
  });
}
