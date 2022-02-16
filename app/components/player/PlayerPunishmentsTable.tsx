import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useLoaderData } from "remix";
import { loader as playerLoader } from "~/routes/admin/players/$playerSlug";
import { formatCurrency, toLocaleDate } from "~/utils/functions";

export function PlayerPunishmentsTable() {
  const { allPunishmentsByPlayer } =
    useLoaderData<Awaited<ReturnType<typeof playerLoader>>>();

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
