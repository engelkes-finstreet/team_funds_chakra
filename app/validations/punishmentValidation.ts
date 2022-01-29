import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { PunishmentType } from "@prisma/client";
import { stringToNumberValidation } from "~/validations/utils";

export const punishmentValidator = withZod(
  z.object({
    punishmentName: z.string(),
    amount: stringToNumberValidation("Es dürfen nur Zahlen eingegeben werden"),
    punishmentType: z.nativeEnum(PunishmentType),
  })
);
