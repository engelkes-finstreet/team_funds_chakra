import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { getTotalPunishmentAmountBySeason } from "~/backend/playerPunishments/getPlayerPunishments";
import { useLoaderData } from "remix";
import { CumulativePunishmentsChart } from "~/components/chart/cumulative-punishments-chart";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const season = await getCurrentSeason();

  const moneyPunishments = await getTotalPunishmentAmountBySeason({
    seasonId: season.id,
    type: "MONEY",
  });

  const beerPunishments = await getTotalPunishmentAmountBySeason({
    seasonId: season.id,
    type: "BEER",
  });

  return {
    moneyPunishments,
    beerPunishments,
  };
};

export default function AdminIndexPage() {
  const { moneyPunishments, beerPunishments } = useLoaderData<LoaderData>();

  return (
    <CumulativePunishmentsChart
      moneyPunishments={moneyPunishments}
      beerPunishments={beerPunishments}
    />
  );
}
