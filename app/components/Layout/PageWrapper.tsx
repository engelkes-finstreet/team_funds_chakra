import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { useNavigate } from "remix";

type Props = {
  heading: string;
  children: React.ReactNode;
  buttonText?: string;
  linkTo?: string;
};

export function PageWrapper({ heading, children, buttonText, linkTo }: Props) {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        h={16}
        mb="1"
      >
        <Heading size="md" fontWeight="extrabold">
          {heading}
        </Heading>
        {linkTo && buttonText && (
          <Button colorScheme={"blue"} onClick={() => navigate(linkTo)}>
            {isDesktop ? buttonText : "+"}
          </Button>
        )}
      </Flex>
      <Divider mb={6} />
      <Box>{children}</Box>
    </>
  );
}
