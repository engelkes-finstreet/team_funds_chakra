import { db } from "~/utils/db.server";
import { Prisma } from "@prisma/client";

export async function getPlayer(args: Prisma.PlayerFindUniqueArgs) {
  const player = await db.player.findUnique({ ...args });

  if (!player) {
    throw new Response(
      "Du bist noch nicht mit einem Spieler verknüpft. Bitte einen Admin dies zu tun!",
      { status: 404 }
    );
  }

  return player;
}

export type GetPlayerType = Awaited<ReturnType<typeof getPlayer>>;
