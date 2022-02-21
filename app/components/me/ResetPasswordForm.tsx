import { TextField } from "~/components/form/TextField";
import { PasswordField } from "~/components/form/PasswordField";
import * as React from "react";

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
};

export function ResetPasswordForm({ inputRef }: Props) {
  return (
    <>
      <TextField name={"_userId"} hidden={true} />
      <PasswordField
        label={"altes Passwort"}
        name={"oldPassword"}
        ref={inputRef}
      />
      <PasswordField label={"neues Passwort"} name={"password"} />
      <PasswordField
        label={"Passwort Bestätigen"}
        name={"passwordConfirmation"}
      />
    </>
  );
}
