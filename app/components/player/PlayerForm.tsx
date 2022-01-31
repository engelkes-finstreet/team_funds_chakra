import { TextField } from "~/components/form/TextField";
import { Select } from "~/components/form/Select";
import { Position } from "@prisma/client";
import { getPositionMapping, PositionType } from "~/utils/enumMappings";

export function PlayerForm() {
  return (
    <>
      <TextField label={"Vorname"} name={"firstName"} autoFocus={true} />
      <TextField label={"Nachname"} name={"lastName"} />
      <Select name={"position"} label={"Position"}>
        {Object.keys(Position).map((position) => (
          <option key={position} value={position}>
            {getPositionMapping(position as PositionType)}
          </option>
        ))}
      </Select>
    </>
  );
}
