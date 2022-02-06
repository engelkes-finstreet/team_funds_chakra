import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import * as React from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useField } from "remix-validated-form";
import { FormError } from "~/components/form/FormError";

type Props = {
  label: string;
  name: string;
} & InputProps;

export const PasswordField = React.forwardRef<HTMLInputElement, Props>(
  ({ name, label, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { validate, clearError, defaultValue, error } = useField(name);

    const mergeRef = useMergeRefs(inputRef, ref);

    const onClickReveal = () => {
      onToggle();
      const input = inputRef.current;
      if (input) {
        input.focus({ preventScroll: true });
        const length = input.value.length * 2;
        requestAnimationFrame(() => {
          input.setSelectionRange(length, length);
        });
      }
    };

    return (
      <FormControl id={name} isInvalid={Boolean(error)}>
        <FormLabel>{label}</FormLabel>
        <InputGroup>
          <InputRightElement>
            <IconButton
              bg="transparent !important"
              variant="ghost"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
          <Input
            ref={mergeRef}
            name={name}
            type={isOpen ? "text" : "password"}
            autoComplete="current-password"
            onBlur={validate}
            onChange={clearError}
            defaultValue={defaultValue}
            placeholder={label}
            {...props}
          />
        </InputGroup>
        <FormError name={name} />
      </FormControl>
    );
  }
);

PasswordField.displayName = "PasswordField";
