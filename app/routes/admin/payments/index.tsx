import { PageWrapper } from "~/components/Layout/PageWrapper";
import {
  Divider,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { db } from "~/utils/db.server";
import { ActionFunction, redirect, useLoaderData } from "remix";
import { getPlayerName } from "~/utils/functions";
import { useEffect, useState } from "react";
import { Player, PunishmentType } from "@prisma/client";
import { PaymentDialog } from "~/components/payment/PaymentDialog";
import { validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { stringToNumberValidation } from "~/validations/utils";
import { requireUserId } from "~/utils/session.server";
import { useAfterTransition } from "~/hooks/useAfterTransition";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const season = await getCurrentSeason();
  const userId = await requireUserId(request);
  const players = await db.player.findMany();

  return { players, userId, season };
};

export const paymentValidator = withZod(
  z.object({
    _playerId: z.string(),
    _playerName: z.string(),
    _userId: z.string(),
    _seasonId: z.string(),
    payments: z.array(
      z.object({
        paymentType: z.nativeEnum(PunishmentType),
        amount: stringToNumberValidation("Erforderlich"),
      })
    ),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const data = paymentValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { _userId, _playerId, _playerName, _seasonId, payments } = data.data;

  for (let payment of payments) {
    await db.playerPayments.create({
      data: {
        userId: _userId,
        playerId: _playerId,
        seasonId: _seasonId,
        amount: payment.amount,
        type: payment.paymentType,
      },
    });
  }

  return await setFlashContent(
    "/admin/payments",
    request,
    `Bezahlung für ${_playerName} erfolgreich hinzugefügt`,
    "success"
  );
};

export default function PaymentsIndexRoute() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(
    undefined
  );

  useAfterTransition(onClose);

  return (
    <PageWrapper heading={"Bezahlen"}>
      <PaymentDialog
        player={selectedPlayer}
        onClose={onClose}
        isOpen={isOpen}
        userId={data.userId}
        currentSeasonId={data.season.id}
      />
      <Text fontSize={"md"} mb={4}>
        Klicke einen Spieler an um Bezahlungen hinzuzufügen
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
