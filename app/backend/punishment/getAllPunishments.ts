import { db } from "~/utils/db.server";

export async function getAllPunishments() {
  const punishments = await db.punishment.findMany();

  return { punishments };
}

type GetAllPunishmentsBySeason = {
  seasonId: string;
};
export async function getAllPunishmentsBySeason({
  seasonId,
}: GetAllPunishmentsBySeason) {
  const punishments = await db.punishment.findMany({ where: { seasonId } });

  return { punishments };
}

export type GetAllPunishmentsType = Awaited<
  ReturnType<typeof getAllPunishments>
>;
