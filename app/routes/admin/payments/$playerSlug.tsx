import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  getPlayerDetails,
  GetPlayerDetailsType,
} from "~/backend/player/getPlayerDetails";
import { ActionFunction, useLoaderData } from "remix";
import { getPlayer, GetPlayerType } from "~/backend/player/getPlayer";
import { getPlayerName } from "~/utils/functions";
import { paymentValidator } from "~/routes/admin/payments/index";
import { TextField } from "~/components/form/TextField";
import { Button, Flex, IconButton, VStack } from "@chakra-ui/react";
import { PunishmentTypeComponent } from "~/components/punishment/PunishmentTypeSelect";
import { HiX } from "react-icons/hi";
import { ValidatedForm, validationError } from "remix-validated-form";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { useState } from "react";
import { requireUserId } from "~/utils/session.server";
import { Form } from "~/components/form/Form";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const userId = await requireUserId(request);
  const { player } = await getPlayer(params);
  const season = await getCurrentSeason();

  return { userId, player, season };
};

export const action: ActionFunction = async ({ request }) => {
  const data = await paymentValidator.validate(await request.formData());
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

export default function PlayerPaymentRoute() {
  const { player, userId, season } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const [payments, setPayments] = useState([0]);

  return (
    <PageWrapper heading={`Bezahlung von ${getPlayerName(player)} hinzufügen`}>
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
                selectName={`payments[${index}].paymentType`}
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
    </PageWrapper>
  );
}
