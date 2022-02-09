import { Heading, Text } from "@chakra-ui/react";
import { Logo } from "~/components/auth/Logo";
import { Card } from "~/components/auth/Card";
import { Link } from "~/components/Link";
import { RegisterForm } from "~/components/auth/RegisterForm";
import { ActionFunction } from "remix";
import { Form } from "~/components/form/Form";
import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/requests";
import { createUserSession, register } from "~/utils/session.server";

const password = z
  .string()
  .min(6, "Das Passwort muss mindestens 6 Zeichen lang sein")
  .max(100);

export const registerValidator = withZod(
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

export const action: ActionFunction = async ({ request }) => {
  const data = await registerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

  const userExists = await db.user.findFirst({
    where: { username: email },
  });

  if (userExists) {
    return badRequest({
      formError: `User mit der E-Mail ${email} existiert bereits`,
    });
  }

  const user = await register(email, password);
  if (!user) {
    return badRequest({
      formError: `Ups, uns ist ein Fehler beim Erstellen deines Users unterlaufen`,
    });
  }
  return createUserSession(user.id, redirectTo);
};

export default function RegisterRoute() {
  return (
    <>
      <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Registriere deinen Account
      </Heading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text as="span">Hast du bereits einen Account? </Text>
        <Link to={"/login"}>Hier geht's zum Login</Link>
      </Text>
      <Card>
        <Form
          validator={registerValidator}
          submitText={"Registrieren"}
          method={"post"}
        >
          <RegisterForm />
        </Form>
      </Card>
    </>
  );
}
