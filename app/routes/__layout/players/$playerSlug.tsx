import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  getPlayerDetails,
  GetPlayerDetailsType,
} from "~/backend/player/getPlayerDetails";
import { useLoaderData } from "remix";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { getPlayerName } from "~/utils/functions";
import { PlayerStats } from "~/components/player/PlayerStats";
import {
  Divider,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { PlayerPunishmentsTable } from "~/components/player/PlayerPunishmentsTable";
import { PlayerPaymentsTable } from "~/components/player/PlayerPaymentsTable";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPlayerDetails(params);
};

export default function PlayerDetailsRoute() {
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
