import { Params } from "react-router";
import { db } from "~/utils/db.server";
import { Player, Prisma, Punishment, PunishmentType } from "@prisma/client";

export async function getPlayerDetails(params: Params) {
  const player = await db.player.findUnique({
    where: { slug: params.playerSlug },
  });

  if (!player) {
    throw new Response("Spieler konnte nicht gefunden werden", { status: 404 });
  }

  const allPunishmentsByPlayer = await db.playerPunishments.findMany({
    where: {
      playerId: player.id,
    },
    include: {
      punishment: true,
    },
  });

  const allPaymentsByPlayer = await db.playerPayments.findMany({
    where: {
      playerId: player.id,
    },
  });

  const mostCommonPunishmentGrouped = await getMostCommonPunishment(player);
  const allPunishments = await db.punishment.findMany();
  const beerPunishments = await getPunishmentsByPlayer(player, "BEER");
  const moneyPunishments = await getPunishmentsByPlayer(player, "MONEY");
  const payments = await db.playerPayments.groupBy({
    by: ["type"],
    _sum: {
      amount: true,
    },
  });

  const beerPayments =
    payments.filter((payment) => payment.type === "BEER")[0]._sum.amount ?? 0;
  const moneyPayments =
    payments.filter((payment) => payment.type === "MONEY")[0]._sum.amount ?? 0;

  let beerCosts = getTotalCostFromPunishments(beerPunishments, allPunishments);
  let moneyCosts = getTotalCostFromPunishments(
    moneyPunishments,
    allPunishments
  );

  const mostCommonPunishment = {
    amount: mostCommonPunishmentGrouped[0]._max.amount,
    punishment: allPunishments.filter(
      (punishment) =>
        punishment.id === mostCommonPunishmentGrouped[0].punishmentId
    )[0],
  };

  return {
    openBeerPunishments: beerCosts - beerPayments,
    openMoneyPunishments: moneyCosts - moneyPayments,
    mostCommonPunishment,
    player,
    allPunishmentsByPlayer,
    allPaymentsByPlayer,
  };
}

export type GetPlayerDetailsType = Awaited<ReturnType<typeof getPlayerDetails>>;

async function getPunishmentsByPlayer(
  player: Player | null,
  type: PunishmentType
) {
  if (player) {
    return await db.playerPunishments.groupBy({
      by: ["punishmentId"],
      where: {
        playerId: player.id,
        punishment: {
          type: type,
        },
      },
      _sum: {
        amount: true,
      },
    });
  }

  return [];
}

type GroupedPunishments = Prisma.PromiseReturnType<
  typeof getPunishmentsByPlayer
>;

async function getMostCommonPunishment(player: Player | null) {
  return await db.playerPunishments.groupBy({
    by: ["punishmentId"],
    where: {
      playerId: player?.id,
    },
    _max: {
      amount: true,
    },
  });
}

function getTotalCostFromPunishments(
  playerPunishments: GroupedPunishments,
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
