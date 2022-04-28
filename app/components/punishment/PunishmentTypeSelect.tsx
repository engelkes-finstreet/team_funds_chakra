import { Select, SelectProps } from "~/components/form/Select";
import {
  getPunishmentTypeMapping,
  ZodPunishmentType,
} from "~/utils/enumMappings";
import React, { useState } from "react";
import { PunishmentType } from "@prisma/client";
import { TextField } from "~/components/form/TextField";
import { MdEuroSymbol } from "react-icons/md";
import { IoMdBeer } from "react-icons/io";
import { useAfterTransition } from "~/hooks/useAfterTransition";

export function PunishmentTypeSelect({
  name,
  label,
  setPunishmentType,
  ...rest
}: Omit<SelectProps, "children"> & { setPunishmentType: Function }) {
  /*
    The form reset does not trigger the "onChange" or "onReset" method from the Select field.
    We use the same logic to determine if the form was submitted and reset the punishment type manually here
   */
  useAfterTransition(() => {
    setPunishmentType("MONEY");
  });

  return (
    <Select
      name={name}
      label={label}
      {...rest}
      onChange={(event) => {
        setPunishmentType(event.currentTarget.value);
      }}
    >
      {Object.keys(PunishmentType).map((punishmentType) => (
        <option key={punishmentType} value={punishmentType}>
          {getPunishmentTypeMapping(punishmentType as ZodPunishmentType)}
        </option>
      ))}
    </Select>
  );
}

type Props = {
  autoFocus: boolean;
  selectName: string;
  selectLabel: string;
  textFieldName: string;
  textFieldLabel: string;
};

export function PunishmentTypeComponent({
  autoFocus,
  selectName,
  selectLabel,
  textFieldName,
  textFieldLabel,
}: Props) {
  const [punishmentType, setPunishmentType] = useState<PunishmentType>("MONEY");

  return (
    <>
      <PunishmentTypeSelect
        name={selectName}
        label={selectLabel}
        autoFocus={autoFocus}
        setPunishmentType={setPunishmentType}
      />
      <TextField
        name={textFieldName}
        label={textFieldLabel}
        inputLeftElement={
          punishmentType === "MONEY" ? <MdEuroSymbol /> : <IoMdBeer />
        }
      />
    </>
  );
}
