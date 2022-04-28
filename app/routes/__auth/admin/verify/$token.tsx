import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Heading, Text } from "@chakra-ui/react";
import { Link } from "~/components/Link";
import { verifyAdminUser, verifyUser } from "~/utils/auth/verify-user.server";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const { token } = params;
  return verifyAdminUser({ request, token });
};

export default function TokenRoute() {
  return <div>Token Route</div>;
}

export function CatchBoundary() {
  return (
    <>
      <Heading textAlign={"center"} size={"xl"} fontWeight={"extrabold"}>
        Deine Verifizierung ist fehlgeschlagen
      </Heading>
      <Text mt={8} mb={2} align={"center"} maxW={"md"} fontWeight={"medium"}>
        <Text as={"span"}>Besitzt du schon einen Account? </Text>
        <Link to={"/login"}>Logge dich jetzt ein</Link>
      </Text>
      <Text mt={4} align={"center"} maxW={"md"} fontWeight={"medium"}>
        <Text as={"span"}>Hast du noch keinen Account? </Text>
        <Link to={"/register"}>Dann registriere dich jetzt</Link>
      </Text>
    </>
  );
}
