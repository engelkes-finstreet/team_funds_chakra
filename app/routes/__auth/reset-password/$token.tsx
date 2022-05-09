import { DataFunctionArgs } from "@remix-run/server-runtime";
import { AuthHeading, AuthText } from "~/components/auth/AuthPage";
import { Card, CardContent } from "~/components/auth/Card";
import { PasswordField } from "~/components/form/PasswordField";
import * as React from "react";
import { Form } from "~/components/form/Form";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { password } from "~/utils/validations/authValidations";
import { ActionFunction } from "remix";

const resetPasswordValidator = withZod(
  z
    .object({
      password,
      passwordConfirmation: password,
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwörter stimmen nicht überein",
      path: ["passwordConfirmation"],
    })
);

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  //TOOD: Check if token is valid
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  //TODO: Call reset password action
};

export default function ResetPasswordRoute() {
  return (
    <>
      <AuthHeading>Setze nun dein Passwort zurück</AuthHeading>
      <AuthText>
        Gebe ein neues Passwort ein um dein Passwort zurückzusetzen
      </AuthText>
      <Card>
        <CardContent>
          <Form
            submitText={"Passwort zurücksetzen"}
            validator={resetPasswordValidator}
            method={"post"}
          >
            <ResetPasswordForm />
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

const ResetPasswordForm = () => {
  return (
    <>
      <PasswordField label={"neues Passwort"} name={"password"} />
      <PasswordField
        label={"Passwort bestätigen"}
        name={"passwordConfirmation"}
      />
    </>
  );
};
