import { useLoaderData } from "remix";
import { loader } from "~/routes/admin/punishments/$punishmentSlug";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { formatCurrency, getPlayerName, toLocaleDate } from "~/utils/functions";

export function PunishmentsTable() {
  const { allPunishmentsByType } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Datum</Th>
          <Th>Spieler</Th>
          <Th>Menge</Th>
        </Tr>
      </Thead>
      <Tbody>
        {allPunishmentsByType.map(({ id, createdAt, player, amount }) => (
          <Tr key={id}>
            <Td>{toLocaleDate(createdAt)}</Td>
            <Td>{getPlayerName(player)}</Td>
            <Td>{amount}x</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
