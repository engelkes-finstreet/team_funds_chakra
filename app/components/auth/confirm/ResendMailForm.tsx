import { ConfirmAction } from "~/routes/confirm";
import { resendMailValidator } from "~/utils/validations/authValidations";
import { TextField } from "~/components/form/TextField";
import { CardButton } from "~/components/auth/Card";
import { useFormContext, ValidatedForm } from "remix-validated-form";
import React from "react";

type Props = {
  email: string;
};
export function ResendMailForm({ email }: Props) {
  const { isSubmitting: isResendMailSubmitting } = useFormContext(
    ConfirmAction.RESEND_MAIL
  );

  return (
    <ValidatedForm
      id={ConfirmAction.RESEND_MAIL}
      validator={resendMailValidator}
      method={"post"}
      defaultValues={{ _email: email }}
    >
      <TextField name={"_email"} hidden={true} />
      <CardButton
        name={"_action"}
        value={ConfirmAction.RESEND_MAIL}
        variant={"primary"}
        isLoading={isResendMailSubmitting}
        loadingText={"Versende Mail"}
        type={"submit"}
      >
        E-Mail erneut senden
      </CardButton>
    </ValidatedForm>
  );
}
