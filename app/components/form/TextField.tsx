import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  useMergeRefs,
} from "@chakra-ui/react";
import * as React from "react";
import { useField } from "remix-validated-form";
import { FormError } from "~/components/form/FormError";

type Props = {
  label?: string;
  name: string;
} & InputProps;

export const TextField = React.forwardRef<
  HTMLInputElement,
  InputProps & { label?: string; name: string }
>(({ id, label, name, type, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const { validate, clearError, defaultValue, error } = useField(name);

  return (
    <FormControl id={name} isInvalid={Boolean(error)}>
      <FormLabel>{label}</FormLabel>
      <Input
        ref={mergeRef}
        name={name}
        type={type}
        onBlur={validate}
        onChange={clearError}
        defaultValue={defaultValue}
        {...props}
      />
      <FormError name={name} />
    </FormControl>
  );
});
