import { useLoaderData } from "remix";
import { GetPlayerDetailsType } from "~/backend/player/getPlayerDetails";
import { Stat } from "~/components/player/Stat";
import { formatCurrency, getPlayerName } from "~/utils/functions";
import { SimpleGrid, useColorModeValue } from "@chakra-ui/react";

export function PlayerStats() {
  const {
    openMoneyPunishments,
    openBeerPunishments,
    player,
    mostCommonPunishment,
  } = useLoaderData<GetPlayerDetailsType>();

  return (
    <SimpleGrid
      mx="auto"
      mb={8}
      spacing={{ base: "10", md: "20" }}
      columns={{ base: 1, md: 3 }}
    >
      <Stat
        title={openMoneyPunishments ? "noch zu zahlen" : "nichts offen"}
        value={openMoneyPunishments ? formatCurrency(openMoneyPunishments) : ""}
        accentColor={useColorModeValue("teal.500", "teal.300")}
      >
        {openMoneyPunishments
          ? `Dieser Betrag muss von ${getPlayerName(
              player
            )} bis zum Ende des Monats
          bezahlt werden`
          : "Noch keine Geldbeträge offen"}
      </Stat>
      <Stat
        title={openBeerPunishments ? "noch zu schmeißen" : "nichts offen"}
        value={openBeerPunishments ? `${openBeerPunishments} Kisten` : ""}
        accentColor={useColorModeValue("blue.500", "blue.300")}
      >
        {openBeerPunishments
          ? `Bei der nächsten Mannschaftsfeier gibt es von ${getPlayerName(
              player
            )}{" "}
          einige Kisten`
          : "Noch keine Bierstrafen offen"}
      </Stat>
      <Stat
        title={
          mostCommonPunishment
            ? mostCommonPunishment.punishment.name
            : "keine Strafen"
        }
        value={mostCommonPunishment ? `${mostCommonPunishment.amount} Mal` : ""}
        accentColor={useColorModeValue("red.500", "red.300")}
      >
        {mostCommonPunishment
          ? "Häufigste Strafe"
          : "Noch keine Strafe erhalten"}
      </Stat>
    </SimpleGrid>
  );
}
