import { Alert, AlertIcon, Flex, Stack } from "@chakra-ui/react";
import React, { ReactNode, PropsWithoutRef } from "react";

import {
  ValidatedForm,
  FormProps as ValidatedFormProps,
} from "remix-validated-form";
import { useActionData } from "@remix-run/react";
import { useFormContext } from "remix-validated-form";
import { Button } from "../chakra/Button";

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

      {data?.formInfo && (
        <Alert status={"info"} variant={"top-accent"}>
          <AlertIcon />
          {data.formInfo}
        </Alert>
      )}

      <Stack spacing={4}>{children}</Stack>

      <Flex justifyContent={"flex-end"} alignItems={"center"} gap={8}>
        {additionalSubmits}
        <Button
          type="submit"
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

type HeadlessFormProps = {
  renderForm: () => React.ReactNode;
  renderButton: () => React.ReactNode;
};

export const HeadlessForm = ({
  renderForm,
  renderButton,
}: HeadlessFormProps) => {
  const form = renderForm();
  const button = renderButton();

  return (
    <Stack spacing={6}>
      <Stack spacing={4}>{form}</Stack>
      <Flex justifyContent={"flex-end"} alignItems={"center"} gap={8}>
        {button}
      </Flex>
    </Stack>
  );
};
