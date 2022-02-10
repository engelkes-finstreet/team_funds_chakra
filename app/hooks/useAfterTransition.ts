import { useTransition } from "@remix-run/react";
import { usePrevious } from "~/hooks/usePrevious";
import { useEffect } from "react";

export function useAfterTransition(callback: () => any) {
  const transition = useTransition();
  const isAdding = transition.state === "submitting";

  useEffect(() => {
    if (!isAdding) {
      callback();
    }
  }, [isAdding]);
}
