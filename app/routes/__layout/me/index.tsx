import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPlayerDetails } from "~/backend/player/getPlayerDetails";
import { useLoaderData } from "remix";
import { PlayerProfilePage } from "~/components/player/PlayerProfilePage";
import { Text } from "@chakra-ui/react";
import { requireAndReturnUser } from "~/utils/auth/session-utils.server";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const user = await requireAndReturnUser({ request });

  if (user.player) {
    return await getPlayerDetails(user.player?.slug);
  }

  return undefined;
};

export default function MeIndexRoute() {
  const playerDetails = useLoaderData<LoaderData>();

  if (playerDetails) {
    return <PlayerProfilePage playerDetails={playerDetails} />;
  }

  return (
    <>
      <Text>Dieser User ist noch mit keinem Spieler verknüpft</Text>
      <Text>Sprich einen Administrator an um deinen Account zu verknüpfen</Text>
    </>
  );
}
