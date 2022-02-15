import { capitalize, playerNameFromSlug } from "~/utils/functions";
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
        return {
          name: playerNameFromSlug(slug),
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
