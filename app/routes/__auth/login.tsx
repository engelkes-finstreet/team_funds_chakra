import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import {
  createAdminSession,
  createUserSession,
  login,
} from "~/utils/session.server";
import { badRequest } from "~/utils/requests";
import React from "react";
import { loginValidator } from "~/utils/validations/authValidations";
import { LoginPage } from "~/components/auth/LoginPage";

export const action: ActionFunction = async ({ request }) => {
  const data = await loginValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

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
    <LoginPage
      heading={"Logge dich in deinen Account ein"}
      subHeading={"Hast du noch keinen Account? "}
      registerRoute={"/register"}
      redirectTo={"/"}
    />
  );
}
