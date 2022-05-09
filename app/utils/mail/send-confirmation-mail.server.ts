import { sendMail } from "~/utils/mail/sendMail.server";
import { ConfirmType } from "~/utils/mail/types";
import { UserType } from "~/utils/enums/UserType";
import { getConnectionString } from "~/utils/functions";

type SendConfirmationMail = {
  token: string;
  to: string;
  userType: UserType;
  request: Request;
};
export async function sendConfirmationMail({
  token,
  to,
  userType,
  request,
}: SendConfirmationMail) {
  let userRoute = userType === UserType.USER ? "user" : "admin";

  const connectionString = getConnectionString({ request });
  const confirmLink = `${connectionString}/${userRoute}/verify/${token}`;
  await sendMail<ConfirmType>({
    templateVars: { confirmLink },
    templateFile: "confirm.html",
    subject: "Account bestätigen",
    to,
  });
}
