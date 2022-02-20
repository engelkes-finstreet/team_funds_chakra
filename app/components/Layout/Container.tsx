import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { MobileMenuButton } from "~/components/Layout/MobileMenuButton";
import { Breadcrumb } from "~/components/Layout/Breadcrumb";
import { Outlet } from "remix";
import * as React from "react";
import { useMobileMenuState } from "~/components/Layout/useMobileMenuState";

export function Container() {
  const { isOpen, toggle } = useMobileMenuState();

  return (
    <Box
      flex="1"
      p={{ base: "0", md: "6" }}
      marginStart={{ md: "var(--sidebar-width)" }}
      position="relative"
      left={isOpen ? "var(--sidebar-width)" : "0"}
      transition="left 0.2s"
    >
      <Box
        maxW="2560px"
        bg={useColorModeValue("white", "gray.700")}
        height="100%"
        pb="6"
        rounded={{ md: "lg" }}
      >
        <Flex direction="column" height="full">
          <Flex w="full" py="4" justify="space-between" align="center" px="10">
            <Flex
              align="center"
              minH="8"
              justifyContent={"space-between"}
              w={"full"}
            >
              <MobileMenuButton onClick={toggle} isOpen={isOpen} />
              <Breadcrumb />
              <div />
            </Flex>
          </Flex>
          <Flex direction="column" flex="1" overflow="auto" px="10" pt="4">
            <Outlet />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
