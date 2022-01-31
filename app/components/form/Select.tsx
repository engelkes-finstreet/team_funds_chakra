import { useField } from "remix-validated-form";
import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from "@chakra-ui/react";
import React from "react";
import { FormError } from "~/components/form/FormError";

export type SelectProps = {
  name: string;
  children: React.ReactNode;
  label: string;
} & ChakraSelectProps;

export const Select = ({ name, label, children, ...rest }: SelectProps) => {
  const { validate, clearError, defaultValue, error } = useField(name);

  return (
    <FormControl id={name} isInvalid={Boolean(error)}>
      <FormLabel>{label}</FormLabel>
      <ChakraSelect
        name={name}
        onChange={clearError}
        onBlur={validate}
        defaultValue={defaultValue}
        {...rest}
      >
        {children}
      </ChakraSelect>
      <FormError name={name} />
    </FormControl>
  );
};
