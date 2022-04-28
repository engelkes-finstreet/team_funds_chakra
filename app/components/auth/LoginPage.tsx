import { Form } from "~/components/form/Form";
import { loginValidator } from "~/utils/validations/authValidations";
import { LoginForm } from "~/components/auth/LoginForm";
import React from "react";
import { AuthPage } from "~/components/auth/AuthPage";

type Props = {
  heading: string;
  subHeading: string;
  registerRoute: string;
  redirectTo: string;
};

export function LoginPage({
  heading,
  subHeading,
  registerRoute,
  redirectTo,
}: Props) {
  return (
    <AuthPage
      heading={heading}
      subHeading={subHeading}
      subHeadingLink={registerRoute}
      subHeadingText={"Registriere dich jetzt"}
    >
      <Form validator={loginValidator} submitText={"Login"} method={"post"}>
        <LoginForm redirectTo={redirectTo} />
      </Form>
    </AuthPage>
  );
}
