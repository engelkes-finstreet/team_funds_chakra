import { GetAllPlayersType } from "~/backend/player/getAllPlayers";
import { useLoaderData, useNavigate } from "remix";
import { useIsDesktop } from "~/hooks/useIsDesktop";
import { Player } from "@prisma/client";
import {
  Button,
  Center,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { DeletePlayer } from "~/components/player/DeletePlayer";

type Props = {
  isAdmin: boolean;
} & GetAllPlayersType;

export function AllPlayersTable({ isAdmin, players }: Props) {
  const isDesktop = useIsDesktop();
  const doRender = isAdmin && isDesktop;
  const navigate = useNavigate();

  function handleClick(player: Player) {
    if (isAdmin) {
      navigate(`${player.slug}/edit`);
    } else {
      navigate(`${player.slug}`);
    }
  }

  if (players.length > 0) {
    return (
      <Table
        variant={"striped"}
        colorScheme={"blue"}
        w={"full"}
        __css={{ tableLayout: "fixed" }}
      >
        <Thead>
          <Tr>
            <Th>Vorname</Th>
            <Th>Nachname</Th>
            <AdminHead doRender={doRender} />
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player) => (
            <Tr key={player.id}>
              <Td onClick={() => handleClick(player)} cursor={"pointer"}>
                {player.firstName}
              </Td>
              <Td onClick={() => handleClick(player)} cursor={"pointer"}>
                {player.lastName}
              </Td>
              <AdminColumns doRender={doRender} player={player} />
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }

  if (isAdmin) {
    return (
      <Center>
        <VStack>
          <Text>Es wurde noch kein Spieler angelegt</Text>
          <Button colorScheme={"blue"} onClick={() => navigate("new")}>
            Neuen Spieler erstellen
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Center>
      <VStack>
        <Text>Es wurden noch keine Spieler angelegt</Text>
      </VStack>
    </Center>
  );
}

type AdminHeadProps = {
  doRender: boolean | undefined;
};

function AdminHead({ doRender }: AdminHeadProps) {
  if (doRender) {
    return (
      <>
        <Th w={"20%"}>Löschen</Th>
      </>
    );
  }

  return null;
}

type AdminColumnProps = {
  doRender: boolean | undefined;
  player: Player;
};

function AdminColumns({ doRender, player }: AdminColumnProps) {
  if (doRender) {
    return (
      <>
        <DeletePlayer playerId={player.id} />
      </>
    );
  }

  return null;
}
