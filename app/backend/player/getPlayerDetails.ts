import { Params } from "react-router";
import { db } from "~/utils/db.server";
import { Player, Prisma, Punishment, PunishmentType } from "@prisma/client";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { getOpenPaymentsByPlayer } from "./punishments/getOpenPaymentsByPlayer";

//types
export type PlayerDetailsType = Awaited<ReturnType<typeof getPlayerDetails>>;
export type MostCommonPunishmentType = Awaited<
  ReturnType<typeof getMostCommonPunishment>
>;
export type AllPunishmentsByPlayerType = Awaited<
  ReturnType<typeof getAllPunishmentsByPlayer>
>;
export type AllPaymentsByPlayerType = Awaited<
  ReturnType<typeof getAllPaymentsByPlayer>
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
  const openBeerPunishments = await getOpenPaymentsByPlayer(
    player.id,
    season.id,
    "BEER"
  );
  const openMoneyPunishments = await getOpenPaymentsByPlayer(
    player.id,
    season.id,
    "MONEY"
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
