import { useField } from "remix-validated-form";
import { FormErrorMessage } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
};

export function FormError({ name }: Props) {
  const { error } = useField(name);

  if (error) {
    return <FormErrorMessage>{error}</FormErrorMessage>;
  }

  return null;
}
