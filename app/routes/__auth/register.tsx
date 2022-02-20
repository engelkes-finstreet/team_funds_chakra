import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/requests";
import { createUserSession, register } from "~/utils/session.server";
import { RegisterPage } from "~/components/auth/RegisterPage";

export const action: ActionFunction = async ({ request }) => {
  const data = await registerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

  const userExists = await db.user.findFirst({
    where: { username: email },
  });

  if (userExists) {
    return badRequest({
      formError: `User mit der E-Mail ${email} existiert bereits`,
    });
  }

  const user = await register(email, password);
  if (!user) {
    return badRequest({
      formError: `Ups, uns ist ein Fehler beim Erstellen deines Users unterlaufen`,
    });
  }
  return createUserSession(user.id, redirectTo);
};

export default function RegisterRoute() {
  return (
    <RegisterPage
      heading={"Registriere deinen Account"}
      loginRoute={"/login"}
    />
  );
}
