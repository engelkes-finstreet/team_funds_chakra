import { capitalize } from "~/utils/functions";
import { BreadcrumbTransformer } from "./index";

export const punishmentTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "Strafe",
    }),
  },
  {
    transform: (slug: string) => {
      if (slug === "new") {
        return {
          name: "Erstellen",
        };
      } else {
        return {
          name: capitalize(slug),
        };
      }
    },
  },
  {
    transform: () => ({
      name: "Bearbeiten",
    }),
  },
];
