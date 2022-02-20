import * as React from "react";
import { TextField } from "~/components/form/TextField";
import { PasswordField } from "~/components/form/PasswordField";
import { useSearchParams } from "remix";

type Props = {
  redirectTo: string;
};

export const LoginForm = ({ redirectTo }: Props) => {
  const [searchParams] = useSearchParams();

  return (
    <>
      <input
        type="hidden"
        name="redirectTo"
        value={searchParams.get("redirectTo") ?? redirectTo}
      />
      <TextField label={"E-Mail"} name={"email"} autoFocus={true} />
      <PasswordField label={"Passwort"} name={"password"} />
    </>
  );
};
