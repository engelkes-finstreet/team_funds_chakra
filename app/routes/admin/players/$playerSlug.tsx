import { DataFunctionArgs } from "@remix-run/server-runtime";
import { db } from "~/utils/db.server";
import { Player, Prisma, Punishment, PunishmentType } from "@prisma/client";
import { useLoaderData } from "remix";
import {
  Divider,
  Heading,
  SimpleGrid,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Stat } from "~/components/player/Stat";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { formatCurrency, getPlayerName } from "~/utils/functions";
import { PlayerPunishmentsTable } from "~/components/player/PlayerPunishmentsTable";
import { PlayerPaymentsTable } from "~/components/player/PlayerPaymentsTable";

async function getPunishmentsByPlayer(
  player: Player | null,
  type: PunishmentType
) {
  if (player) {
    return await db.playerPunishments.groupBy({
      by: ["punishmentId"],
      where: {
        playerId: player.id,
        punishment: {
          type: type,
        },
      },
      _sum: {
        amount: true,
      },
    });
  }

  return [];
}

type GroupedPunishments = Prisma.PromiseReturnType<
  typeof getPunishmentsByPlayer
>;

async function getMostCommonPunishment(player: Player | null) {
  return await db.playerPunishments.groupBy({
    by: ["punishmentId"],
    where: {
      playerId: player?.id,
    },
    _max: {
      amount: true,
    },
  });
}

function getTotalCostFromPunishments(
  playerPunishments: GroupedPunishments,
  allPunishments: Array<Punishment>
) {
  let result = 0;

  playerPunishments.forEach(({ punishmentId, _sum }) => {
    const cost = allPunishments.filter(
      (punishment) => punishment.id === punishmentId
    )[0].amount;
    if (_sum && _sum.amount) {
      result += cost * _sum.amount;
    }
  });

  return result;
}

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const player = await db.player.findUnique({
    where: { slug: params.playerSlug },
  });

  if (!player) {
    throw new Response("Spieler konnte nicht gefunden werden", { status: 404 });
  }

  const allPunishmentsByPlayer = await db.playerPunishments.findMany({
    where: {
      playerId: player.id,
    },
    include: {
      punishment: true,
    },
  });

  const allPaymentsByPlayer = await db.playerPayments.findMany({
    where: {
      playerId: player.id,
    },
  });

  const mostCommonPunishmentGrouped = await getMostCommonPunishment(player);
  const allPunishments = await db.punishment.findMany();
  const beerPunishments = await getPunishmentsByPlayer(player, "BEER");
  const moneyPunishments = await getPunishmentsByPlayer(player, "MONEY");
  const payments = await db.playerPayments.groupBy({
    by: ["type"],
    _sum: {
      amount: true,
    },
  });

  const beerPayments =
    payments.filter((payment) => payment.type === "BEER")[0]._sum.amount ?? 0;
  const moneyPayments =
    payments.filter((payment) => payment.type === "MONEY")[0]._sum.amount ?? 0;

  let beerCosts = getTotalCostFromPunishments(beerPunishments, allPunishments);
  let moneyCosts = getTotalCostFromPunishments(
    moneyPunishments,
    allPunishments
  );

  const mostCommonPunishment = {
    amount: mostCommonPunishmentGrouped[0]._max.amount,
    punishment: allPunishments.filter(
      (punishment) =>
        punishment.id === mostCommonPunishmentGrouped[0].punishmentId
    )[0],
  };

  return {
    openBeerPunishments: beerCosts - beerPayments,
    openMoneyPunishments: moneyCosts - moneyPayments,
    mostCommonPunishment,
    player,
    allPunishmentsByPlayer,
    allPaymentsByPlayer,
  };
};

export default function PlayerDetailRoute() {
  const {
    openBeerPunishments,
    openMoneyPunishments,
    mostCommonPunishment,
    player,
  } = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <PageWrapper heading={getPlayerName(player)}>
      <SimpleGrid
        mx="auto"
        mb={8}
        spacing={{ base: "10", md: "20" }}
        columns={{ base: 1, md: 3 }}
      >
        <Stat
          title="noch zu zahlen"
          value={formatCurrency(openMoneyPunishments)}
          accentColor={useColorModeValue("teal.500", "teal.300")}
        >
          Dieser Betrag muss von {getPlayerName(player)} bis zum Ende des Monats
          bezahlt werden
        </Stat>
        <Stat
          title="noch zu schmeißen"
          value={`${openBeerPunishments} Kisten`}
          accentColor={useColorModeValue("blue.500", "blue.300")}
        >
          Bei der nächsten Mannschaftsfeier gibt es von {getPlayerName(player)}{" "}
          einige Kisten
        </Stat>
        <Stat
          title={mostCommonPunishment.punishment.name}
          value={`${mostCommonPunishment.amount} Mal`}
          accentColor={useColorModeValue("red.500", "red.300")}
        >
          Häufigste Strafe
        </Stat>
      </SimpleGrid>
      <Heading size={"md"} mb={4}>
        Historie
      </Heading>
      <Divider mb={6} />
      <Tabs>
        <TabList>
          <Tab>Strafen</Tab>
          <Tab>Zahlungen</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PlayerPunishmentsTable />
          </TabPanel>
          <TabPanel>
            <PlayerPaymentsTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageWrapper>
  );
}
