import { useLoaderData, useNavigate } from "remix";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import { getPlayerName } from "~/utils/functions";
import { getAllPlayers } from "~/backend/player/getAllPlayers";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { TFHandle } from "~/utils/types/handle.types";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return getAllPlayers();
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  return (
    <PageWrapper heading={"Spieler bestrafen"}>
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
    </PageWrapper>
  );
}
