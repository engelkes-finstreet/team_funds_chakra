import { Box } from "@chakra-ui/react";
import React from "react";
import { RegisterPage } from "~/components/auth/RegisterPage";
import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { adminRegisterValidator } from "~/utils/validations/authValidations";
import { RegisterAdminForm } from "~/components/auth/RegisterForm";
import { registerAdminUser } from "~/utils/auth/register-admin.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await adminRegisterValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password } = data.data;

  return await registerAdminUser({ email, password });
};

export default function AdminRegisterRoute() {
  return (
    <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }}>
      <Box maxW="md" mx="auto">
        <RegisterPage
          heading={"Registriere deinen Admin-Account"}
          loginRoute={"/admin/login"}
          validator={adminRegisterValidator}
          renderRegisterForm={() => <RegisterAdminForm />}
        />
      </Box>
    </Box>
  );
}
