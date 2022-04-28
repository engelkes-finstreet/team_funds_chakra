import { Box } from "@chakra-ui/react";
import { ActionFunction } from "remix";
import { LoginPage } from "~/components/auth/LoginPage";
import React from "react";
import { loginValidator } from "~/utils/validations/authValidations";
import { validationError } from "remix-validated-form";
import { loginAdminUser } from "~/utils/auth/login.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await loginValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

  return await loginAdminUser({ email, password, redirectTo });
};

export default function AdminLoginRoute() {
  return (
    <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }}>
      <Box maxW="md" mx="auto">
        <LoginPage
          heading={"Logge dich in deinen Admin-Account ein"}
          subHeading={
            "Hast du noch keinen Account? Du musst erst von einem anderen Administrator bestätigt werden bevor du dich einloggen kannst "
          }
          registerRoute={"/admin/register"}
          redirectTo={"/admin"}
        />
      </Box>
    </Box>
  );
}
