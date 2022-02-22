import { PlayerStats } from "~/components/player/PlayerStats";
import { PlayerDetailsType } from "~/backend/player/getPlayerDetails";
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

type Props = {
  playerDetails: PlayerDetailsType;
};

export function PlayerProfilePage({
  playerDetails: {
    player,
    allPaymentsByPlayer,
    allPunishmentsByPlayer,
    openBeerPunishments,
    mostCommonPunishment,
    openMoneyPunishments,
  },
}: Props) {
  return (
    <>
      <PlayerStats
        player={player}
        openBeerPunishments={openBeerPunishments}
        openMoneyPunishments={openMoneyPunishments}
        mostCommonPunishment={mostCommonPunishment}
      />
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
            <PlayerPunishmentsTable
              allPunishmentsByPlayer={allPunishmentsByPlayer}
            />
          </TabPanel>
          <TabPanel>
            <PlayerPaymentsTable allPaymentsByPlayer={allPaymentsByPlayer} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
