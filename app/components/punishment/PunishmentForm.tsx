import { TextField } from "~/components/form/TextField";
import { NumberField } from "~/components/form/NumberField";
import { PunishmentTypeSelect } from "~/components/punishment/PunishmentTypeSelect";
import { useState } from "react";
import { IoMdBeer } from "react-icons/io";
import { MdEuroSymbol } from "react-icons/md";
import { useLoaderData } from "remix";
import { GetAllSeasonsType } from "~/backend/season/getAllSeasons";
import { Select } from "~/components/form/Select";

export default function PunishmentForm() {
  const { seasons } = useLoaderData<GetAllSeasonsType>();
  const [punishmentType, setPunishmentType] = useState("MONEY");

  return (
    <>
      <TextField
        name={"punishmentName"}
        label={"Strafenname"}
        placeholder={"Name der Strafe"}
        autoFocus={true}
      />
      <PunishmentTypeSelect
        name={"punishmentType"}
        label={"Typ der Strafe"}
        setPunishmentType={setPunishmentType}
      />
      <NumberField
        name={"amount"}
        label={"Höhe der Strafe"}
        icon={punishmentType === "MONEY" ? <MdEuroSymbol /> : <IoMdBeer />}
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
