import { TFHandle } from "~/utils/types/handle.types";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { getPlayer } from "~/backend/player/getPlayer";
import { useCatch, useLoaderData } from "remix";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { formatCurrency } from "~/utils/functions";
import { useState } from "react";
import * as z from "zod";
import { stringToNumberValidation } from "~/utils/validations/utils";
import { PayTextField } from "~/components/pay/PayTextField";
import { PayPalButton } from "~/components/pay/PayPalButton";
import { getOpenPaymentsByPlayer } from "~/backend/player/punishments/getOpenPaymentsByPlayer";
import { getUserId } from "~/utils/auth/session-utils.server";
import { Button } from "~/components/chakra/Button";

const validator = (maxAmount: number) =>
  z.object({
    maxAmount: stringToNumberValidation(
      "Es muss eine Zahl angegeben werden"
    ).refine((value) => Number(value) <= maxAmount, {
      message: `Muss geringer als ${maxAmount} sein`,
    }),
  });

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Bezahlen",
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const userId = await getUserId({ request });
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
  const [screen, setScreen] = useState(Screens.PAY);
  const [value, setValue] = useState("");

  switch (screen) {
    case Screens.PAY:
      return (
        <Pay
          data={data}
          setScreen={setScreen}
          setPayPalValue={setValue}
          value={value}
        />
      );
    case Screens.CHECKOUT:
      return <Checkout value={value} />;
  }
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
  value: string;
};

const Pay = ({ data, setScreen, setPayPalValue, value }: PayProps) => {
  const [isValid, setValid] = useState(false);

  if (!data) {
    return (
      <Alert
        status={"success"}
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="220px"
      >
        <AlertIcon boxSize={"40px"} mr={0} mb={4} />
        <AlertTitle>Du hast bisher noch keine Geldstrafen gesammelt</AlertTitle>
        <AlertDescription>
          Sobald du ein paar mal getunnelt wurdest komm zurück und bezahle hier!
        </AlertDescription>
      </Alert>
    );
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
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{caught.data}</AlertTitle>
      </Alert>
    </div>
  );
}
