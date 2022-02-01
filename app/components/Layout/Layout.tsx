import { Box, Flex, Stack, useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";
import { Outlet } from "remix";
import { MobileMenuButton } from "./MobileMenuButton";
import { ScrollArea } from "./ScrollArea";
import { SidebarLink } from "./SidebarLink";
import { useMobileMenuState } from "./useMobileMenuState";
import { UserInfo } from "./UserInfo";
import { UserWithoutPassword } from "~/utils/session.server";
import { Gi3DHammer, GiPayMoney, GiSoccerKick } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { Breadcrumb } from "~/components/Layout/Breadcrumb";
import { NavGroup } from "~/components/Layout/NavGroup";

type Props = {
  user: UserWithoutPassword;
};

export function Layout({ user }: Props) {
  const { isOpen, toggle } = useMobileMenuState();
  return (
    <Flex
      height="100vh"
      bg={mode("blue.800", "gray.800")}
      overflow="hidden"
      sx={{ "--sidebar-width": "16rem" }}
    >
      <Box
        as="nav"
        display="block"
        flex="1"
        width="var(--sidebar-width)"
        left="0"
        py="5"
        px="3"
        color="gray.200"
        position="fixed"
      >
        <Box fontSize="sm" lineHeight="tall">
          <Box
            as="a"
            href="#"
            p="3"
            display="block"
            transition="background 0.1s"
            rounded="xl"
            _hover={{ bg: "whiteAlpha.200" }}
            whiteSpace="nowrap"
          >
            <UserInfo user={user} />
          </Box>
          <ScrollArea pt="5" pb="6">
            <Stack pb="6">
              <NavGroup label={"Kasse"}>
                <SidebarLink
                  to={"/admin/player-punishments"}
                  icon={<Gi3DHammer />}
                >
                  Strafe hinzufügen
                </SidebarLink>
                <SidebarLink icon={<GiPayMoney />} to={"/admin/payments"}>
                  Zahlungen
                </SidebarLink>
              </NavGroup>
              <NavGroup label={"Admin"}>
                <SidebarLink icon={<AiOutlineUser />} to={"/admin/users"}>
                  Users
                </SidebarLink>
                <SidebarLink icon={<BiTimeFive />} to={"/admin/seasons"}>
                  Saisons
                </SidebarLink>
                <SidebarLink icon={<GiSoccerKick />} to={"/admin/players"}>
                  Spieler
                </SidebarLink>
                <SidebarLink icon={<GiSoccerKick />} to={"/admin/punishments"}>
                  Strafen
                </SidebarLink>
              </NavGroup>
            </Stack>
          </ScrollArea>
        </Box>
      </Box>
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
          bg={mode("white", "gray.700")}
          height="100%"
          pb="6"
          rounded={{ md: "lg" }}
        >
          <Flex direction="column" height="full">
            <Flex
              w="full"
              py="4"
              justify="space-between"
              align="center"
              px="10"
            >
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
    </Flex>
  );
}
