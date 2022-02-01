import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { Position } from "@prisma/client";

export const playerValidator = withZod(
  z.object({
    firstName: z.string().nonempty("Erforderlich"),
    lastName: z.string().nonempty("Erforderlich"),
    position: z.nativeEnum(Position),
  })
);
