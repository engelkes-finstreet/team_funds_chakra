import { PunishmentType } from "@prisma/client";
import { Select, SelectProps } from "~/components/form/Select";
import {
  getPunishmentTypeMapping,
  ZodPunishmentType,
} from "~/utils/enumMappings";

export function PunishmentTypeSelect({
  name,
  label,
  ...rest
}: Omit<SelectProps, "children">) {
  return (
    <Select name={name} label={label} {...rest}>
      {Object.keys(PunishmentType).map((punishmentType) => (
        <option key={punishmentType} value={punishmentType}>
          {getPunishmentTypeMapping(punishmentType as ZodPunishmentType)}
        </option>
      ))}
    </Select>
  );
}
