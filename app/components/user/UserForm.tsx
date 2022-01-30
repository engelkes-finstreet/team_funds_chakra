import { Select } from "../form/Select";
import { Role } from "@prisma/client";

export function UserForm() {
  return (
    <>
      <Select name={"role"} label={"Rolle"} autoFocus={true}>
        {Object.keys(Role).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </Select>
    </>
  );
}
