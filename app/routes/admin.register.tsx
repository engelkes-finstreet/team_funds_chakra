import React from "react";
import { RegisterPage } from "~/components/auth/RegisterPage";
import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { adminRegisterValidator } from "~/utils/validations/authValidations";
import { RegisterAdminForm } from "~/components/auth/RegisterForm";
import { registerAdminUser } from "~/utils/auth/register-admin.server";
import { AuthContainer } from "~/components/auth/AuthContainer";

export const action: ActionFunction = async ({ request }) => {
  const data = await adminRegisterValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password } = data.data;

  return await registerAdminUser({ email, password, request });
};

export default function AdminRegisterRoute() {
  return (
    <AuthContainer>
      <RegisterPage
        heading={"Registriere deinen Admin-Account"}
        loginRoute={"/admin/login"}
        validator={adminRegisterValidator}
        renderRegisterForm={() => <RegisterAdminForm />}
      />
    </AuthContainer>
  );
}
