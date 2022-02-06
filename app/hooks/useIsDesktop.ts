import { useBreakpointValue } from "@chakra-ui/react";

export function useIsDesktop() {
  return useBreakpointValue({ base: false, lg: true });
}
