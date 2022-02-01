import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "remix";
import { Player } from "@prisma/client";
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
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { TextField } from "~/components/form/TextField";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";

const deleteValidator = withZod(
  z.object({
    _playerId: z.string(),
    _method: z.string(),
  })
);

type LoaderData = { players: Player[] };
export let loader: LoaderFunction = async ({ request, params }) => {
  const players = await db.player.findMany();

  const data: LoaderData = { players };

  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const data = deleteValidator.validate(await request.formData());
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

    await db.player.delete({ where: { id: _playerId } });

    const { headers } = await setFlashContent(
      request,
      `Spieler ${getPlayerName(player)} erfolgreich gelöscht`,
      "success"
    );

    return redirect("/admin/players", headers);
  }
};

export default function PlayerIndexRoute() {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  function handleClick(player: Player) {
    navigate(`${player.slug}`);
  }

  return (
    <PageWrapper
      heading={"Alle Spieler"}
      buttonText={"Neuen Spieler erstellen"}
      linkTo={"new"}
    >
      {data.players.length > 0 ? (
        <Table variant={"striped"} colorScheme={"blue"}>
          <Thead>
            <Tr>
              <Th w={"10%"}>#</Th>
              <Th w={"45%"}>Vorname</Th>
              <Th w={"45%"}>Nachname</Th>
              {isDesktop ? (
                <>
                  <Th>Bearbeiten</Th>
                  <Th>Löschen</Th>
                </>
              ) : null}
            </Tr>
          </Thead>
          <Tbody>
            {data.players.map((player, index) => (
              <Tr key={player.id}>
                <Td onClick={() => handleClick(player)} cursor={"pointer"}>
                  {index}
                </Td>
                <Td onClick={() => handleClick(player)} cursor={"pointer"}>
                  {player.firstName}
                </Td>
                <Td onClick={() => handleClick(player)} cursor={"pointer"}>
                  {player.lastName}
                </Td>
                {isDesktop ? (
                  <>
                    <Td>
                      <Button onClick={() => navigate(`${player.slug}/edit`)}>
                        Bearbeiten
                      </Button>
                    </Td>
                    <DeletePlayer playerId={player.id} />
                  </>
                ) : null}
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center>
          <VStack>
            <Text>Es wurde noch kein Spieler angelegt</Text>
            <Button colorScheme={"blue"} onClick={() => navigate("new")}>
              Neuen Spieler erstellen
            </Button>
          </VStack>
        </Center>
      )}
    </PageWrapper>
  );
}

function DeletePlayer({ playerId }: { playerId: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.submission?.formData.get("_playerId") === playerId;

  return (
    <Td hidden={isDeleting}>
      <ValidatedForm
        validator={deleteValidator}
        method={"post"}
        defaultValues={{
          _method: "delete",
          _playerId: playerId,
        }}
      >
        <TextField hidden={true} name={"_method"} />
        <TextField hidden={true} name={"_playerId"} />
        <Button type={"submit"} colorScheme={"red"}>
          Löschen
        </Button>
      </ValidatedForm>
    </Td>
  );
}
