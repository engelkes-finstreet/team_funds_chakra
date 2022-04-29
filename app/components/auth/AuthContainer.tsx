import * as React from "react";
import { Box } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};
export function AuthContainer({ children }: Props) {
  return (
    <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }}>
      <Box maxW="md" mx="auto">
        {children}
      </Box>
    </Box>
  );
}
