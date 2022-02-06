import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useLoaderData } from "remix";
import { loader } from "~/routes/admin/players/$playerSlug";
import { formatCurrency, toLocaleDate } from "~/utils/functions";
import { getPunishmentTypeMapping } from "~/utils/enumMappings";

export function PlayerPaymentsTable() {
  const { allPaymentsByPlayer } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Datum</Th>
          <Th>Typ</Th>
          <Th>Menge</Th>
        </Tr>
      </Thead>
      <Tbody>
        {allPaymentsByPlayer.map(({ id, createdAt, type, amount }) => (
          <Tr key={id}>
            <Td>{toLocaleDate(createdAt)}</Td>
            <Td>{getPunishmentTypeMapping(type)}</Td>
            <Td>
              {type === "BEER"
                ? `${amount} Kiste/n`
                : `${formatCurrency(amount)}`}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
