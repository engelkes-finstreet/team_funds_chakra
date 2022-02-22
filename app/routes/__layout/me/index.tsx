import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  getPlayerDetails,
  PlayerDetailsType,
} from "~/backend/player/getPlayerDetails";
import { requireAndReturnUser } from "~/utils/session.server";
import { useLoaderData } from "remix";
import { PlayerProfilePage } from "~/components/player/PlayerProfilePage";
import { Text } from "@chakra-ui/react";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const user = await requireAndReturnUser(request);

  if (user.player) {
    return await getPlayerDetails(user.player?.slug);
  }

  return undefined;
};

export default function MeIndexRoute() {
  const playerDetails = useLoaderData<LoaderData>();

  if (playerDetails) {
    return (
      <PageWrapper heading={"Me"}>
        <PlayerProfilePage playerDetails={playerDetails} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper heading={"me"}>
      <Text>Dieser User ist noch mit keinem Spieler verknüpft</Text>
      <Text>Sprich einen Administrator an um deinen Account zu verknüpfen</Text>
    </PageWrapper>
  );
}
