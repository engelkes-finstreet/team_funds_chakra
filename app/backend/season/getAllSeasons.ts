import { db } from "~/utils/db.server";

export async function getAllSeasons() {
  const seasons = await db.season.findMany();

  return { seasons };
}

export type GetAllSeasonsType = Awaited<ReturnType<typeof getAllSeasons>>;
