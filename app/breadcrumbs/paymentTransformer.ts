import { capitalize, playerNameFromSlug } from "~/utils/functions";
import { BreadcrumbTransformer } from "./index";

export const paymentTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "Bezahlen",
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
