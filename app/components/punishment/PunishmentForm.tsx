import { TextField } from "~/components/form/TextField";
import { NumberField } from "~/components/form/NumberField";
import { PunishmentTypeSelect } from "~/components/punishment/PunishmentTypeSelect";

export default function PunishmentForm() {
  return (
    <>
      <TextField
        name={"punishmentName"}
        label={"Strafenname"}
        placeholder={"Name der Strafe"}
        autoFocus={true}
      />
      <NumberField name={"amount"} label={"Höhe der Strafe"} />
      <PunishmentTypeSelect name={"punishmentType"} label={"Typ der Strafe"} />
    </>
  );
}
