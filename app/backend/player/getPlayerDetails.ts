import { Params } from "react-router";
import { db } from "~/utils/db.server";
import { Player, Prisma, Punishment, PunishmentType } from "@prisma/client";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";

//types
export type PlayerDetailsType = Awaited<ReturnType<typeof getPlayerDetails>>;
export type OpenPunishmentsType = Awaited<ReturnType<typeof getOpenPayments>>;
export type MostCommonPunishmentType = Awaited<
  ReturnType<typeof getMostCommonPunishment>
>;
export type AllPunishmentsByPlayerType = Awaited<
  ReturnType<typeof getAllPunishmentsByPlayer>
>;
export type AllPaymentsByPlayerType = Awaited<
  ReturnType<typeof getAllPaymentsByPlayer>
>;
type GroupedPunishmentsType = Awaited<
  ReturnType<typeof getPunishmentsByPlayer>
>;

//functions
export async function getPlayerDetails(slug: string | undefined) {
  const season = await getCurrentSeason();
  const player = await db.player.findUnique({
    where: { slug },
  });

  if (!player) {
    throw new Response("Spieler konnte nicht gefunden werden", { status: 404 });
  }

  const allPunishmentsByPlayer = await getAllPunishmentsByPlayer(
    player.id,
    season.id
  );
  const allPaymentsByPlayer = await getAllPaymentsByPlayer(
    player.id,
    season.id
  );
  const allPunishments = await db.punishment.findMany({
    where: {
      seasonId: season.id,
    },
  });
  const mostCommonPunishment = await getMostCommonPunishment(
    player.id,
    season.id,
    allPunishments
  );
  const openBeerPunishments = await getOpenPayments(
    player.id,
    season.id,
    "BEER",
    allPunishments
  );
  const openMoneyPunishments = await getOpenPayments(
    player.id,
    season.id,
    "MONEY",
    allPunishments
  );

  return {
    openBeerPunishments,
    openMoneyPunishments,
    mostCommonPunishment,
    player,
    allPunishmentsByPlayer,
    allPaymentsByPlayer,
  };
}

async function getAllPunishmentsByPlayer(playerId: string, seasonId: string) {
  return db.playerPunishments.findMany({
    where: {
      playerId,
      seasonId,
    },
    include: {
      punishment: true,
    },
  });
}

async function getAllPaymentsByPlayer(playerId: string, seasonId: string) {
  return db.playerPayments.findMany({
    where: {
      playerId,
      seasonId,
    },
  });
}

async function getMostCommonPunishment(
  playerId: string,
  seasonId: string,
  allPunishments: Array<Punishment>
) {
  const mostCommonPunishment = await db.playerPunishments.groupBy({
    by: ["punishmentId"],
    where: {
      playerId,
      seasonId,
    },
    _max: {
      amount: true,
    },
  });

  if (mostCommonPunishment.length > 0) {
    return {
      amount: mostCommonPunishment[0]._max.amount,
      punishment: allPunishments.filter(
        (punishment) => punishment.id === mostCommonPunishment[0].punishmentId
      )[0],
    };
  }

  return undefined;
}

async function getOpenPayments(
  playerId: string,
  seasonId: string,
  type: PunishmentType,
  allPunishments: Array<Punishment>
) {
  const payments = await db.playerPayments.aggregate({
    where: {
      playerId,
      seasonId,
      type,
    },
    _sum: {
      amount: true,
    },
  });

  if (payments._sum) {
    const punishments = await getPunishmentsByPlayer(playerId, seasonId, type);
    const totalMoneyPunishments = getTotalCostFromPunishments(
      punishments,
      allPunishments
    );
    return totalMoneyPunishments - (payments._sum.amount ?? 0);
  }

  return undefined;
}

async function getPunishmentsByPlayer(
  playerId: string,
  seasonId: string,
  type: PunishmentType
) {
  return await db.playerPunishments.groupBy({
    by: ["punishmentId"],
    where: {
      playerId,
      seasonId,
      punishment: {
        type: type,
      },
    },
    _sum: {
      amount: true,
    },
  });
}

function getTotalCostFromPunishments(
  playerPunishments: GroupedPunishmentsType,
  allPunishments: Array<Punishment>
) {
  let result = 0;

  playerPunishments.forEach(({ punishmentId, _sum }) => {
    const cost = allPunishments.filter(
      (punishment) => punishment.id === punishmentId
    )[0].amount;
    if (_sum && _sum.amount) {
      result += cost * _sum.amount;
    }
  });

  return result;
}
