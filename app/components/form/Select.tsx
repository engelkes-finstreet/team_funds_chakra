import { useField } from "remix-validated-form";
import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
} from "@chakra-ui/react";
import React from "react";
import { FormError } from "~/components/form/FormError";

type Props = {
  name: string;
  children: React.ReactNode;
  label: string;
};

export const Select = ({ name, label, children }: Props) => {
  const { validate, clearError, defaultValue, error } = useField(name);

  return (
    <FormControl id={name} isInvalid={Boolean(error)}>
      <FormLabel>{label}</FormLabel>
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
