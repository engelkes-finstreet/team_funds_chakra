import { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { getPlayerName } from "~/utils/functions";

import { getPlayerDetails } from "~/backend/player/getPlayerDetails";
import { PlayerProfilePage } from "~/components/player/PlayerProfilePage";

export type PlayerLayoutData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPlayerDetails(params.playerSlug);
};

export default function PlayerDetailRoute() {
  const playerDetails = useLoaderData<PlayerLayoutData>();

  return (
    <PageWrapper heading={getPlayerName(playerDetails.player)}>
      <PlayerProfilePage playerDetails={playerDetails} />
    </PageWrapper>
  );
}