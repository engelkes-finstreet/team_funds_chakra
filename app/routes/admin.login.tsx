import { ActionFunction } from "remix";
import { LoginPage } from "~/components/auth/LoginPage";
import React from "react";
import { loginValidator } from "~/utils/validations/authValidations";
import { validationError } from "remix-validated-form";
import { loginAdminUser } from "~/utils/auth/login.server";
import { AuthContainer } from "~/components/auth/AuthContainer";

export const action: ActionFunction = async ({ request }) => {
  const data = await loginValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

  return await loginAdminUser({ email, password, redirectTo });
};

export default function AdminLoginRoute() {
  return (
    <AuthContainer>
      <LoginPage
        heading={"Logge dich in deinen Admin-Account ein"}
        subHeading={
          "Hast du noch keinen Account? Du musst erst von einem anderen Administrator bestätigt werden bevor du dich einloggen kannst "
        }
        registerRoute={"/admin/register"}
        redirectTo={"/admin"}
      />
    </AuthContainer>
  );
}
