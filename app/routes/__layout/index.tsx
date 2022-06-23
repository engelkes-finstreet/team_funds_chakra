import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { useLoaderData } from "remix";
import { getTotalPunishmentAmountBySeason } from "~/backend/playerPunishments/getPlayerPunishments";
import { CumulativePunishmentsChart } from "~/components/chart/cumulative-punishments-chart";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({}: DataFunctionArgs) => {
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

export default function Index() {
  const { moneyPunishments, beerPunishments } = useLoaderData<LoaderData>();

  return (
    <CumulativePunishmentsChart
      moneyPunishments={moneyPunishments}
      beerPunishments={beerPunishments}
    />
  );
}
