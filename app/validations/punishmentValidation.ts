import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { PunishmentType } from "@prisma/client";
import { stringToNumberValidation } from "~/validations/utils";

export const punishmentValidator = withZod(
  z.object({
    punishmentName: z.string().nonempty("Name muss angegeben werden"),
    amount: stringToNumberValidation("Höhe der Strafe muss angegeben werden"),
    punishmentType: z.nativeEnum(PunishmentType),
  })
);
