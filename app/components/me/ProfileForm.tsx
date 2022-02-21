import { TextField } from "~/components/form/TextField";

export function ProfileForm() {
  return (
    <>
      <TextField name={"_userId"} hidden={true} />
      <TextField name={"firstName"} label={"Vorname"} autoFocus={true} />
      <TextField name={"lastName"} label={"Nachname"} />
    </>
  );
}
