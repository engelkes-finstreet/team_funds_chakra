import {
  Box,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useColorModeValue,
  useMultiStyleConfig,
  useStyleConfig,
} from "@chakra-ui/react";
import * as React from "react";
import { UserInfoButton } from "~/components/Layout/UserInfoButton";
import { UserWithoutPassword } from "~/utils/session.server";
import { Form, useFetcher } from "remix";

type Props = {
  email: string;
};

export const UserInfo = ({ email }: Props) => {
  return (
    <Menu>
      <UserInfoButton email={email} />
      <MenuList
        shadow="lg"
        py="4"
        color={useColorModeValue("gray.600", "gray.200")}
        px="3"
      >
        <Form action="/logout" method="post">
          <MenuItem rounded={"md"}>
            <button type={"submit"}>Logout</button>
          </MenuItem>
        </Form>
      </MenuList>
    </Menu>
  );
};
