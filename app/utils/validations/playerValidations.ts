import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { Position } from "@prisma/client";
import { checkbox } from "~/utils/validations/utils";

export const playerValidator = withZod(
  z.object({
    firstName: z.string().nonempty("Erforderlich"),
    lastName: z.string().nonempty("Erforderlich"),
    position: z.nativeEnum(Position),
    createOtherPlayer: checkbox(),
  })
);

export const deletePlayerValidator = withZod(
  z.object({
    _playerId: z.string(),
    _method: z.string(),
  })
);
