import {
  Avatar,
  Box,
  HStack,
  Text,
  useColorModeValue,
  useMenuButton,
} from "@chakra-ui/react";
import * as React from "react";

type Props = {
  email: string;
};

export const UserInfoButton = ({ email }: Props) => {
  return (
    <HStack
      as={"button"}
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
    >
      <Avatar size="sm" name={email} />
      <Box lineHeight="1">
        <Text
          fontSize="md"
          color={useColorModeValue("whiteAlpha.700", "gray.400")}
        >
          {email}
        </Text>
      </Box>
    </HStack>
  );
};
