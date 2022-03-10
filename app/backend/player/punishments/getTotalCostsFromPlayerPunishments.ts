import { db } from "~/utils/db.server";
import {
  getPunishmentAmountByPlayer,
  PunishmentAmountByPlayer,
} from "~/backend/player/punishments/getPunishmentAmountByPlayer";
import { PunishmentType } from "@prisma/client";

/**
 * Calculates the total costs for a player occurred in the given season
 * @param playerId - player who received the punishments
 * @param seasonId - season in which the punishments incurred
 *  @param type - type of punishment
 * @return total costs for the player
 */
export async function getTotalCostsFromPlayerPunishments(
  playerId: string,
  seasonId: string,
  type: PunishmentType
): Promise<number> {
  const playerPunishments = await getPunishmentAmountByPlayer(
    playerId,
    seasonId,
    type
  );

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
