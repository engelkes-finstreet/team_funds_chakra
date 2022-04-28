import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { SidebarLink } from "./SidebarLink";
import { UserInfo } from "./UserInfo";
import {
  Gi3DHammer,
  GiPayMoney,
  GiSettingsKnobs,
  GiSoccerKick,
} from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { AiOutlineContacts, AiOutlineUser } from "react-icons/ai";
import { NavGroup } from "~/components/Layout/NavGroup";
import { Navigation } from "./Navigation";
import { Container } from "~/components/Layout/Container";
import { getUserName } from "~/utils/functions";
import {
  AdminWithoutPassword,
  UserWithoutPassword,
} from "~/utils/auth/session-utils.server";

type Props = {
  user: UserWithoutPassword;
};

export function Layout({ user }: Props) {
  return (
    <Shell userName={getUserName(user)}>
      <UserNavigationLinks />
    </Shell>
  );
}

type AdminLayoutProps = {
  admin: AdminWithoutPassword;
};

export function AdminLayout({ admin }: AdminLayoutProps) {
  return (
    <Shell userName={admin.email}>
      <AdminNavigationLinks />
    </Shell>
  );
}

type ShellProps = {
  userName: string;
  children: React.ReactNode;
};

const Shell = ({ userName, children }: ShellProps) => {
  return (
    <Flex
      height="100vh"
      bg={useColorModeValue("blue.800", "gray.700")}
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
        height="100vh"
      >
        <Box fontSize="sm" lineHeight="tall" height={"100vh"}>
          <UserInfo email={userName} />
          <Navigation>{children}</Navigation>
        </Box>
      </Box>
      <Container />
    </Flex>
  );
};

const UserNavigationLinks = () => {
  return (
    <>
      <NavGroup label={""}>
        <SidebarLink icon={<GiSoccerKick />} to={"/players"}>
          Spieler
        </SidebarLink>
        <SidebarLink icon={<Gi3DHammer />} to={"/punishments"}>
          Strafen
        </SidebarLink>
      </NavGroup>
      <NavGroup label={"Profile"}>
        <SidebarLink to={"/me"} icon={<AiOutlineUser />}>
          Mein Profil
        </SidebarLink>
        <SidebarLink to={"/me/settings"} icon={<GiSettingsKnobs />}>
          Settings
        </SidebarLink>
        <SidebarLink to={"/me/pay"} icon={<GiPayMoney />}>
          Bezahlen
        </SidebarLink>
      </NavGroup>
    </>
  );
};

const AdminNavigationLinks = () => {
  return (
    <>
      <NavGroup label={"Kasse"}>
        <SidebarLink to={"/admin/player-punishments"} icon={<Gi3DHammer />}>
          Strafe hinzufügen
        </SidebarLink>
        <SidebarLink icon={<GiPayMoney />} to={"/admin/payments"}>
          Zahlungen
        </SidebarLink>
      </NavGroup>
      <NavGroup label={"Admin"}>
        <SidebarLink icon={<BiTimeFive />} to={"/admin/seasons"}>
          Saisons
        </SidebarLink>
        <SidebarLink icon={<GiSoccerKick />} to={"/admin/players"}>
          Spieler
        </SidebarLink>
        <SidebarLink icon={<Gi3DHammer />} to={"/admin/punishments"}>
          Strafen
        </SidebarLink>
        <SidebarLink icon={<AiOutlineContacts />} to={"/admin/connect-user"}>
          User verbinden
        </SidebarLink>
      </NavGroup>
    </>
  );
};
