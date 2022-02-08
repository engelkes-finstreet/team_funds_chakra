import { TextField } from "~/components/form/TextField";
import { Select } from "~/components/form/Select";

export function SeasonForm() {
  const currentYear = new Date().getFullYear();
  const years = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
    currentYear + 3,
  ];

  return (
    <>
      <Select name={"startYear"} label={"Startjahr der Saison"}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </>
  );
}
