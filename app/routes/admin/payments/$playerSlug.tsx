import { DataFunctionArgs } from "@remix-run/server-runtime";
import { ActionFunction, useLoaderData } from "remix";
import { getPlayer } from "~/backend/player/getPlayer";
import { getPlayerName } from "~/utils/functions";
import { TextField } from "~/components/form/TextField";
import { Button, Flex, IconButton, VStack } from "@chakra-ui/react";
import { PunishmentTypeComponent } from "~/components/punishment/PunishmentTypeSelect";
import { HiX } from "react-icons/hi";
import { validationError } from "remix-validated-form";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { useState } from "react";
import { Form } from "~/components/form/Form";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { withZod } from "@remix-validated-form/with-zod";
import { stringToNumberValidationAndTransformation } from "~/utils/validations/utils";
import { PunishmentType } from "@prisma/client";
import * as z from "zod";
import { TFHandle } from "~/utils/types/handle.types";
import { getUserId } from "~/utils/auth/session-utils.server";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => getPlayerName(data.player),
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const userId = await getUserId({ request });
  const player = await getPlayer({ where: { slug: params.playerSlug } });
  const season = await getCurrentSeason();

  return { userId, player, season };
};

const paymentValidator = withZod(
  z.object({
    _playerId: z.string(),
    _playerName: z.string(),
    _userId: z.string(),
    _seasonId: z.string(),
    payments: z.array(
      z.object({
        punishmentType: z.nativeEnum(PunishmentType),
        amount: stringToNumberValidationAndTransformation("Erforderlich"),
      })
    ),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const data = await paymentValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { _userId, _playerId, _playerName, _seasonId, payments } = data.data;

  for (let payment of payments) {
    await db.playerPayments.create({
      data: {
        adminUserId: _userId,
        playerId: _playerId,
        seasonId: _seasonId,
        amount: payment.amount,
        type: payment.punishmentType,
        paymentType: "ADMIN",
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

export default function PlayerPaymentRoute() {
  const { player, userId, season } = useLoaderData<LoaderData>();
  const [payments, setPayments] = useState([0]);

  return (
    <>
      <Form
        submitText={"Bezahlung hinzufügen"}
        validator={paymentValidator}
        method={"post"}
        id={"paymentForm"}
        defaultValues={{
          _userId: userId,
          _playerId: player?.id,
          _playerName: getPlayerName(player),
          _seasonId: season.id,
        }}
      >
        <VStack spacing={4} w={"full"}>
          <TextField name={"_userId"} hidden={true} display={"none"} />
          <TextField name={"_playerId"} hidden={true} display={"none"} />
          <TextField name={"_playerName"} hidden={true} display={"none"} />
          <TextField name={"_seasonId"} hidden={true} display={"none"} />
          {payments.map((payment, index) => (
            <Flex
              gap={2}
              spacing={2}
              key={payment}
              w={"full"}
              alignItems={"flex-end"}
            >
              <PunishmentTypeComponent
                selectName={`payments[${index}].punishmentType`}
                selectLabel={"Strafe"}
                textFieldName={`payments[${index}].amount`}
                textFieldLabel={"Zahlhöhe"}
                autoFocus={true}
              />
              <IconButton
                onClick={() => {
                  setPayments((prev) =>
                    prev.filter((currentPayment) => currentPayment !== payment)
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
              onClick={() => setPayments((prev) => [...prev, payments.length])}
            >
              weitere Bezahlung hinzufügen
            </Button>
          </Flex>
        </VStack>
      </Form>
    </>
  );
}
