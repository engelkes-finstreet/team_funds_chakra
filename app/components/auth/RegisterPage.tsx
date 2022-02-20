import { Logo } from "~/components/auth/Logo";
import { Heading, Text } from "@chakra-ui/react";
import { Link } from "~/components/Link";
import { Card } from "~/components/auth/Card";
import { Form } from "~/components/form/Form";
import { RegisterForm } from "~/components/auth/RegisterForm";
import { adminRegisterValidator } from "~/utils/validations/authValidations";
import { Validator } from "remix-validated-form";

type Props = {
  heading: string;
  loginRoute: string;
  validator: Validator<any>;
};

export function RegisterPage({ heading, loginRoute, validator }: Props) {
  return (
    <>
      <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        {heading}
      </Heading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text as="span">Hast du bereits einen Account? </Text>
        <Link to={loginRoute}>Hier geht's zum Login</Link>
      </Text>
      <Card>
        <Form validator={validator} submitText={"Registrieren"} method={"post"}>
          <RegisterForm />
        </Form>
      </Card>
    </>
  );
}
