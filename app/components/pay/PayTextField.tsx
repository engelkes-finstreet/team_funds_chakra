import * as React from "react";
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useMergeRefs,
} from "@chakra-ui/react";
import { MdEuroSymbol } from "react-icons/md";
import * as z from "zod";
import { useState } from "react";

type Props = {
  validator: z.ZodObject<any>;
  setPayPalValue: (value: string) => void;
  setValid: (valid: boolean) => void;
};

export const PayTextField = ({
  validator,
  setPayPalValue,
  setValid,
}: Props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    const result = validator.safeParse({ maxAmount: value });
    if (!result.success) {
      setError(result.error.format().maxAmount?._errors[0]);
      setValid(false);
    } else {
      setPayPalValue(value);
      setError(undefined);
      setValid(true);
    }
  }

  return (
    <FormControl id={"pay"} isInvalid={Boolean(error)}>
      <Flex justifyContent={"space-between"} alignItems={"baseline"}>
        <FormLabel>Bezahlsumme</FormLabel>
        <FormErrorMessage as={Text}>{error}</FormErrorMessage>
      </Flex>
      <InputGroup>
        <InputLeftElement pointerEvents={"none"}>
          <MdEuroSymbol />
        </InputLeftElement>
        <Input
          placeholder={"Bezahlsumme"}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onBlur={handleChange}
          name={"pay"}
          type={"text"}
        />
      </InputGroup>
    </FormControl>
  );
};
