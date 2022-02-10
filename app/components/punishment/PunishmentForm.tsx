import { TextField } from "~/components/form/TextField";
import { PunishmentTypeComponent } from "~/components/punishment/PunishmentTypeSelect";
import React from "react";
import { useLoaderData } from "remix";
import { GetAllSeasonsType } from "~/backend/season/getAllSeasons";
import { Select } from "~/components/form/Select";

type Props = {
  firstInputRef?: React.RefObject<HTMLInputElement>;
};

export default function PunishmentForm({ firstInputRef }: Props) {
  const { seasons } = useLoaderData<GetAllSeasonsType>();

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
