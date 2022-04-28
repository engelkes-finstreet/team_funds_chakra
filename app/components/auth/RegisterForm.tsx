import * as React from "react";
import { PasswordField } from "../form/PasswordField";
import { TextField } from "~/components/form/TextField";

export const RegisterAdminForm = () => {
  return (
    <>
      <TextField name={"email"} label={"E-Mail"} autoFocus={true} />
      <PasswordField label={"Passwort"} name={"password"} />
      <PasswordField
        label={"Passwort Bestätigen"}
        name={"passwordConfirmation"}
      />
    </>
  );
};

export const RegisterForm = () => {
  return (
    <>
      <TextField name={"email"} label={"E-Mail"} autoFocus={true} />
      <TextField name={"firstName"} label={"Vorname"} />
      <TextField name={"lastName"} label={"Nachname"} />
      <PasswordField label={"Passwort"} name={"password"} />
      <PasswordField
        label={"Passwort Bestätigen"}
        name={"passwordConfirmation"}
      />
    </>
  );
};
