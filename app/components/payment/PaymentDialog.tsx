import { Player, Season } from "@prisma/client";
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
import { useIsSubmitting, ValidatedForm } from "remix-validated-form";
import { TextField } from "~/components/form/TextField";
import { useState } from "react";
import { NumberField } from "~/components/form/NumberField";
import { HiX } from "react-icons/hi";
import { paymentValidator } from "~/routes/admin/payments";
import { PunishmentTypeSelect } from "~/components/punishment/PunishmentTypeSelect";
import { MdEuroSymbol } from "react-icons/md";
import { IoMdBeer } from "react-icons/io";

type Props = {
  player: Player | undefined;
  currentSeasonId: string;
  userId: string;
  onClose: any;
  isOpen: boolean;
};

export function PaymentDialog({
  player,
  userId,
  onClose,
  isOpen,
  currentSeasonId,
}: Props) {
  const [payments, setPayments] = useState([0]);
  const [punishmentType, setPunishmentType] = useState("MONEY");
  const isSubmitting = useIsSubmitting();

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
            defaultValues={{
              _userId: userId,
              _playerId: player?.id,
              _playerName: getPlayerName(player),
              _seasonId: currentSeasonId,
            }}
          >
            <TextField name={"_userId"} hidden={true} />
            <TextField name={"_playerId"} hidden={true} />
            <TextField name={"_playerName"} hidden={true} />
            <TextField name={"_seasonId"} hidden={true} />
            <VStack spacing={4} w={"full"}>
              {payments.map((payment, index) => (
                <Flex
                  gap={2}
                  spacing={2}
                  key={payment}
                  w={"full"}
                  alignItems={"flex-end"}
                >
                  <PunishmentTypeSelect
                    name={`payments[${index}].paymentType`}
                    label={"Strafe"}
                    autoFocus={true}
                    setPunishmentType={setPunishmentType}
                  />
                  <NumberField
                    name={`payments[${index}].amount`}
                    label={"Zahlhöhe"}
                    icon={
                      punishmentType === "MONEY" ? (
                        <MdEuroSymbol />
                      ) : (
                        <IoMdBeer />
                      )
                    }
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
              <Button colorScheme={"blue"} type={"submit"} form={"paymentForm"}>
                {isSubmitting ? "In Bearbeitung..." : "Bezahlen"}
              </Button>
            </Flex>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
