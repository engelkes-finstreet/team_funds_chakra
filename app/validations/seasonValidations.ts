import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";

export const seasonValidator = withZod(
  z.object({
    startYear: z.string(),
  })
);
