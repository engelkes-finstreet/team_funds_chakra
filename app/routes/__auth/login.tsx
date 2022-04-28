import { ActionFunction, redirect } from "remix";
import { validationError } from "remix-validated-form";
import React from "react";
import { loginValidator } from "~/utils/validations/authValidations";
import { LoginPage } from "~/components/auth/LoginPage";
import { login } from "~/utils/auth/login.server";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { isUserLoggedIn } from "~/utils/auth/session-utils.server";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const isLoggedIn = await isUserLoggedIn({ request });
  if (isLoggedIn) {
    return redirect("/");
  }

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const data = await loginValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

  return await login({ email, password, redirectTo });
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
