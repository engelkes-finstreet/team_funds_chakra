import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Stack,
} from "@chakra-ui/react";
import React, { ReactNode, PropsWithoutRef } from "react";

import {
  ValidatedForm,
  FormProps as ValidatedFormProps,
} from "remix-validated-form";
import { useActionData } from "@remix-run/react";
import { useFormContext } from "remix-validated-form";

export type FormProps<DataType> = {
  submitText: string;
  additionalSubmits?: ReactNode;
} & ValidatedFormProps<DataType> &
  Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit">;

export function Form<DataType>({
  children,
  submitText,
  validator,
  formRef,
  additionalSubmits,
  method,
  ...props
}: FormProps<DataType>) {
  return (
    <ValidatedForm
      validator={validator}
      method={method}
      formRef={formRef}
      resetAfterSubmit={true}
      {...props}
    >
      <ExtendedForm
        submitText={submitText}
        additionalSubmits={additionalSubmits}
      >
        {children}
      </ExtendedForm>
    </ValidatedForm>
  );
}

type ExtendedFormProps = {
  children: ReactNode;
  submitText: string;
  additionalSubmits?: ReactNode;
};

export const ExtendedForm = ({
  children,
  additionalSubmits,
  submitText,
}: ExtendedFormProps) => {
  const data = useActionData();
  const { isSubmitting } = useFormContext();

  return (
    <Stack spacing={6}>
      {data?.formError && (
        <Alert status={"error"} variant={"top-accent"}>
          <AlertIcon />
          {data.formError}
        </Alert>
      )}

      <Stack spacing={4}>{children}</Stack>

      <Flex justifyContent={"flex-end"} alignItems={"center"} gap={8}>
        {additionalSubmits}
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          fontSize="md"
          isLoading={isSubmitting}
          loadingText={submitText}
        >
          {submitText}
        </Button>
      </Flex>
    </Stack>
  );
};
