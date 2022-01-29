import { Box } from "@chakra-ui/react";
import { Outlet } from "remix";

export default function AuthLayout() {
  return (
    <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }}>
      <Box maxW="md" mx="auto">
        <Outlet />
      </Box>
    </Box>
  );
}
