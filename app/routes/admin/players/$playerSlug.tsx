import { Outlet } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPlayer } from "~/backend/player/getPlayer";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPlayer(params);
};

export default function PlayersLayoutRoute() {
  return <Outlet />;
}
