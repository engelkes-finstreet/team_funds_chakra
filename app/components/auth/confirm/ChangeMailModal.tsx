import { useFormContext, ValidatedForm } from "remix-validated-form";
import { ConfirmAction } from "~/routes/confirm";
import { useAfterTransition } from "~/hooks/useAfterTransition";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { changeMailValidator } from "~/utils/validations/authValidations";
import { TextField } from "~/components/form/TextField";
import React from "react";
import { Button } from "~/components/chakra/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export const ChangeMailModal = ({ isOpen, onClose }: Props) => {
  const { isSubmitting: isChangeMailSubmitting } = useFormContext(
    ConfirmAction.CHANGE_MAIL
  );

  useAfterTransition(() => {
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>E-Mail ändern</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ValidatedForm
            method={"post"}
            validator={changeMailValidator}
            id={ConfirmAction.CHANGE_MAIL}
          >
            <TextField
              name={"email"}
              autoFocus={true}
              placeholder={"Neue E-Mail"}
            />
          </ValidatedForm>
        </ModalBody>
        <ModalFooter>
          <Button variant={"ghost"} onClick={onClose}>
            Schließen
          </Button>
          <Button
            name={"_action"}
            value={ConfirmAction.CHANGE_MAIL}
            variant={"solid"}
            type={"submit"}
            form={ConfirmAction.CHANGE_MAIL}
            isLoading={isChangeMailSubmitting}
            loadingText={"Ändere Mail"}
          >
            E-Mail ändern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
