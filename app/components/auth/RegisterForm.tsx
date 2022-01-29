import * as React from "react";
import { PasswordField } from "../form/PasswordField";
import { TextField } from "~/components/form/TextField";
import { useSearchParams } from "remix";

export const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  return (
    <>
      <input
        type="hidden"
        name="redirectTo"
        value={searchParams.get("redirectTo") ?? "/"}
      />
      <TextField name={"email"} label={"E-Mail"} />
      <PasswordField label={"Passwort"} name={"password"} />
      <PasswordField
        label={"Passwort Bestätigen"}
        name={"passwordConfirmation"}
      />
    </>
  );
};
