import { Box } from "@chakra-ui/react";
import { Outlet } from "remix";
import { Logo } from "~/components/auth/Logo";
import React from "react";

export default function AuthLayout() {
  return (
    <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }}>
      <Box maxW="md" mx="auto">
        <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
        <Outlet />
      </Box>
    </Box>
  );
}
