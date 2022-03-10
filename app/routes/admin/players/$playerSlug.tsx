import { Outlet } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPlayer } from "~/backend/player/getPlayer";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const player = await getPlayer({ where: { slug: params.playerSlug } });
  return { player };
};

export default function PlayersLayoutRoute() {
  return <Outlet />;
}
