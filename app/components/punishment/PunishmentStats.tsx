import { Stat } from "~/components/player/Stat";
import { SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { getPlayerName } from "~/utils/functions";
import { GetPunishmentDetailsType } from "~/backend/punishment/getPunishmentDetails";
import { useLoaderData } from "remix";

export function PunishmentStats() {
  const { playerWithHighestPunishmentAmount, totalAmountOfPunishment } =
    useLoaderData<GetPunishmentDetailsType>();

  return (
    <SimpleGrid
      mx="auto"
      spacing={{ base: "10", md: "20" }}
      columns={{ base: 1, md: 2 }}
      mb={8}
    >
      <Stat
        title={"Lieblingsstrafe"}
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
  );
}
