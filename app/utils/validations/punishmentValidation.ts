import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { PunishmentType } from "@prisma/client";
import {
  checkbox,
  stringToNumberValidationAndTransformation,
} from "~/utils/validations/utils";

export const punishmentValidator = withZod(
  z.object({
    punishmentName: z.string().nonempty("Erforderlich"),
    amount: stringToNumberValidationAndTransformation("Erforderlich"),
    punishmentType: z.nativeEnum(PunishmentType),
    seasonId: z.string(),
    createOtherPunishment: checkbox(),
  })
);

export const deletePunishmentValidator = withZod(
  z.object({
    _punishmentId: z.string(),
    _method: z.string(),
  })
);
