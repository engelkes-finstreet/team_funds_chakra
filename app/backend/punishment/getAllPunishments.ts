import { db } from "~/utils/db.server";

export async function getAllPunishments() {
  const punishments = await db.punishment.findMany();

  return { punishments };
}

export type GetAllPunishmentsType = Awaited<
  ReturnType<typeof getAllPunishments>
>;
