import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { ActionFunction, useLoaderData } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { PunishmentType } from "@prisma/client";
import { stringToNumberValidation } from "~/utils/validations/utils";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";
import { TextField } from "~/components/form/TextField";
import { Button, Flex, IconButton, VStack } from "@chakra-ui/react";
import { Select } from "~/components/form/Select";
import { HiX } from "react-icons/hi";
import { Form } from "~/components/form/Form";
import { getPlayer } from "~/backend/player/getPlayer";
import { useState } from "react";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const season = await getCurrentSeason();
  const userId = await requireUserId(request);
  const { player } = await getPlayer(params);
  const punishments = await db.punishment.findMany();

  return { player, punishments, userId, season };
};

export const playerPunishmentValidator = withZod(
  z.object({
    _playerId: z.string(),
    _playerName: z.string(),
    _userId: z.string(),
    _seasonId: z.string(),
    punishments: z.array(
      z.object({
        punishmentId: z.string(),
        amount: stringToNumberValidation("Erforderlich"),
      })
    ),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const data = await playerPunishmentValidator.validate(
    await request.formData()
  );
  if (data.error) return validationError(data.error);
  const { _userId, _playerId, _playerName, _seasonId, punishments } = data.data;

  for (let punishment of punishments) {
    await db.playerPunishments.create({
      data: {
        userId: _userId,
        playerId: _playerId,
        seasonId: _seasonId,
        amount: punishment.amount,
        punishmentId: punishment.punishmentId,
      },
    });
  }

  return await setFlashContent(
    "/admin/player-punishments",
    request,
    `Strafen für ${_playerName} erfolgreich hinzugefügt`,
    "success"
  );
};

export default function PlayerPunishmentRoute() {
  const { player, userId, season, punishments } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const [playerPunishments, setPlayerPunishments] = useState([0]);

  return (
    <PageWrapper heading={"Test"}>
      <Form
        validator={playerPunishmentValidator}
        method={"post"}
        id={"playerPunishmentForm"}
        submitText={"Strafe/n hinzufügen"}
        defaultValues={{
          _userId: userId,
          _playerId: player?.id,
          _playerName: getPlayerName(player),
          _seasonId: season.id,
        }}
      >
        <TextField name={"_userId"} hidden={true} />
        <TextField name={"_playerId"} hidden={true} />
        <TextField name={"_playerName"} hidden={true} />
        <TextField name={"_seasonId"} hidden={true} />
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
                autoFocus={true}
              >
                {punishments.map((punishment) => (
                  <option key={punishment.id} value={punishment.id}>
                    {punishment.name}
                  </option>
                ))}
              </Select>
              <TextField
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
      </Form>
    </PageWrapper>
  );
}
