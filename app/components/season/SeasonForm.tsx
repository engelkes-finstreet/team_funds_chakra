import { TextField } from "~/components/form/TextField";

export function SeasonForm() {
  return (
    <>
      <TextField label={"Zeitraum"} name={"timePeriod"} autoFocus={true} />
    </>
  );
}
