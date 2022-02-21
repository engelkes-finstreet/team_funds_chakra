import { TextField } from "~/components/form/TextField";

export function ProfileForm() {
  return (
    <>
      <TextField name={"_userId"} hidden={true} />
      <TextField name={"firstName"} label={"Vorname"} />
      <TextField name={"lastName"} label={"Nachname"} />
    </>
  );
}
