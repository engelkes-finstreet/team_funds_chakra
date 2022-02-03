import { PunishmentType } from "@prisma/client";
import { Select, SelectProps } from "~/components/form/Select";
import {
  getPunishmentTypeMapping,
  ZodPunishmentType,
} from "~/utils/enumMappings";

export function PunishmentTypeSelect({
  name,
  label,
  setPunishmentType,
  ...rest
}: Omit<SelectProps, "children"> & { setPunishmentType: Function }) {
  return (
    <Select
      name={name}
      label={label}
      {...rest}
      onChange={(event) => setPunishmentType(event.currentTarget.value)}
    >
      {Object.keys(PunishmentType).map((punishmentType) => (
        <option key={punishmentType} value={punishmentType}>
          {getPunishmentTypeMapping(punishmentType as ZodPunishmentType)}
        </option>
      ))}
    </Select>
  );
}
