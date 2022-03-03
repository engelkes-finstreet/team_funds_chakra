import { TFHandle } from "~/utils/types/handle.types";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUserId } from "~/utils/session.server";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { getOpenPaymentsByPlayer } from "~/backend/player/getOpenPaymentsByPlayer";
import { getPlayer } from "~/backend/player/getPlayer";
import { useCatch, useLoaderData } from "remix";
import { Form } from "~/components/form/Form";
import { TextField } from "~/components/form/TextField";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { formatCurrency } from "~/utils/functions";
import { MdEuroSymbol } from "react-icons/md";
import { useRef, useState } from "react";
import * as z from "zod";
import { stringToNumberValidation } from "~/utils/validations/utils";
import { PayTextField } from "~/components/pay/PayTextField";
import { PayPalButton } from "~/components/pay/PayPalButton";

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

export default function PayRoute() {
  const data = useLoaderData<LoaderData>();
  const [value, setValue] = useState<string | undefined>("");
  const [isValid, setValid] = useState(false);

  if (!data) {
    return null;
  }

  return (
    <>
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
        setPayPalValue={setValue}
        setValid={setValid}
      />
      <PayPalButton value={value} isValid={isValid} />
    </>
  );
}

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
