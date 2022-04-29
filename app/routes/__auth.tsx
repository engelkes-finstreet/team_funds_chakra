import { Outlet } from "remix";
import { Logo } from "~/components/auth/Logo";
import React from "react";
import { AuthContainer } from "~/components/auth/AuthContainer";

export default function AuthLayout() {
  return (
    <AuthContainer>
      <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
      <Outlet />
    </AuthContainer>
  );
}
