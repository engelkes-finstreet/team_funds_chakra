import { Outlet } from "remix";
import { TFHandle } from "~/utils/types/handle.types";
import { getPlayerName } from "~/utils/functions";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPlayer } from "~/backend/player/getPlayer";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => getPlayerName(data.player),
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPlayer(params);
};

export default function PlayersLayoutRoute() {
  return <Outlet />;
}
