import { TextField } from "~/components/form/TextField";
import { NumberField } from "~/components/form/NumberField";
import { PunishmentTypeSelect } from "~/components/punishment/PunishmentTypeSelect";
import React, { useState } from "react";
import { IoMdBeer } from "react-icons/io";
import { MdEuroSymbol } from "react-icons/md";
import { useLoaderData } from "remix";
import { GetAllSeasonsType } from "~/backend/season/getAllSeasons";
import { Select } from "~/components/form/Select";

type Props = {
  firstInputRef?: React.RefObject<HTMLInputElement>;
};

export default function PunishmentForm({ firstInputRef }: Props) {
  const { seasons } = useLoaderData<GetAllSeasonsType>();
  const [punishmentType, setPunishmentType] = useState("MONEY");

  return (
    <>
      <TextField
        name={"punishmentName"}
        label={"Strafenname"}
        placeholder={"Name der Strafe"}
        autoFocus={true}
        ref={firstInputRef}
      />
      <PunishmentTypeSelect
        name={"punishmentType"}
        label={"Typ der Strafe"}
        setPunishmentType={setPunishmentType}
      />
      <TextField
        name={"amount"}
        label={"Höhe der Strafe"}
        inputLeftElement={
          punishmentType === "MONEY" ? <MdEuroSymbol /> : <IoMdBeer />
        }
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
