import Highcharts from "highcharts";
import { formatCurrency } from "~/utils/functions";
import { useToken } from "@chakra-ui/react";

export const useChartOptions = (): Highcharts.Options => {
  const [gray700] = useToken("colors", ["gray.700"]);

  return {
    chart: {
      backgroundColor: gray700,
    },
  };
};

type MoneyChartOptions = {
  moneyPunishments: number[][] | undefined;
  beerPunishments: number[][] | undefined;
};

export const useMoneyChartOptions = ({
  moneyPunishments,
  beerPunishments,
}: MoneyChartOptions): Highcharts.Options => {
  const [gray200, teal500, blue500] = useToken("colors", [
    "gray.200",
    "teal.500",
    "blue.500",
  ]);
  const chartOptions = useChartOptions();

  return {
    ...chartOptions,
    series: [
      {
        //@ts-ignore
        data: moneyPunishments,
        name: "Geldstrafen",
        color: teal500,
      },
      {
        //@ts-ignore
        data: beerPunishments,
        name: "Bierstrafen",
        color: blue500,
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
};
