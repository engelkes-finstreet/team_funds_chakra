import { TextField } from "~/components/form/TextField";
import { Select } from "~/components/form/Select";
import { PunishmentType } from "@prisma/client";
import { NumberField } from "~/components/form/NumberField";

export default function PunishmentForm() {
  return (
    <>
      <TextField
        name={"punishmentName"}
        label={"Strafenname"}
        autoFocus={true}
      />
      <NumberField name={"amount"} label={"Höhe der Strafe"} />
      <Select name={"punishmentType"} label={"Typ der Strafe"}>
        {Object.keys(PunishmentType).map((punishmentType) => (
          <option key={punishmentType} value={punishmentType}>
            {punishmentType}
          </option>
        ))}
      </Select>
    </>
  );
}
