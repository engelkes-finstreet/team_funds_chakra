import { Box } from "@chakra-ui/react";
import React from "react";
import { RegisterPage } from "~/components/auth/RegisterPage";
import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/requests";
import { registerAdminUser } from "~/utils/session.server";
import { adminRegisterValidator } from "~/utils/validations/authValidations";
import { RegisterAdminForm } from "~/components/auth/RegisterForm";

export const action: ActionFunction = async ({ request }) => {
  const data = await adminRegisterValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password, redirectTo } = data.data;

  const adminExists = await db.adminUser.findFirst({
    where: { email },
  });

  if (adminExists) {
    return badRequest({
      formError: `User mit der E-Mail ${email} existiert bereits`,
    });
  }

  const admin = await registerAdminUser(email, password);
  if (!admin) {
    return badRequest({
      formError: `Ups, uns ist ein Fehler beim Erstellen deines Users unterlaufen`,
    });
  }

  return badRequest({
    formError:
      "Du musst erst freigeschaltet werden bevor du dich einloggen kannst",
  });
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
