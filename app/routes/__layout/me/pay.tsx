import { TFHandle } from "~/utils/types/handle.types";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUserId } from "~/utils/session.server";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { getPlayer } from "~/backend/player/getPlayer";
import { useCatch, useLoaderData } from "remix";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { formatCurrency } from "~/utils/functions";
import { useState } from "react";
import * as z from "zod";
import { stringToNumberValidation } from "~/utils/validations/utils";
import { PayTextField } from "~/components/pay/PayTextField";
import { PayPalButton } from "~/components/pay/PayPalButton";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { getOpenPaymentsByPlayer } from "~/backend/player/punishments/getOpenPaymentsByPlayer";

const validator = (maxAmount: number) =>
  z.object({
    maxAmount: stringToNumberValidation(
      "Es muss eine Zahl angegeben werden"
    ).refine((value) => Number(value) < maxAmount, {
      message: `Muss geringer als ${maxAmount} sein`,
    }),
  });

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Bezahlen",
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const userId = await requireUserId(request);
  const player = await getPlayer({
    where: {
      userId,
    },
  });
  const season = await getCurrentSeason();
  return await getOpenPaymentsByPlayer(player.id, season.id, "MONEY");
};

enum Screens {
  PAY,
  CHECKOUT,
}

export default function PayRoute() {
  const data = useLoaderData<LoaderData>();
  const [screen, setScreen] = useState(Screens.CHECKOUT);
  const [value, setValue] = useState("");

  // switch (screen) {
  //   case Screens.PAY:
  //     return (
  //       <Pay data={data} setScreen={setScreen} setPayPalValue={setValue} />
  //     );
  //   case Screens.CHECKOUT:
  //     return <Checkout value={"20.00"} />;
  // }
  return <PayPalButton value={"20.00"} />;
}

type CheckoutProps = {
  value: string;
};

const Checkout = ({ value }: CheckoutProps) => {
  return (
    <>
      <Flex w={"50%"} p={2} flexDirection={"column"} gap={2} mb={4}>
        <Heading mb={4}>Checkout</Heading>
        <Text>
          Du bist dabei einen Betrag von {value} EUR an die Mannschaftskasse zu
          bezahlen
        </Text>
        <Text>
          Sobald die Bezahlung bestätigt wurde wird der Betrag von deinen
          bisherigen Strafen abgezogen
        </Text>
      </Flex>
      <Box w={"50%"}>
        <PayPalButton value={value} />
      </Box>
    </>
  );
};

type PayProps = {
  data: LoaderData;
  setScreen: (screen: Screens) => void;
  setPayPalValue: (value: string) => void;
};

const Pay = ({ data, setScreen, setPayPalValue }: PayProps) => {
  const [isValid, setValid] = useState(false);

  if (!data) {
    return null;
  }

  return (
    <Box w={"50%"}>
      <Flex
        gap={2}
        justifyContent={"flex-start"}
        flexDirection={"column"}
        mb={6}
      >
        <Heading size={"lg"} mb={4}>
          Schulden begleichen via Paypal
        </Heading>
        <Text>
          Du kannst deine Schulden hier ganz einfach via Paypal bezahlen
        </Text>
        <Text>
          Gib den Beitrag ein den du bezahlen möchtest. Er darf die Höhe deiner
          bisher angefallenen Strafen nicht überschreiten (
          <strong>{formatCurrency(data)}</strong>)
        </Text>
      </Flex>
      <PayTextField
        validator={validator(data)}
        setPayPalValue={setPayPalValue}
        setValid={setValid}
      />
      <Flex mt={4} justifyContent={"flex-end"}>
        <Button
          colorScheme={"blue"}
          disabled={!isValid}
          onClick={() => {
            setScreen(Screens.CHECKOUT);
          }}
        >
          Zum Bezahlvorgang
        </Button>
      </Flex>
    </Box>
  );
};

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}
