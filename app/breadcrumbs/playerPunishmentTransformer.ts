import { playerNameFromSlug } from "~/utils/functions";
import { BreadcrumbTransformer } from "./index";

export const playerPunishmentTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "Strafe hinzufügen",
    }),
  },
  {
    transform: (slug) => {
      return {
        name: playerNameFromSlug(slug),
      };
    },
  },
];
