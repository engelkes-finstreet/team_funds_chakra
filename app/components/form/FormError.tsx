import { useField } from "remix-validated-form";
import { FormErrorMessage, Text } from "@chakra-ui/react";

type Props = {
  name: string;
};

export function FormError({ name }: Props) {
  const { error } = useField(name);

  if (error) {
    return <FormErrorMessage as={Text}>{error}</FormErrorMessage>;
  }

  return null;
}
