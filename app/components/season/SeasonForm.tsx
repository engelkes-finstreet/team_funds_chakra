import { TextField } from "~/components/form/TextField";

export function SeasonForm() {
  return (
    <>
      <TextField
        label={"Zeitraum"}
        placeholder={"Zeitraum der Saison z.B. 20-21"}
        name={"timePeriod"}
        autoFocus={true}
      />
    </>
  );
}
