import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Divider, Heading } from "@chakra-ui/react";
import { HeadlessForm } from "~/components/form/Form";
import {
  resetPasswordValidator,
  updateProfileValidator,
} from "~/utils/validations/authValidations";
import { ActionFunction, useLoaderData } from "remix";
import { ProfileForm } from "~/components/me/ProfileForm";
import { ValidatedForm, validationError } from "remix-validated-form";
import { ResetPasswordForm } from "~/components/me/ResetPasswordForm";
import { setFlashContent } from "~/utils/flashMessage.server";
import { useResetForm } from "~/hooks/useResetForm";
import { TFHandle } from "~/utils/types/handle.types";
import { resetPasswordFromSettings } from "~/utils/auth/reset-password.server";
import { updateUser } from "~/backend/user/updateUser";
import { requireAndReturnUser } from "~/utils/auth/session-utils.server";
import { Button } from "~/components/chakra/Button";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Settings",
};

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const user = await requireAndReturnUser({ request });

  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  if (data.get("_action") === "profile") {
    const profileData = await updateProfileValidator.validate(data);
    if (profileData.error) return validationError(profileData.error);
    const { firstName, lastName, _userId: userId } = profileData.data;
    await updateUser({ firstName, lastName, userId });

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
    const { _userId: userId, oldPassword, password } = passwordData.data;

    return resetPasswordFromSettings({
      userId,
      oldPassword,
      password,
      request,
    });
  }

  return null;
};

export default function MeRoute() {
  const { user } = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const { formRef } = useResetForm();

  return (
    <>
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
            <Button type={"submit"} name={"_action"} value={"profile"}>
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
            <Button type={"submit"} name={"_action"} value={"password"}>
              Passwort ändern
            </Button>
          )}
        />
      </ValidatedForm>
    </>
  );
}
