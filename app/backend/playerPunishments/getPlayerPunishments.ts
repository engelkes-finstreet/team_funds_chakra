import { db } from "~/utils/db.server";
import { PunishmentType } from "@prisma/client";

type GetPlayerPunishmentsArgs = {
  seasonId: string;
  type: PunishmentType;
};
async function getPlayerPunishments({
  seasonId,
  type,
}: GetPlayerPunishmentsArgs) {
  return db.playerPunishments.findMany({
    where: {
      seasonId,
      punishment: {
        type,
      },
    },
    include: {
      punishment: true,
    },
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function getTotalPunishmentAmountBySeason({
  seasonId,
  type,
}: GetPlayerPunishmentsArgs) {
  const punishments = await getPlayerPunishments({ seasonId, type });
  const payments = await db.playerPayments.findMany({
    where: {
      seasonId,
      type,
    },
  });

  if (punishments.length > 0 || payments.length > 0) {
    let totalAmount = 0;
    const timeline: Array<{ date: Date; amount: number }> = [];

    punishments.forEach((playerPunishment) => {
      const amount =
        playerPunishment.amount * playerPunishment.punishment.amount;
      timeline.push({ date: playerPunishment.createdAt, amount });
    });

    payments.forEach((payment) => {
      timeline.push({ date: payment.createdAt, amount: -payment.amount });
    });

    timeline.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    return timeline.map((data) => {
      totalAmount += data.amount;
      return [new Date(data.date).getTime(), totalAmount];
    });
  }

  return undefined;
}
