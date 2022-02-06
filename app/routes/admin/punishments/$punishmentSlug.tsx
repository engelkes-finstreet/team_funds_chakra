import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Stat } from "~/components/player/Stat";
import { getPlayerName } from "~/utils/functions";
import {
  Divider,
  Heading,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { PunishmentsTable } from "~/components/punishment/PunishmentsTable";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const punishment = await db.punishment.findUnique({
    where: {
      slug: params.punishmentSlug,
    },
  });

  if (!punishment) {
    throw new Response("Strafe wurde nicht gefunden", { status: 404 });
  }

  const highestPunishmentAmount = await db.playerPunishments.groupBy({
    by: ["playerId"],
    where: {
      punishmentId: punishment.id,
    },
    _max: {
      amount: true,
    },
  });

  const playerWithHighestPunishment = await db.player.findUnique({
    where: {
      id: highestPunishmentAmount[0].playerId,
    },
  });

  const playerWithHighestPunishmentAmount = {
    player: playerWithHighestPunishment,
    amount: highestPunishmentAmount[0]._max.amount,
  };

  const totalAmountOfPunishment = await db.playerPunishments.groupBy({
    by: ["punishmentId"],
    _sum: {
      amount: true,
    },
  });

  const allPunishmentsByType = await db.playerPunishments.findMany({
    where: {
      punishmentId: punishment.id,
    },
    include: {
      player: true,
    },
  });

  return {
    playerWithHighestPunishmentAmount,
    totalAmountOfPunishment,
    punishment,
    allPunishmentsByType,
  };
};

export default function PunishmentRoute() {
  const {
    punishment,
    playerWithHighestPunishmentAmount,
    totalAmountOfPunishment,
  } = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <PageWrapper heading={punishment.name}>
      <SimpleGrid
        mx="auto"
        spacing={{ base: "10", md: "20" }}
        columns={{ base: 1, md: 2 }}
        mb={8}
      >
        <Stat
          title={"Liebelingsstrafe"}
          value={`${playerWithHighestPunishmentAmount.amount} X`}
          accentColor={useColorModeValue("teal.500", "teal.300")}
        >
          {getPlayerName(playerWithHighestPunishmentAmount.player)} mag diese
          Strafe ganz besonders
        </Stat>
        <Stat
          title={"Insgesamt"}
          value={`${totalAmountOfPunishment[0]._sum.amount} X`}
          accentColor={useColorModeValue("blue.500", "blue.300")}
        >
          So oft wurde diese Strafe insgesamt schon begangen
        </Stat>
      </SimpleGrid>
      <Heading size={"md"} mb={4}>
        Historie
      </Heading>
      <Divider mb={6} />
      <PunishmentsTable />
    </PageWrapper>
  );
}
