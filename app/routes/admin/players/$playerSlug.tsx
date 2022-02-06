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
import {
  getPlayerDetails,
  GetPlayerDetailsType,
} from "~/backend/player/getPlayerDetails";
import { PlayerStats } from "~/components/player/PlayerStats";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPlayerDetails(params);
};

export default function PlayerDetailRoute() {
  const { player } = useLoaderData<GetPlayerDetailsType>();

  return (
    <PageWrapper heading={getPlayerName(player)}>
      <PlayerStats />
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
