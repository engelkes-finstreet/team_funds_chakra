import { BreadcrumbTransformer } from "./index";

export const userTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "User",
    }),
  },
  {
    transform: (slug: string) => {
      return {
        name: slug,
      };
    },
  },
  {
    transform: () => ({
      name: "Bearbeiten",
    }),
  },
];
