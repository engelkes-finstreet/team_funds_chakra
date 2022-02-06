import { db } from "~/utils/db.server";

export async function getAllPlayers() {
  const players = await db.player.findMany();

  return { players };
}

export type GetAllPlayersType = Awaited<ReturnType<typeof getAllPlayers>>;
