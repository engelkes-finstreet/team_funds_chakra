import { useTransition } from "@remix-run/react";
import { useEffect } from "react";

/**
 * Use this if you want to call something after your form completed
 * e.g if you want to close a modal after the form is done
 * @param callback
 */
export function useAfterTransition(callback: () => any) {
  const transition = useTransition();
  const isInTransition = transition.state === "submitting";

  useEffect(() => {
    if (!isInTransition) {
      callback();
    }
  }, [isInTransition]);
}
