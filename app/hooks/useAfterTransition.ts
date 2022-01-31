import { useTransition } from "@remix-run/react";
import { usePrevious } from "~/hooks/usePrevious";
import { useEffect } from "react";

export function useAfterTransition(callback: () => any) {
  const transition = useTransition();
  const prevTransition = usePrevious(transition.state);

  useEffect(() => {
    if (transition.state === "idle" && prevTransition === "loading") {
      callback();
    }
  }, [transition, prevTransition]);
}
