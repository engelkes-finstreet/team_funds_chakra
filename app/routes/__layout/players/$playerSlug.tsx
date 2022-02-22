import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPlayerDetails } from "~/backend/player/getPlayerDetails";
import { useLoaderData } from "remix";
import { getPlayerName } from "~/utils/functions";
import { PlayerProfilePage } from "~/components/player/PlayerProfilePage";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => getPlayerName(data.player),
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPlayerDetails(params.playerSlug);
};

export default function PlayerDetailsRoute() {
  const playerDetails = useLoaderData<LoaderData>();

  return <PlayerProfilePage playerDetails={playerDetails} />;
}
