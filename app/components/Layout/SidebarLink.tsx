import {
  Box,
  BoxProps,
  createIcon,
  HStack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { Link, useResolvedPath } from "remix";
import { To } from "history";
import { useMatch } from "react-router";

interface SidebarLinkProps extends BoxProps {
  icon?: React.ReactElement;
  to: To;
}

export const SidebarLink = (props: SidebarLinkProps) => {
  const { children, icon = <ArrowRight />, to, ...rest } = props;
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link to={to} prefetch={"intent"}>
      <Box
        marginEnd="2"
        fontSize="md"
        display="block"
        px="3"
        py="1"
        rounded="md"
        cursor="pointer"
        _hover={{ color: "white", bg: mode("blue.700", "gray.600") }}
        className="group"
        fontWeight={"medium"}
        transition="background .1s ease-out"
        {...rest}
      >
        <HStack color={match ? "blue.300" : "inherit"}>
          <Box opacity={match ? 0.9 : 0.5} _groupHover={{ opacity: 1 }}>
            {icon}
          </Box>
          <Text opacity={match ? 0.9 : 1} _hover={{ opacity: 1 }}>
            {children}
          </Text>
        </HStack>
      </Box>
    </Link>
  );
};

const ArrowRight = createIcon({
  viewBox: "0 0 16 16",
  path: (
    <path
      d="M3.38974 12.6633L9.42974 12.6633C9.86308 12.6633 10.2697 12.4567 10.5164 12.1033L13.1497 8.39C13.3164 8.15667 13.3164 7.85 13.1497 7.61667L10.5097 3.89667C10.2697 3.54334 9.86308 3.33667 9.42974 3.33667L3.38974 3.33667C2.84974 3.33667 2.53641 3.95667 2.84974 4.39667L5.42974 8.00334L2.84974 11.61C2.53641 12.05 2.84974 12.6633 3.38974 12.6633V12.6633Z"
      fill="currentcolor"
    />
  ),
});
