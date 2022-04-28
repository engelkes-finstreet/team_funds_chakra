import { useFormContext, ValidatedForm } from "remix-validated-form";
import { ConfirmAction } from "~/routes/confirm";
import { useAfterTransition } from "~/hooks/useAfterTransition";
import {
  Button,
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
          <Button colorScheme={"blue"} variant={"ghost"} onClick={onClose}>
            Schließen
          </Button>
          <Button
            name={"_action"}
            value={ConfirmAction.CHANGE_MAIL}
            colorScheme={"blue"}
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
