import { Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData, useNavigate } from "remix";
import { getPlayerName } from "~/utils/functions";
import { getAllPlayers } from "~/backend/player/getAllPlayers";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getAllPlayers();
};

export default function PaymentsIndexRoute() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const navigate = useNavigate();

  return (
    <>
      <Text fontSize={"md"} mb={4}>
        Klicke einen Spieler an um Bezahlungen hinzuzufügen
      </Text>
      <Table variant={"striped"} colorScheme={"blue"}>
        <Tbody>
          {data.players.map((player) => (
            <Tr
              key={player.id}
              _hover={{ cursor: "pointer", opacity: 0.8 }}
              onClick={() => {
                navigate(`${player.slug}`);
              }}
            >
              <Td>{getPlayerName(player)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
