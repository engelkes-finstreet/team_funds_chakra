import { Alert, AlertIcon, Button, Stack } from "@chakra-ui/react";
import React, { ReactNode, PropsWithoutRef } from "react";

import {
  ValidatedForm,
  Validator,
  FormProps as ValidatedFormProps,
} from "remix-validated-form";
import { useActionData } from "@remix-run/react";
import { useFormContext } from "remix-validated-form";

export type FormProps<DataType> = {
  submitText: string;
} & ValidatedFormProps<DataType> &
  Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit">;

export function Form<DataType>({
  children,
  submitText,
  validator,
  method,
  ...props
}: FormProps<DataType>) {
  return (
    <ValidatedForm validator={validator} method={method} {...props}>
      <ExtendedForm submitText={submitText}>{children}</ExtendedForm>
    </ValidatedForm>
  );
}

type ExtendedFormProps = {
  children: ReactNode;
  submitText: string;
};

const ExtendedForm = ({ children, submitText }: ExtendedFormProps) => {
  const data = useActionData();
  const { isValid, isSubmitting } = useFormContext();
  const isDisabled = !isValid || isSubmitting;

  return (
    <Stack spacing={6}>
      {data?.formError && (
        <Alert status={"error"} variant={"top-accent"}>
          <AlertIcon />
          {data.formError}
        </Alert>
      )}

      <Stack spacing={2}>{children}</Stack>

      <Button
        type="submit"
        colorScheme="blue"
        size="lg"
        fontSize="md"
        isDisabled={isDisabled}
      >
        {submitText}
      </Button>
    </Stack>
  );
};
