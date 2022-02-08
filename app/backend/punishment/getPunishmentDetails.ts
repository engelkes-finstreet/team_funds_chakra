import { db } from "~/utils/db.server";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Params } from "react-router";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";

async function getPunishment(slug: string | undefined) {
  const punishment = await db.punishment.findUnique({
    where: {
      slug,
    },
  });

  if (!punishment) {
    throw new Response("Strafe wurde nicht gefunden", { status: 404 });
  }

  return punishment;
}

async function getPunishmentList(punishmentId: string, seasonId: string) {
  return db.playerPunishments.findMany({
    where: {
      punishmentId,
      seasonId,
    },
    include: {
      player: true,
    },
  });
}

async function getTotalAmountOfPunishment(
  punishmentId: string,
  seasonId: string
) {
  const totalCosts = await db.playerPunishments.aggregate({
    where: {
      punishmentId,
      seasonId,
    },
    _sum: {
      amount: true,
    },
  });

  return totalCosts._sum.amount;
}

async function getPlayerWithHighestPunishmentAmount(
  punishmentId: string,
  seasonId: string
) {
  const highestPunishmentAmount = await db.playerPunishments.groupBy({
    by: ["playerId"],
    where: {
      punishmentId,
      seasonId,
    },
    _max: {
      amount: true,
    },
  });

  if (highestPunishmentAmount.length > 0) {
    const playerWithHighestPunishment = await db.player.findUnique({
      where: {
        id: highestPunishmentAmount[0].playerId,
      },
    });

    return {
      player: playerWithHighestPunishment,
      amount: highestPunishmentAmount[0]._max.amount,
    };
  }

  return undefined;
}

export async function getPunishmentDetails(params: Params) {
  const { id: seasonId } = await getCurrentSeason();
  const punishment = await getPunishment(params.punishmentSlug);

  const totalAmountOfPunishment = await getTotalAmountOfPunishment(
    punishment.id,
    seasonId
  );
  const punishmentList = await getPunishmentList(punishment.id, seasonId);
  const playerWithHighestPunishmentAmount =
    await getPlayerWithHighestPunishmentAmount(punishment.id, seasonId);

  return {
    playerWithHighestPunishmentAmount,
    totalAmountOfPunishment,
    punishment,
    punishmentList,
  };
}

export type GetPunishmentDetailsType = Awaited<
  ReturnType<typeof getPunishmentDetails>
>;
