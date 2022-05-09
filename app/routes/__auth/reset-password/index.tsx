import { AuthHeading, AuthText } from "~/components/auth/AuthPage";
import { Card, CardContent } from "~/components/auth/Card";
import { Form } from "~/components/form/Form";
import { requestResetPasswordValidator } from "~/utils/validations/authValidations";
import { RequestResetPasswordForm } from "~/components/auth/RequestResetPasswordForm";
import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { requestResetPassword } from "~/utils/auth/reset-password.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await requestResetPasswordValidator.validate(
    await request.formData()
  );

  if (data.error) return validationError(data.error);
  const { email } = data.data;
  return requestResetPassword({ email, request });
};

export default function RequestResetPasswordRoute() {
  return (
    <>
      <AuthHeading>Beantrage dein Passwort zurückzusetzen</AuthHeading>
      <AuthText>
        Falls du mit deiner E-Mail Adresse bei Team Funds angemeldet bist wird
        dir ein Link zum Zurücksetzen deines Passwortes zugeschickt
      </AuthText>
      <Card>
        <CardContent>
          <Form
            validator={requestResetPasswordValidator}
            submitText={"Passwort zurücksetzen"}
            method={"post"}
          >
            <RequestResetPasswordForm />
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
