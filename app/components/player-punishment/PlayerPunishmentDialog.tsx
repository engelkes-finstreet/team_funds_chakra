import { Player, Punishment } from "@prisma/client";
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Flex,
  VStack,
  ModalHeader,
  ModalCloseButton,
  IconButton,
  Button,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { getPlayerName } from "~/utils/functions";
import { ValidatedForm } from "remix-validated-form/";
import { playerPunishmentValidator } from "~/routes/admin/player-punishments";
import { TextField } from "~/components/form/TextField";
import { Select } from "~/components/form/Select";
import { NumberField } from "~/components/form/NumberField";
import { HiX } from "react-icons/hi";

type Props = {
  player: Player | undefined;
  punishments: Array<Punishment>;
  userId: string;
  onClose: any;
  isOpen: boolean;
};

export function PlayerPunishmentDialog({
  player,
  punishments,
  userId,
  onClose,
  isOpen,
}: Props) {
  const [playerPunishments, setPlayerPunishments] = useState([0]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={"42rem"}>
        <ModalHeader>Strafe für {getPlayerName(player)} hinzufügen</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ValidatedForm
            validator={playerPunishmentValidator}
            method={"post"}
            id={"playerPunishmentForm"}
            defaultValues={{ _userId: userId, _playerId: player?.id }}
          >
            <TextField name={"_userId"} />
            <TextField name={"_playerId"} />
            <VStack spacing={4} w={"full"}>
              {playerPunishments.map((playerPunishment, index) => (
                <Flex
                  gap={2}
                  spacing={2}
                  key={playerPunishment}
                  w={"full"}
                  alignItems={"flex-end"}
                >
                  <Select
                    name={`punishments[${index}].punishmentId`}
                    label={"Strafe"}
                  >
                    {punishments.map((punishment) => (
                      <option key={punishment.id} value={punishment.id}>
                        {punishment.name}
                      </option>
                    ))}
                  </Select>
                  <NumberField
                    name={`punishments[${index}].amount`}
                    label={"Anzahl Strafe"}
                  />
                  <IconButton
                    onClick={() => {
                      setPlayerPunishments((prev) =>
                        prev.filter(
                          (currentPlayerPunishment) =>
                            currentPlayerPunishment !== playerPunishment
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
                    setPlayerPunishments((prev) => [
                      ...prev,
                      playerPunishments.length,
                    ])
                  }
                >
                  weitere Strafe hinzufügen
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
                form={"playerPunishmentForm"}
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
