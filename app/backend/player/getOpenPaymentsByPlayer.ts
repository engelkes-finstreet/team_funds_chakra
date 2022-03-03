import { Punishment, PunishmentType } from "@prisma/client";
import { db } from "~/utils/db.server";

export type OpenPaymentsType = Awaited<
  ReturnType<typeof getOpenPaymentsByPlayer>
>;
type GroupedPunishmentsType = Awaited<
  ReturnType<typeof getPunishmentsByPlayer>
>;

export async function getOpenPaymentsByPlayer(
  playerId: string,
  seasonId: string,
  type: PunishmentType
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
    const totalMoneyPunishments = await getTotalCostFromPunishments(
      punishments,
      seasonId
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

async function getTotalCostFromPunishments(
  playerPunishments: GroupedPunishmentsType,
  seasonId: string
) {
  let result = 0;
  const allPunishments = await db.punishment.findMany({
    where: {
      seasonId,
    },
  });
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
