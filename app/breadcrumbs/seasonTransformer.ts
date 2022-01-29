import { capitalize } from "~/utils/functions";
import { BreadcrumbTransformer } from "./index";

export const seasonTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "Saison",
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
