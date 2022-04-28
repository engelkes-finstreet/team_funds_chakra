import { TextField } from "~/components/form/TextField";
import { PasswordField } from "~/components/form/PasswordField";
import * as React from "react";

export function ResetPasswordForm() {
  return (
    <>
      <TextField name={"_userId"} hidden={true} />
      <PasswordField label={"altes Passwort"} name={"oldPassword"} />
      <PasswordField label={"neues Passwort"} name={"password"} />
      <PasswordField
        label={"Passwort bestätigen"}
        name={"passwordConfirmation"}
      />
    </>
  );
}
