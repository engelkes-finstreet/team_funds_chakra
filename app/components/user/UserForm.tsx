import { Select } from "../form/Select";
import { Role } from "@prisma/client";
import { getRoleMapping, RoleType } from "~/utils/enumMappings";

export function UserForm() {
  return (
    <>
      <Select name={"role"} label={"Rolle"} autoFocus={true}>
        {Object.keys(Role).map((role) => (
          <option key={role} value={role}>
            {getRoleMapping(role as RoleType)}
          </option>
        ))}
      </Select>
    </>
  );
}
