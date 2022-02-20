import { db } from "~/utils/db.server";
import { Prisma } from "@prisma/client";

export async function getAllPlayers() {
  const players = await db.player.findMany();

  return { players };
}

export type GetAllPlayersType = Awaited<ReturnType<typeof getAllPlayers>>;

export async function getAllConnectedPlayers() {
  const connectedPlayers = await db.player.findMany({
    where: {
      userId: {
        not: null,
      },
    },
    include: {
      connectedUser: true,
    },
  });

  return { connectedPlayers };
}

const playerWithUser = Prisma.validator<Prisma.PlayerArgs>()({
  include: {
    connectedUser: true,
  },
});
export type PlayerWithUser = Prisma.PlayerGetPayload<typeof playerWithUser>;

export async function getAllUnconnectedPlayers() {
  const unconnectedPlayers = await db.player.findMany({
    where: {
      userId: {
        equals: null,
      },
    },
  });

  return { unconnectedPlayers };
}
