import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { formatCurrency, toLocaleDate } from "~/utils/functions";
import { AllPunishmentsByPlayerType } from "~/backend/player/getPlayerDetails";

type Props = {
  allPunishmentsByPlayer: AllPunishmentsByPlayerType;
};

export function PlayerPunishmentsTable({ allPunishmentsByPlayer }: Props) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Datum</Th>
          <Th>Anzahl</Th>
          <Th>Kosten</Th>
        </Tr>
      </Thead>
      <Tbody>
        {allPunishmentsByPlayer.map(({ id, punishment, amount, createdAt }) => (
          <Tr key={id}>
            <Td>{punishment.name}</Td>
            <Td>{toLocaleDate(createdAt)}</Td>
            <Td>{amount}</Td>
            {
              <Td>
                {punishment.type === "BEER"
                  ? `${amount * punishment.amount} Kiste/n`
                  : `${formatCurrency(amount * punishment.amount)}`}
              </Td>
            }
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
