import { Params } from "react-router";
import { db } from "~/utils/db.server";

export async function getPlayer(params: Params) {
  const player = await db.player.findUnique({
    where: {
      slug: params.playerSlug,
    },
  });

  return { player };
}

export type GetPlayerType = Awaited<ReturnType<typeof getPlayer>>;
