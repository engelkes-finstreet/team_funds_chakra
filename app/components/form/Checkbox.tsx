import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

type Props = {
  label: string;
  name: string;
  value: string;
} & ChakraCheckboxProps;

export const Checkbox = ({ label, name, value, ...rest }: Props) => {
  const { getInputProps } = useField(name);
  return (
    <ChakraCheckbox {...getInputProps()} value={value}>
      {label}
    </ChakraCheckbox>
  );
};
