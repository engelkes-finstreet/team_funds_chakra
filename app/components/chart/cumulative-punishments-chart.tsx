import { Alert, AlertIcon, useConst, useToken } from "@chakra-ui/react";
import { useMoneyChartOptions } from "~/components/chart/use-chart-options";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

type Props = {
  moneyPunishments: number[][] | undefined;
  beerPunishments: number[][] | undefined;
};

export function CumulativePunishmentsChart({
  moneyPunishments,
  beerPunishments,
}: Props) {
  const [gray200] = useToken("colors", ["gray.200"]);
  const moneyChartOptions = useMoneyChartOptions({
    moneyPunishments,
    beerPunishments,
  });

  const options = useConst<Highcharts.Options>(() => {
    const options: Highcharts.Options = {
      title: {
        text: "Kumulierte Strafen",
        style: {
          color: gray200,
        },
      },
      ...moneyChartOptions,
    };
    return options;
  });

  if (moneyPunishments || beerPunishments) {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          ...options,
        }}
      />
    );
  }

  return (
    <Alert status="info">
      <AlertIcon />
      Es gibt zur Zeit noch keine Strafen die wir anzeigen können.
    </Alert>
  );
}
