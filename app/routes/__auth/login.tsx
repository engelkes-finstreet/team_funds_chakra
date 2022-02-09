import { Button, Heading, Text } from "@chakra-ui/react";
import { Card } from "~/components/auth/Card";
import { LoginForm } from "~/components/auth/LoginForm";
import { Logo } from "~/components/auth/Logo";
import { Link } from "~/components/Link";
import { ActionFunction, useSearchParams } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { Form } from "~/components/form/Form";
import { createUserSession, login } from "~/utils/session.server";
import { badRequest } from "~/utils/requests";
import React from "react";
import { useActionData } from "@remix-run/react";

const loginValidator = withZod(
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

export const action: ActionFunction = async ({ request }) => {
  const data = await loginValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

  // login to get the user
  // if there's no user, return the fields and a formError
  // if there is a user, create their session and redirect to /jokes
  const user = await login(email, password);
  if (!user) {
    return badRequest({
      formError: `Username/Password combination is incorrect`,
    });
  }

  return createUserSession(user.id, redirectTo);
};

export default function LoginRoute() {
  return (
    <>
      <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Logge dich in deinen Account ein
      </Heading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text as="span">Hast du noch keinen Account? </Text>
        <Link to={"/register"}>Registriere dich jetzt</Link>
      </Text>
      <Card>
        <Form validator={loginValidator} submitText={"Login"} method={"post"}>
          <LoginForm />
        </Form>
      </Card>
    </>
  );
}
