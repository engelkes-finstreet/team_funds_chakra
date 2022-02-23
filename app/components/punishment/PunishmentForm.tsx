import { TextField } from "~/components/form/TextField";
import { PunishmentTypeComponent } from "~/components/punishment/PunishmentTypeSelect";
import React from "react";
import { useLoaderData } from "remix";
import { AllSeasonsType } from "~/backend/season/getAllSeasons";
import { Select } from "~/components/form/Select";
import { Season } from "@prisma/client";

type Props = {
  firstInputRef?: React.RefObject<HTMLInputElement>;
  seasons: Array<Season>;
};

export default function PunishmentForm({ firstInputRef, seasons }: Props) {
  return (
    <>
      <TextField
        name={"punishmentName"}
        label={"Strafenname"}
        placeholder={"Name der Strafe"}
        autoFocus={true}
        ref={firstInputRef}
      />
      <PunishmentTypeComponent
        autoFocus={false}
        selectName={"punishmentType"}
        selectLabel={"Typ der Strafe"}
        textFieldName={"amount"}
        textFieldLabel={"Höhe der Strafe"}
      />
      <Select name={"seasonId"} label={"Saison"}>
        {seasons.map((season) => (
          <option key={season.id} value={season.id}>
            {season.slug}
          </option>
        ))}
      </Select>
    </>
  );
}
