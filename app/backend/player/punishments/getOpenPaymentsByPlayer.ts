import { Punishment, PunishmentType } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getTotalCostsFromPlayerPunishments } from "~/backend/player/punishments/getTotalCostsFromPlayerPunishments";

export type OpenPaymentsType = Awaited<
  ReturnType<typeof getOpenPaymentsByPlayer>
>;

/**
 *
 * @param playerId - player who received the punishments
 * @param seasonId - season in which the punishments incurred
 * @param type - type of punishment
 * @return all open payments for player in the given season
 */
export async function getOpenPaymentsByPlayer(
  playerId: string,
  seasonId: string,
  type: PunishmentType
): Promise<number | undefined> {
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
    const totalMoneyPunishments = await getTotalCostsFromPlayerPunishments(
      playerId,
      seasonId,
      type
    );
    return totalMoneyPunishments - (payments._sum.amount ?? 0);
  }

  return undefined;
}
