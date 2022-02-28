import { useField } from "remix-validated-form";
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from "@chakra-ui/react";
import React from "react";
import { FormError } from "~/components/form/FormError";

export type SelectProps = {
  name: string;
  children: React.ReactNode;
  label?: string;
  autoFocus: boolean;
} & FormControlProps;

export const Select = ({ name, label, children, ...rest }: SelectProps) => {
  const { validate, clearError, defaultValue, error } = useField(name);

  return (
    <FormControl id={name} isInvalid={Boolean(error)} {...rest}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <ChakraSelect
        name={name}
        onChange={clearError}
        onBlur={validate}
        defaultValue={defaultValue}
      >
        {children}
      </ChakraSelect>
      <FormError name={name} />
    </FormControl>
  );
};
