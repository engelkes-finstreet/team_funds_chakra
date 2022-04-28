import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";

const email = z
  .string()
  .nonempty("Du musst eine E-Mail eingeben")
  .email("Du musst eine gülte Mail-Adresse eingeben");

export const loginValidator = withZod(
  z.object({
    email,
    password: z.string({
      required_error: "Ein Passwort muss eingegeben werden",
    }),
    redirectTo: z.string(),
  })
);

export const password = z
  .string()
  .min(6, "Das Passwort muss mindestens 6 Zeichen lang sein")
  .max(100);

export const requestResetPasswordValidator = withZod(
  z.object({
    email,
  })
);

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
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwörter stimmen nicht überein",
      path: ["passwordConfirmation"],
    })
);

export const resendMailValidator = withZod(
  z.object({
    _email: email,
  })
);

export const changeMailValidator = withZod(
  z.object({
    email,
  })
);

export const adminRegisterValidator = withZod(
  z
    .object({
      email: email,
      password: password,
      passwordConfirmation: password,
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
