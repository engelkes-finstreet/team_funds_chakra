import { Select } from "../form/Select";
import { Role } from "@prisma/client";

export function UserForm() {
  return (
    <>
      <Select name={"role"}>
        {Object.keys(Role).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </Select>
    </>
  );
}
