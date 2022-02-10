import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  useMergeRefs,
} from "@chakra-ui/react";
import * as React from "react";
import { useField } from "remix-validated-form";
import { FormError } from "~/components/form/FormError";

type Props = {
  label?: string;
  placeholder?: string;
  name: string;
  inputLeftElement?: React.ReactNode;
} & InputProps;

export const TextField = React.forwardRef<HTMLInputElement, Props>(
  ({ id, label, placeholder, name, type, inputLeftElement, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergeRef = useMergeRefs(inputRef, ref);
    const { validate, clearError, defaultValue, error } =
      useField(name);

    return (
      <FormControl id={name} isInvalid={Boolean(error)}>
        <Flex justifyContent={"space-between"} alignItems={"baseline"}>
          <FormLabel>{label}</FormLabel>
          <FormError name={name} />
        </Flex>
        <InputGroup>
          {inputLeftElement && (
            <InputLeftElement
              pointerEvents={"none"}
              children={inputLeftElement}
            />
          )}
          <Input
            ref={mergeRef}
            placeholder={placeholder ? placeholder : label}
            name={name}
            type={type}
            onBlur={validate}
            onChange={clearError}
            defaultValue={defaultValue}
            {...props}
          />
        </InputGroup>
      </FormControl>
    );
  }
);
