import { PunishmentType } from "@prisma/client";
import { db } from "~/utils/db.server";

export type PunishmentAmountByPlayer = Awaited<
  ReturnType<typeof getPunishmentAmountByPlayer>
>;

/**
 * Collects all punishments grouped by the given punishmentId in the current season that were inflicted
 * on the given player for the given type
 * @param playerId - player who received the punishments
 * @param seasonId - season in which the punishments incurred
 * @param type - type of punishment
 * @return an array with the punishmentId and the amount of time the punishment was inflicted
 */
export async function getPunishmentAmountByPlayer(
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
        type,
      },
    },
    _sum: {
      amount: true,
    },
  });
}
