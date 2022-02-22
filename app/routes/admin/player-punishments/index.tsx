import { useLoaderData, useNavigate } from "remix";
import { Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import { getPlayerName } from "~/utils/functions";
import { getAllPlayers } from "~/backend/player/getAllPlayers";
import { DataFunctionArgs } from "@remix-run/server-runtime";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return getAllPlayers();
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  return (
    <>
      <Text fontSize={"md"} mb={4}>
        Klicke einen Spieler an um eine Strafe hinzuzufügen
      </Text>
      <Table variant={"striped"} colorScheme={"blue"}>
        <Tbody>
          {data.players.map((player) => (
            <Tr
              key={player.id}
              _hover={{ cursor: "pointer", opacity: 0.8 }}
              onClick={() => navigate(player.slug)}
            >
              <Td>{getPlayerName(player)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
