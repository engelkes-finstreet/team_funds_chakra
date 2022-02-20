import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";

export const loginValidator = withZod(
  z.object({
    email: z
      .string()
      .nonempty("Du musst eine Email eingeben")
      .email("Muss eine gültige Mail-Adresse sein"),
    password: z.string({
      required_error: "Ein Passwort muss eingegeben werden",
    }),
    redirectTo: z.string(),
  })
);

const password = z
  .string()
  .min(6, "Das Passwort muss mindestens 6 Zeichen lang sein")
  .max(100);

export const adminRegisterValidator = withZod(
  z
    .object({
      email: z
        .string()
        .nonempty("Du musst eine Email eingeben")
        .email("Muss eine gültige Mail-Adresse sein"),
      password: password,
      passwordConfirmation: password,
      redirectTo: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwörter stimmen nicht überein",
      path: ["passwordConfirmation"],
    })
);
