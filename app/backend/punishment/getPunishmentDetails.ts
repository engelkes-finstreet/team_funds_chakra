import { db } from "~/utils/db.server";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Params } from "react-router";

export async function getPunishmentDetails(params: Params) {
  const punishment = await db.punishment.findUnique({
    where: {
      slug: params.punishmentSlug,
    },
  });

  if (!punishment) {
    throw new Response("Strafe wurde nicht gefunden", { status: 404 });
  }

  const highestPunishmentAmount = await db.playerPunishments.groupBy({
    by: ["playerId"],
    where: {
      punishmentId: punishment.id,
    },
    _max: {
      amount: true,
    },
  });

  const playerWithHighestPunishment = await db.player.findUnique({
    where: {
      id: highestPunishmentAmount[0].playerId,
    },
  });

  const playerWithHighestPunishmentAmount = {
    player: playerWithHighestPunishment,
    amount: highestPunishmentAmount[0]._max.amount,
  };

  const totalAmountOfPunishment = await db.playerPunishments.groupBy({
    by: ["punishmentId"],
    _sum: {
      amount: true,
    },
  });

  const allPunishmentsByType = await db.playerPunishments.findMany({
    where: {
      punishmentId: punishment.id,
    },
    include: {
      player: true,
    },
  });

  return {
    playerWithHighestPunishmentAmount,
    totalAmountOfPunishment,
    punishment,
    allPunishmentsByType,
  };
}

export type GetPunishmentDetailsType = Awaited<
  ReturnType<typeof getPunishmentDetails>
>;
