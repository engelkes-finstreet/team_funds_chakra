import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Button, Divider, Heading } from "@chakra-ui/react";
import { HeadlessForm } from "~/components/form/Form";
import {
  resetPasswordValidator,
  updateProfileValidator,
} from "~/utils/validations/authValidations";
import {
  requireAndReturnUser,
  resetPassword,
  updateUser,
} from "~/utils/session.server";
import { ActionFunction, useLoaderData } from "remix";
import { ProfileForm } from "~/components/me/ProfileForm";
import { ValidatedForm, validationError } from "remix-validated-form";
import { ResetPasswordForm } from "~/components/me/ResetPasswordForm";
import { setFlashContent } from "~/utils/flashMessage.server";
import { useResetForm } from "~/hooks/useResetForm";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const user = await requireAndReturnUser(request);

  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  if (data.get("_action") === "profile") {
    const profileData = await updateProfileValidator.validate(data);
    if (profileData.error) return validationError(profileData.error);
    const { firstName, lastName, _userId } = profileData.data;
    await updateUser(_userId, firstName, lastName);

    return setFlashContent(
      "/me",
      request,
      "Profil erfolgreich bearbeitet",
      "success"
    );
  }

  if (data.get("_action") === "password") {
    const passwordData = await resetPasswordValidator.validate(data);
    if (passwordData.error) return validationError(passwordData.error);
    const { _userId, oldPassword, password } = passwordData.data;
    await resetPassword(_userId, oldPassword, password);

    return setFlashContent(
      "/me",
      request,
      "Passwort erfolgreich zurückgesetzt",
      "success"
    );
  }

  return null;
};

export default function MeRoute() {
  const { user } = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const { formRef } = useResetForm();

  return (
    <PageWrapper heading={"Profile"}>
      <ValidatedForm
        validator={updateProfileValidator}
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          _userId: user.id,
        }}
        method={"post"}
      >
        <HeadlessForm
          renderForm={() => <ProfileForm />}
          renderButton={() => (
            <Button
              colorScheme={"blue"}
              type={"submit"}
              name={"_action"}
              value={"profile"}
            >
              Profile bearbeiten
            </Button>
          )}
        />
      </ValidatedForm>
      <Heading size={"sm"} my={4}>
        Passwort ändern
      </Heading>
      <Divider mb={8} />
      <ValidatedForm
        validator={resetPasswordValidator}
        method={"post"}
        defaultValues={{ _userId: user.id }}
        formRef={formRef}
      >
        <HeadlessForm
          renderForm={() => <ResetPasswordForm />}
          renderButton={() => (
            <Button
              colorScheme={"blue"}
              type={"submit"}
              name={"_action"}
              value={"password"}
            >
              Passwort ändern
            </Button>
          )}
        />
      </ValidatedForm>
    </PageWrapper>
  );
}
