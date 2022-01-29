import { Season } from "@prisma/client";

type Props = {
  season: Season;
};

export function SeasonDisplay({ season }: Props) {
  return <>{season.timePeriod}</>;
}
