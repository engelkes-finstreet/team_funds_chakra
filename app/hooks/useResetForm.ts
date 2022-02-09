import { useEffect, useRef } from "react";
import { useTransition } from "@remix-run/react";

export function useResetForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const transition = useTransition();
  const isAdding = transition.state === "submitting";

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [isAdding]);

  return {
    formRef,
    inputRef,
  };
}
