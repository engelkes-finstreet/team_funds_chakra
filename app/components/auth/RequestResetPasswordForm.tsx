import { TextField } from "~/components/form/TextField";

export function RequestResetPasswordForm() {
  return <TextField name={"email"} label={"E-Mail"} autoFocus={true} />;
}
