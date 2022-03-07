import { db } from "~/utils/db.server";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { Prisma } from "@prisma/client";

type Arguments = Omit<Prisma.PlayerPaymentsUncheckedCreateInput, "seasonId">;

export async function createPayment(args: Arguments) {
  const season = await getCurrentSeason();

  await db.playerPayments.create({
    data: {
      seasonId: season.id,
      ...args,
    },
  });
}
