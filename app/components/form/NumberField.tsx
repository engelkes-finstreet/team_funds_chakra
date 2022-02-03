import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputProps,
  NumberInput,
  NumberInputField,
  useMergeRefs,
} from "@chakra-ui/react";
import * as React from "react";
import { useField } from "remix-validated-form";
import { FormError } from "~/components/form/FormError";

type Props = {
  label?: string;
  placeholder?: string;
  name: string;
  icon?: React.ReactNode;
};

export const NumberField = React.forwardRef<
  HTMLInputElement,
  InputProps & Props
>(({ id, label, placeholder, name, type, icon, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const { validate, clearError, defaultValue, error } = useField(name);

  return (
    <FormControl id={name} isInvalid={Boolean(error)}>
      <Flex alignItems={"baseline"}>
        <FormLabel>{label}</FormLabel>
        <FormError name={name} />
      </Flex>
      <NumberInput defaultValue={defaultValue} as={InputGroup}>
        {icon ? <InputLeftAddon pointerEvents="none" children={icon} /> : null}
        <Input
          as={NumberInputField}
          ref={mergeRef}
          name={name}
          placeholder={placeholder ? placeholder : label}
          onBlur={validate}
          onChange={clearError}
          type={"number"}
        />
      </NumberInput>
    </FormControl>
  );
});
