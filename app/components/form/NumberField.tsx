import {
  FormControl,
  FormLabel,
  InputProps,
  NumberInput,
  NumberInputField,
  useMergeRefs,
} from "@chakra-ui/react";
import * as React from "react";
import { useField } from "remix-validated-form";
import { FormError } from "~/components/form/FormError";

type Props = { label?: string; placeholder?: string; name: string };

export const NumberField = React.forwardRef<
  HTMLInputElement,
  InputProps & Props
>(({ id, label, placeholder, name, type, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const { validate, clearError, defaultValue, error } = useField(name);

  return (
    <FormControl id={name} isInvalid={Boolean(error)}>
      <FormLabel>{label}</FormLabel>
      <NumberInput defaultValue={defaultValue}>
        <NumberInputField
          ref={mergeRef}
          name={name}
          placeholder={placeholder ? placeholder : label}
          onBlur={validate}
          onChange={clearError}
          type={"number"}
        />
      </NumberInput>
      <FormError name={name} />
    </FormControl>
  );
});
