import prisma from "../client";
import { Punishment, PunishmentType } from "@prisma/client";

export async function paymentFactory(
  playerId: string,
  seasonId: string,
  amount: number,
  type: PunishmentType
) {
  return prisma.playerPayments.create({
    data: {
      type,
      playerId,
      seasonId,
      paymentType: "PAYPAL",
      amount,
    },
  });
}
