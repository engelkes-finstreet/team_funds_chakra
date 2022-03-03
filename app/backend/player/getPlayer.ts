import { db } from "~/utils/db.server";
import { Prisma } from "@prisma/client";

export async function getPlayer(args: Prisma.PlayerFindUniqueArgs) {
  const player = await db.player.findUnique({ ...args });

  if (!player) {
    throw new Response("Ein Spieler muss vorhanden sein", { status: 404 });
  }

  return player;
}

export type GetPlayerType = Awaited<ReturnType<typeof getPlayer>>;
