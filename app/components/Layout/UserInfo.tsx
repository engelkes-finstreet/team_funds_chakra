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
  return <UserInfoButton email={email} />;
};
