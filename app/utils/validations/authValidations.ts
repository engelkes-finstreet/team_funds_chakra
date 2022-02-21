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

const email = z
  .string()
  .nonempty("Du musst eine E-Mail eingeben")
  .email("Du musst eine gülte Mail-Adresse eingeben");

const firstName = z.string().nonempty("Vorname muss eingegeben werden");
const lastName = z.string().nonempty("Nachname muss eingegeben werden");

export const updateProfileValidator = withZod(
  z.object({
    _userId: z.string(),
    firstName,
    lastName,
  })
);

export const registerValidator = withZod(
  z
    .object({
      email: email,
      password: password,
      passwordConfirmation: password,
      firstName,
      lastName,
      redirectTo: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwörter stimmen nicht überein",
      path: ["passwordConfirmation"],
    })
);

export const adminRegisterValidator = withZod(
  z
    .object({
      email: email,
      password: password,
      passwordConfirmation: password,
      redirectTo: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwörter stimmen nicht überein",
      path: ["passwordConfirmation"],
    })
);

export const resetPasswordValidator = withZod(
  z
    .object({
      _userId: z.string(),
      oldPassword: z.string().nonempty("Altes Passwort muss eingegeben werden"),
      password,
      passwordConfirmation: password,
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwörter stimmen nicht überein",
      path: ["passwordConfirmation"],
    })
);
