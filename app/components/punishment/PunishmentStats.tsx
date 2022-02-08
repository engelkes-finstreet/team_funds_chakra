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
        title={
          playerWithHighestPunishmentAmount ? "Lieblingsstrafe" : "0 Spieler"
        }
        value={
          playerWithHighestPunishmentAmount
            ? `${playerWithHighestPunishmentAmount.amount}x`
            : ""
        }
        accentColor={useColorModeValue("teal.500", "teal.300")}
      >
        {playerWithHighestPunishmentAmount
          ? `${getPlayerName(
              playerWithHighestPunishmentAmount?.player
            )} mag diese
        Strafe ganz besonders`
          : "Es gibt noch keinen Spieler mit dieser Strafe"}
      </Stat>
      <Stat
        title={totalAmountOfPunishment ? "Insgesamt" : "Nie begangen"}
        value={totalAmountOfPunishment ? `${totalAmountOfPunishment}x` : ""}
        accentColor={useColorModeValue("blue.500", "blue.300")}
      >
        {totalAmountOfPunishment
          ? "So oft wurde diese Strafe insgesamt schon begangen"
          : "Bisher hat noch niemand diese Strafe begangen"}
      </Stat>
    </SimpleGrid>
  );
}
