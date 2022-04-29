import { DataFunctionArgs } from "@remix-run/server-runtime";
import { ActionFunction, Form, redirect, useLoaderData } from "remix";
import {
  requireAndReturnUser,
  UserWithoutPassword,
} from "~/utils/auth/session-utils.server";
import {
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Logo } from "~/components/auth/Logo";
import {
  changeMailValidator,
  resendMailValidator,
} from "~/utils/validations/authValidations";
import {
  changeConfirmationMail,
  resendConfirmationMail,
} from "~/utils/auth/register.server";
import { useActionData } from "@remix-run/react";
import { ChangeMailModal } from "~/components/auth/confirm/ChangeMailModal";
import {
  Card,
  CardButton,
  CardButtons,
  CardContent,
} from "~/components/auth/Card";
import { ResendMailForm } from "~/components/auth/confirm/ResendMailForm";
import React from "react";
import { Button } from "~/components/chakra/Button";
import { AuthContainer } from "~/components/auth/AuthContainer";

export enum ConfirmAction {
  RESEND_MAIL = "RESEND_MAIL",
  CHANGE_MAIL = "CHANGE_MAIL",
}

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const user = await requireAndReturnUser({ request });
  console.log({ user });

  if (user.isConfirmed) {
    return redirect("/");
  }

  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const action = data.get("_action");
  if (action === ConfirmAction.RESEND_MAIL) {
    const resendMailData = await resendMailValidator.validate(data);
    if (resendMailData.error) {
      return null;
    }
    const { _email: email } = resendMailData.data;

    return await resendConfirmationMail({ email, request });
  } else if (action === ConfirmAction.CHANGE_MAIL) {
    const changeMailData = await changeMailValidator.validate(data);
    if (changeMailData.error) {
      return null;
    }
    const { email } = changeMailData.data;

    return await changeConfirmationMail({ request, newMail: email });
  }
};

export default function ConfirmRoute() {
  const { user } = useLoaderData<{ user: UserWithoutPassword }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = useActionData();

  return (
    <AuthContainer>
      <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
      <ChangeMailModal isOpen={isOpen} onClose={onClose} />
      <Card>
        <CardContent>
          {data?.formError && (
            <Alert status={"error"} variant={"top-accent"} mb={4}>
              <AlertIcon />
              {data.formError}
            </Alert>
          )}
          <Heading mb={4} size={"md"}>
            Bitte bestätige deine E-Mail Adresse
          </Heading>
          <Text>
            Wir haben eine E-Mail an <strong>{user.email}</strong> gesendet.{" "}
            <br /> Klicke auf den Link in der Mail um deinen Account zu
            bestätigen. Falls du keine E-Mail erhalten hast kannst du sie hier
            erneut senden lassen oder korrigieren falls du dich vertippt hast.
          </Text>
        </CardContent>
        <Divider />
        <CardButtons>
          <ResendMailForm email={user.email} />
          <CardButton name={"_action"} variant={"outline"} onClick={onOpen}>
            E-Mail ändern
          </CardButton>
        </CardButtons>
      </Card>
      <Flex justifyContent={"center"} mt={2}>
        <Form method={"post"} action={"/logout"}>
          <Button variant={"ghost"} type={"submit"}>
            Logout
          </Button>
        </Form>
      </Flex>
    </AuthContainer>
  );
}
