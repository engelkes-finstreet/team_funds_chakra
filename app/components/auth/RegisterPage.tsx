import { Form } from "~/components/form/Form";
import { Validator } from "remix-validated-form";
import React from "react";
import { AuthPage } from "~/components/auth/AuthPage";

type Props = {
  heading: string;
  loginRoute: string;
  validator: Validator<any>;
  renderRegisterForm: () => React.ReactNode;
};

export function RegisterPage({
  heading,
  loginRoute,
  validator,
  renderRegisterForm,
}: Props) {
  const registerForm = renderRegisterForm();
  return (
    <AuthPage
      heading={heading}
      subHeading={"Hast du bereits einen Account?"}
      subHeadingLink={loginRoute}
      subHeadingText={"Hier geht's zum Login"}
    >
      <Form validator={validator} submitText={"Registrieren"} method={"post"}>
        {registerForm}
      </Form>
    </AuthPage>
  );
}
