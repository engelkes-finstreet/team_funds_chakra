import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { Position } from "@prisma/client";

export const playerValidator = withZod(
  z.object({
    firstName: z.string().nonempty("Ein Vorname muss angegeben werden"),
    lastName: z.string().nonempty("Ein Nachname muss angegeben werden"),
    position: z.nativeEnum(Position),
  })
);
