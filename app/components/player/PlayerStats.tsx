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
  );
}
