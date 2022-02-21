import { Flex, Stack } from "@chakra-ui/react";
import { NavGroup } from "~/components/Layout/NavGroup";
import { SidebarLink } from "~/components/Layout/SidebarLink";
import { Gi3DHammer, GiPayMoney, GiSoccerKick } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { AiOutlineContacts, AiOutlineUser } from "react-icons/ai";
import { ScrollArea } from "~/components/Layout/ScrollArea";
import * as React from "react";

type Props = {
  children: React.ReactNode;
};

export function Navigation({ children }: Props) {
  return (
    <ScrollArea pt="5" pb="6">
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        h={"full"}
      >
        <Stack pb="6">{children}</Stack>
      </Flex>
    </ScrollArea>
  );
}