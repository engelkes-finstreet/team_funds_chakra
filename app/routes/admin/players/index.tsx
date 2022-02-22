import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useCatch,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "remix";
import { Player, Prisma } from "@prisma/client";
import { db } from "~/utils/db.server";
import {
  Button,
  Center,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";
import { DeletePlayer } from "~/components/player/DeletePlayer";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  getAllPlayers,
  GetAllPlayersType,
} from "~/backend/player/getAllPlayers";
import { AllPlayersTable } from "~/components/player/AllPlayersTable";
import { deletePlayerValidator } from "~/utils/validations/playerValidations";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getAllPlayers();
};

export const action: ActionFunction = async ({ request }) => {
  const data = await deletePlayerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { _method, _playerId } = data.data;

  if (_method === "delete") {
    const player = await db.player.findUnique({
      where: { id: _playerId },
    });

    if (!player) {
      throw new Response("Was nicht da ist kann nicht gelöscht werden", {
        status: 404,
      });
    }

    try {
      await db.player.delete({ where: { id: _playerId } });

      return await setFlashContent(
        "admin/players",
        request,
        `Spieler ${getPlayerName(player)} erfolgreich gelöscht`,
        "success"
      );
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") {
          return await setFlashContent(
            "/admin/players",
            request,
            "Spieler kann nicht gelöscht werden",
            "error",
            "Ihm wurden schon Strafen hinzugefügt"
          );
        }
      }
    }
  }
};

export default function PlayerIndexRoute() {
  const { players } = useLoaderData<GetAllPlayersType>();

  return (
    <PageWrapper
      heading={"Alle Spieler"}
      buttonText={"Neuen Spieler erstellen"}
      linkTo={"new"}
    >
      <AllPlayersTable isAdmin={true} players={players} />
    </PageWrapper>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return <div>This is a catch</div>;
}

export function ErrorBoundary({ error }: any) {
  return <div>This is an error</div>;
}
