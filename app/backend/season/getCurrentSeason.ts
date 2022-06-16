import { db } from "~/utils/db.server";

export async function getCurrentSeason() {
  const now = new Date();
  const seasons = await db.season.findMany({
    where: {
      startDate: {
        lt: now,
      },
      endDate: {
        gt: now,
      },
    },
  });

  if (seasons.length > 0) {
    return seasons[0];
  }

  throw new Response("Eine Season muss vorhanden sein", { status: 404 });
}
