import HighchartsReact from "highcharts-react-official";
import Highcharts, { dateFormat } from "highcharts";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { db } from "~/utils/db.server";
import { getCurrentSeason } from "~/backend/season/getCurrentSeason";
import { useLoaderData } from "remix";
import { useConst, useToken } from "@chakra-ui/react";
import { formatCurrency } from "~/utils/functions";
import { getTotalPunishmentAmountBySeason } from "~/backend/playerPunishments/getPlayerPunishments";

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

export default function Index() {
  const { moneyPunishments, beerPunishments } = useLoaderData<LoaderData>();
  const [gray200, gray700] = useToken("colors", ["gray.200", "gray.700"]);

  const moneyData = moneyPunishments.map((date) => {
    return [new Date(date[0]).getTime(), date[1]];
  });

  const beerData = beerPunishments.map((date) => {
    return [new Date(date[0]).getTime(), date[1]];
  });

  const options = useConst<Highcharts.Options>(() => {
    const options: Highcharts.Options = {
      chart: {
        backgroundColor: gray700,
      },
      title: {
        text: "Kumulierte Strafen",
        style: {
          color: gray200,
        },
      },
      series: [
        {
          data: moneyData,
          name: "Geldstrafen",
        },
        {
          data: beerData,
          name: "Bierstrafen",
        },
      ],
      xAxis: {
        type: "datetime",
        labels: {
          format: "{value:%Y-%m-%d}",
          style: {
            color: gray200,
          },
        },
      },
      yAxis: {
        title: {
          text: "Strafen in EUR",
          style: {
            color: gray200,
          },
        },
        labels: {
          formatter: (ctx) => {
            return formatCurrency(Number(ctx.value));
          },
          style: {
            color: gray200,
          },
        },
      },
      legend: {
        itemStyle: {
          font: "9pt Trebuchet MS, Verdana, sans-serif",
          color: gray200,
        },
        itemHoverStyle: {
          color: "gray",
        },
      },
    };
    return options;
  });

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        ...options,
      }}
    />
  );
}
