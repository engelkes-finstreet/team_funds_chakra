import {
  Avatar,
  Box,
  HStack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { UserWithoutPassword } from "~/utils/session.server";

type Props = {
  user: UserWithoutPassword;
};

export const UserInfo = ({ user }: Props) => {
  return (
    <HStack display="inline-flex">
      <Avatar size="sm" name={user?.username} />
      <Box lineHeight="1">
        <Text fontSize="xs" mt="1" color={mode("whiteAlpha.700", "gray.400")}>
          {user?.username}
        </Text>
      </Box>
    </HStack>
  );
};
