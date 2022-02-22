import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  getPlayerDetails,
  PlayerDetailsType,
} from "~/backend/player/getPlayerDetails";
import { useLoaderData } from "remix";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { getPlayerName } from "~/utils/functions";
import { PlayerProfilePage } from "~/components/player/PlayerProfilePage";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPlayerDetails(params.playerSlug);
};

export default function PlayerDetailsRoute() {
  const playerDetails = useLoaderData<PlayerDetailsType>();

  return (
    <PageWrapper heading={getPlayerName(playerDetails.player)}>
      <PlayerProfilePage playerDetails={playerDetails} />
    </PageWrapper>
  );
}
