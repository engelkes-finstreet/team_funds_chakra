import { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { stringToNumberValidation } from "~/validations/utils";
import { ActionFunction, redirect, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { Table, Tbody, Td, Text, Tr, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { Player } from "@prisma/client";
import { getPlayerName } from "~/utils/functions";
import { PlayerPunishmentDialog } from "~/components/player-punishment/PlayerPunishmentDialog";
import { useAfterTransition } from "~/hooks/useAfterTransition";
import { setFlashContent } from "~/utils/flashMessage.server";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const userId = await requireUserId(request);
  const players = await db.player.findMany();
  const punishments = await db.punishment.findMany();

  return { players, punishments, userId };
};

export const playerPunishmentValidator = withZod(
  z.object({
    _playerId: z.string(),
    _playerName: z.string(),
    _userId: z.string(),
    punishments: z.array(
      z.object({
        punishmentId: z.string(),
        amount: stringToNumberValidation("Erforderlich"),
      })
    ),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const data = playerPunishmentValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { _userId, _playerId, _playerName, punishments } = data.data;

  for (let punishment of punishments) {
    await db.playerPunishments.create({
      data: {
        userId: _userId,
        playerId: _playerId,
        amount: punishment.amount,
        punishmentId: punishment.punishmentId,
      },
    });
  }

  const { headers } = await setFlashContent(
    request,
    `Strafen für ${_playerName} erfolgreich hinzugefügt`,
    "success"
  );

  return redirect("/admin/player-punishments", headers);
};

export default function () {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(
    undefined
  );

  useAfterTransition(onClose);

  return (
    <PageWrapper heading={"Spieler bestrafen"}>
      <PlayerPunishmentDialog
        player={selectedPlayer}
        punishments={data.punishments}
        userId={data.userId}
        onClose={onClose}
        isOpen={isOpen}
      />
      <Text fontSize={"md"} mb={4}>
        Klicke einen Spieler an um eine Strafe hinzuzufügen
      </Text>
      <Table variant={"striped"} colorScheme={"blue"}>
        <Tbody>
          {data.players.map((player) => (
            <Tr
              key={player.id}
              _hover={{ cursor: "pointer", opacity: 0.8 }}
              onClick={() => {
                setSelectedPlayer(player);
                onOpen();
              }}
            >
              <Td>{getPlayerName(player)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </PageWrapper>
  );
}
