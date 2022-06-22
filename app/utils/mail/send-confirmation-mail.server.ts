import { sendMail } from "~/utils/mail/sendMail.server";
import { UserType } from "~/utils/enums/UserType";
import { getConnectionString } from "~/utils/functions";
import { confirmMail } from "~/mail/confirm";

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
  const html = confirmMail({ confirmLink });

  await sendMail({
    html,
    subject: "Account bestätigen",
    to,
  });
}
