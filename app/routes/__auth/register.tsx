import { ActionFunction, redirect } from "remix";
import { validationError } from "remix-validated-form";
import { RegisterPage } from "~/components/auth/RegisterPage";
import { registerValidator } from "~/utils/validations/authValidations";
import { RegisterForm } from "~/components/auth/RegisterForm";
import { register } from "~/utils/auth/register.server";
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
  const data = await registerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, firstName, lastName } = data.data;

  return register({ email, password, firstName, lastName });
};

export default function RegisterRoute() {
  return (
    <RegisterPage
      heading={"Registriere deinen Account"}
      loginRoute={"/login"}
      validator={registerValidator}
      renderRegisterForm={() => <RegisterForm />}
    />
  );
}
