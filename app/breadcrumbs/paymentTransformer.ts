import { capitalize } from "~/utils/functions";
import { BreadcrumbTransformer } from "./index";

export const paymentTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "Bezahlen",
    }),
  },
];
