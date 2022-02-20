import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { PunishmentType } from "@prisma/client";
import { checkbox, stringToNumberValidation } from "~/utils/validations/utils";

export const punishmentValidator = withZod(
  z.object({
    punishmentName: z.string().nonempty("Erforderlich"),
    amount: stringToNumberValidation("Erforderlich"),
    punishmentType: z.nativeEnum(PunishmentType),
    seasonId: z.string(),
    createOtherPunishment: checkbox(),
  })
);
