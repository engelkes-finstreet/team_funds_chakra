import * as React from "react";
import { TextField } from "~/components/form/TextField";
import { PasswordField } from "~/components/form/PasswordField";
import { useSearchParams } from "remix";

export const LoginForm = () => {
  const [searchParams] = useSearchParams();

  return (
    <>
      <input
        type="hidden"
        name="redirectTo"
        value={searchParams.get("redirectTo") ?? "/"}
      />
      <TextField label={"E-Mail"} name={"email"} />
      <PasswordField label={"Passwort"} name={"password"} />
    </>
  );
};
