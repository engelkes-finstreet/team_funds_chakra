import { TextField } from "~/components/form/TextField";
import { Select } from "~/components/form/Select";
import { Position } from "@prisma/client";

export function PlayerForm() {
  return (
    <>
      <TextField label={"Vorname"} name={"firstName"} />
      <TextField label={"Nachname"} name={"lastName"} />
      <Select name={"position"}>
        {Object.keys(Position).map((position) => (
          <option key={position} value={position}>
            {position}
          </option>
        ))}
      </Select>
    </>
  );
}
