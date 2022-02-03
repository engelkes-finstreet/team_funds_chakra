import { TextField } from "~/components/form/TextField";
import { NumberField } from "~/components/form/NumberField";
import { PunishmentTypeSelect } from "~/components/punishment/PunishmentTypeSelect";
import { useState } from "react";
import { IoMdBeer } from "react-icons/io";
import { MdEuroSymbol } from "react-icons/md";

export default function PunishmentForm() {
  const [punishmentType, setPunishmentType] = useState("MONEY");

  return (
    <>
      <TextField
        name={"punishmentName"}
        label={"Strafenname"}
        placeholder={"Name der Strafe"}
        autoFocus={true}
      />
      <NumberField
        name={"amount"}
        label={"Höhe der Strafe"}
        icon={punishmentType === "MONEY" ? <MdEuroSymbol /> : <IoMdBeer />}
      />
      <PunishmentTypeSelect
        name={"punishmentType"}
        label={"Typ der Strafe"}
        setPunishmentType={setPunishmentType}
      />
    </>
  );
}
