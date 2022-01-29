import { capitalize } from "~/utils/functions";
import { BreadcrumbTransformer } from "./index";

export const playerTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "Spieler",
    }),
  },
  {
    transform: (slug: string) => {
      if (slug === "new") {
        return {
          name: "Erstellen",
        };
      } else {
        const fromSlug = slug
          .split("-")
          .map((name) => capitalize(name))
          .join(" ");
        return {
          name: fromSlug,
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
