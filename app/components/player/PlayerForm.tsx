import { TextField } from "~/components/form/TextField";
import { Select } from "~/components/form/Select";
import { Position } from "@prisma/client";
import { getPositionMapping, PositionType } from "~/utils/enumMappings";
import React from "react";

type Props = {
  firstInputRef?: React.RefObject<HTMLInputElement>;
};

export function PlayerForm({ firstInputRef }: Props) {
  return (
    <>
      <TextField
        label={"Vorname"}
        placeholder={"Vorname des Spielers"}
        name={"firstName"}
        autoFocus={true}
        ref={firstInputRef}
      />
      <TextField
        label={"Nachname"}
        placeholder={"Nachname des Spielers"}
        name={"lastName"}
      />
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
