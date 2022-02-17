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
  user: UserWithoutPassword;
};

export const UserInfo = ({ user }: Props) => {
  const styles = useMultiStyleConfig("Menu", {});
  console.log({ styles: styles.item });

  return (
    <Menu>
      <UserInfoButton user={user} />
      <MenuList
        shadow="lg"
        py="4"
        color={useColorModeValue("gray.600", "gray.200")}
        px="3"
      >
        <MenuItem rounded="md">Profil</MenuItem>
        <MenuItem rounded="md">Einstellungen</MenuItem>
        <MenuDivider />
        <Form action="/logout" method="post">
          <MenuItem rounded={"md"}>
            <button type={"submit"}>Logout</button>
          </MenuItem>
        </Form>
      </MenuList>
    </Menu>
  );
};
