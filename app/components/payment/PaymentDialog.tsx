import { Player, Punishment, PunishmentType } from "@prisma/client";
import {
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { getPlayerName } from "~/utils/functions";
import { ValidatedForm } from "remix-validated-form";
import { TextField } from "~/components/form/TextField";
import { useState } from "react";
import { NumberField } from "~/components/form/NumberField";
import { Select } from "../form/Select";
import { HiX } from "react-icons/hi";
import { paymentValidator } from "~/routes/admin/payments";

type Props = {
  player: Player | undefined;
  userId: string;
  onClose: any;
  isOpen: boolean;
};

export function PaymentDialog({ player, userId, onClose, isOpen }: Props) {
  const [payments, setPayments] = useState([0]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={"42rem"}>
        <ModalHeader>Bezahlung für {getPlayerName(player)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ValidatedForm
            validator={paymentValidator}
            method={"post"}
            id={"paymentForm"}
            defaultValues={{ _userId: userId, _playerId: player?.id }}
          >
            <TextField name={"_userId"} hidden={true} />
            <TextField name={"_playerId"} hidden={true} />
            <VStack spacing={4} w={"full"}>
              {payments.map((payment, index) => (
                <Flex
                  gap={2}
                  spacing={2}
                  key={payment}
                  w={"full"}
                  alignItems={"flex-end"}
                >
                  <Select
                    name={`payments[${index}].paymentType`}
                    label={"Strafe"}
                  >
                    {Object.keys(PunishmentType).map((punishmentType) => (
                      <option key={punishmentType} value={punishmentType}>
                        {punishmentType}
                      </option>
                    ))}
                  </Select>
                  <NumberField
                    name={`payments[${index}].amount`}
                    label={"Zahlhöhe"}
                  />
                  <IconButton
                    onClick={() => {
                      setPayments((prev) =>
                        prev.filter(
                          (currentPayment) => currentPayment !== payment
                        )
                      );
                    }}
                    aria-label={"Zahlung entfernen"}
                    icon={<HiX />}
                    variant={"ghost"}
                    colorScheme={"red"}
                    isDisabled={index == 0}
                  />
                </Flex>
              ))}
              <Flex w={"full"} justifyContent={"flex-end"}>
                <Button
                  variant={"ghost"}
                  colorScheme={"blue"}
                  onClick={() =>
                    setPayments((prev) => [...prev, payments.length])
                  }
                >
                  weitere Bezahlung hinzufügen
                </Button>
              </Flex>
            </VStack>
          </ValidatedForm>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Divider />
            <Flex>
              <Button variant={"ghost"} onClick={onClose}>
                Schließen
              </Button>
              <Button
                colorScheme={"blue"}
                type={"submit"}
                form={"paymentForm"}
                onClick={onClose}
              >
                Bezahlen
              </Button>
            </Flex>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
