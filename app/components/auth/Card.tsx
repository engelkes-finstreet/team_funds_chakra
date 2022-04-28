import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Divider,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";

type Props = {
  children: React.ReactNode;
} & BoxProps;

export const Card = ({ children, ...rest }: Props) => {
  return (
    <>
      <Box
        bg={useColorModeValue("white", "gray.700")}
        shadow="base"
        rounded={{ sm: "lg" }}
        {...rest}
      >
        {children}
      </Box>
    </>
  );
};

type CardContentProps = {
  children: React.ReactNode;
};
export const CardContent = ({ children }: CardContentProps) => {
  return (
    <Box py="8" px={{ base: "4", md: "10" }}>
      {children}
    </Box>
  );
};

type CardButtonsProps = {
  children: React.ReactNode;
};
export const CardButtons = ({ children }: CardButtonsProps) => {
  return (
    <Flex
      gap={4}
      px={{ base: "4", md: "10" }}
      py={4}
      justifyContent={"space-between"}
    >
      {children}
    </Flex>
  );
};

type CardButtonProps = Pick<
  ButtonProps,
  | "variant"
  | "children"
  | "onClick"
  | "name"
  | "value"
  | "isLoading"
  | "loadingText"
  | "type"
>;
export const CardButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <Button colorScheme={"blue"} px={4} {...rest}>
      {children}
    </Button>
  );
};
