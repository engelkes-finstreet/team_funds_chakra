import { Logo } from "~/components/auth/Logo";
import { Heading, Text } from "@chakra-ui/react";
import { Link } from "~/components/Link";
import { Card } from "~/components/auth/Card";
import { Form } from "~/components/form/Form";
import { loginValidator } from "~/utils/validations/authValidations";
import { LoginForm } from "~/components/auth/LoginForm";
import React from "react";

type Props = {
  heading: string;
  subHeading: string;
  registerRoute: string;
  redirectTo: string;
};

export function LoginPage({
  heading,
  subHeading,
  registerRoute,
  redirectTo,
}: Props) {
  return (
    <>
      <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        {heading}
      </Heading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text as="span">{subHeading}</Text>
        <Link to={registerRoute}>Registriere dich jetzt</Link>
      </Text>
      <Card>
        <Form validator={loginValidator} submitText={"Login"} method={"post"}>
          <LoginForm redirectTo={redirectTo} />
        </Form>
      </Card>
    </>
  );
}
