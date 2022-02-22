import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  getAllConnectedPlayers,
  getAllUnconnectedPlayers,
  PlayerWithUser,
} from "~/backend/player/getAllPlayers";
import { getAllUnconnectedUsers } from "~/backend/user/getAllUsers";
import { useFetcher, useLoaderData } from "remix";
import { Divider, Flex, Heading, Select, Text } from "@chakra-ui/react";
import { getPlayerName } from "~/utils/functions";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Player, User } from "@prisma/client";
import { AiOutlineDelete } from "react-icons/ai";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "User verbinden",
};

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const { unconnectedPlayers } = await getAllUnconnectedPlayers();
  const { connectedPlayers } = await getAllConnectedPlayers();
  const { unconnectedUsers } = await getAllUnconnectedUsers();

  return {
    unconnectedUsers,
    connectedPlayers,
    unconnectedPlayers,
  };
};

export default function ConnectUserRoute() {
  const { unconnectedPlayers, connectedPlayers, unconnectedUsers } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <>
      <Flex flexDirection={"column"} gap={8}>
        <Flex flexDirection={"column"} gap={4}>
          <Heading size={"sm"} fontWeight={"bold"}>
            Noch nicht verbundene Spieler
          </Heading>
          {unconnectedPlayers.map((player) => (
            <ConnectPlayer
              key={player.id}
              player={player}
              users={unconnectedUsers}
            />
          ))}
        </Flex>
        <Divider />
        <Flex flexDirection={"column"} gap={4}>
          <Heading size={"sm"} fontWeight={"bold"}>
            Verbundene Spieler
          </Heading>
          {connectedPlayers.map((player) => (
            <RemovePlayer player={player} key={player.id} />
          ))}
        </Flex>
      </Flex>
    </>
  );
}

type ConnectPlayerProps = {
  player: Player;
  users: Array<User>;
};

const ConnectPlayer = ({ player, users }: ConnectPlayerProps) => {
  const fetcher = useFetcher();

  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} mb={4}>
      <Text>{getPlayerName(player)}</Text>
      <Text color={"white"}>
        <VscDebugDisconnect />
      </Text>
      <Select
        maxW={"200px"}
        onChange={(event) => {
          fetcher.submit(
            { userId: event.currentTarget.value, playerId: player.id },
            { method: "post", action: "/admin/connect-user/connect" }
          );
        }}
        placeholder={"User auswählen"}
      >
        {users.map((user) => (
          <option
            key={user.id}
            value={user.id}
          >{`${user.firstName} ${user.lastName}`}</option>
        ))}
      </Select>
    </Flex>
  );
};

type RemovePlayerProps = {
  player: PlayerWithUser;
};

const RemovePlayer = ({ player }: RemovePlayerProps) => {
  const fetcher = useFetcher();

  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} mb={4}>
      <Text>{getPlayerName(player)}</Text>
      <Text color={"red"}>
        <AiOutlineDelete
          onClick={() => {
            fetcher.submit(
              { playerId: player.id },
              { method: "post", action: "/admin/connect-user/remove" }
            );
          }}
        />
      </Text>
      <Text
        maxW={"200px"}
      >{`${player.connectedUser?.firstName} ${player.connectedUser?.lastName}`}</Text>
    </Flex>
  );
};
