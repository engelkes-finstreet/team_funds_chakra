import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  Img,
  Text,
  useColorModeValue,
  useMenuButton,
} from "@chakra-ui/react";
import * as React from "react";
import { HiSelector } from "react-icons/hi";
import { UserWithoutPassword } from "~/utils/session.server";

type Props = {
  user: UserWithoutPassword;
};

export const UserInfoButton = ({ user }: Props) => {
  const buttonProps = useMenuButton();
  return (
    <HStack
      as={"button"}
      {...buttonProps}
      w="full"
      gap={2}
      rounded="lg"
      bg="gray.700"
      px="3"
      py="2"
      fontSize="sm"
      userSelect="none"
      cursor="pointer"
      outline="0"
      transition="all 0.2s"
      _active={{ bg: "gray.600" }}
      _focus={{ shadow: "outline" }}
    >
      <Avatar size="sm" name={user?.username} />
      <Box lineHeight="1">
        <Text
          fontSize="md"
          color={useColorModeValue("whiteAlpha.700", "gray.400")}
        >
          {user?.username}
        </Text>
      </Box>
    </HStack>
  );
};
