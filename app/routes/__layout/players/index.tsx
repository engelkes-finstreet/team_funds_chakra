import { PageWrapper } from "~/components/Layout/PageWrapper";
import { AllPlayersTable } from "~/components/player/AllPlayersTable";
import { useLoaderData } from "remix";
import {
  getAllPlayers,
  GetAllPlayersType,
} from "~/backend/player/getAllPlayers";
import { DataFunctionArgs } from "@remix-run/server-runtime";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getAllPlayers();
};

export default function PlayerIndexRouter() {
  const { players } = useLoaderData<GetAllPlayersType>();

  return (
    <PageWrapper heading={"Alle Spieler"}>
      <AllPlayersTable isAdmin={false} players={players} />
    </PageWrapper>
  );
}
