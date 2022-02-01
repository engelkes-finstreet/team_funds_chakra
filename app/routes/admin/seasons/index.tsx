import { Season } from "@prisma/client";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "remix";
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
import * as React from "react";
import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { TextField } from "~/components/form/TextField";
import { setFlashContent } from "~/utils/flashMessage.server";

const deleteValidator = withZod(
  z.object({
    _seasonId: z.string(),
    _method: z.string(),
  })
);

type LoaderData = { seasons: Season[] };
export let loader: LoaderFunction = async ({ request, params }) => {
  const seasons = await db.season.findMany();

  const data: LoaderData = { seasons };

  return data;
};

export let action: ActionFunction = async ({ request }) => {
  const data = deleteValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { _method, _seasonId } = data.data;

  if (_method === "delete") {
    const season = await db.season.findUnique({
      where: { id: _seasonId },
    });

    if (!season) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }

    await db.season.delete({ where: { id: _seasonId } });

    const { headers } = await setFlashContent(
      request,
      `Strafe ${season.timePeriod} erfolgreich gelöscht`,
      "success"
    );

    return redirect("/admin/seasons", headers);
  }
};

export default function SeasonsIndexRoute() {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <PageWrapper
      heading={"Alle Saisons"}
      buttonText={"Neue Saison erstellen"}
      linkTo={"new"}
    >
      {data.seasons.length > 0 ? (
        <Table
          variant={"striped"}
          colorScheme={"blue"}
          maxW={"full"}
          __css={{ tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th w={"90%"}>Zeitraum</Th>
              {isDesktop ? (
                <>
                  <Th>Bearbeiten</Th>
                  <Th>Löschen</Th>
                </>
              ) : null}
            </Tr>
          </Thead>
          <Tbody>
            {data.seasons.map((season) => (
              <Tr key={season.id}>
                <Td
                  onClick={() => navigate(`${season.slug}`)}
                  cursor={"pointer"}
                >
                  {season.timePeriod}
                </Td>
                {isDesktop ? (
                  <>
                    <Td>
                      <Button onClick={() => navigate(`${season.slug}/edit`)}>
                        Bearbeiten
                      </Button>
                    </Td>
                    <DeleteSeason seasonId={season.id} />
                  </>
                ) : null}
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center>
          <VStack>
            <Text>Es wurde noch keine Saison angelegt</Text>
            <Button
              colorScheme={"blue"}
              onClick={() => navigate("/admin/seasons/new")}
            >
              Neue Saison erstellen
            </Button>
          </VStack>
        </Center>
      )}
    </PageWrapper>
  );
}

function DeleteSeason({ seasonId }: { seasonId: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.submission?.formData.get("_seasonId") === seasonId;

  return (
    <Td hidden={isDeleting}>
      <ValidatedForm
        validator={deleteValidator}
        method="post"
        defaultValues={{
          _method: "delete",
          _seasonId: seasonId,
        }}
      >
        <TextField hidden={true} name="_method" />
        <TextField hidden={true} name="_seasonId" />
        <Button type="submit" className="button" colorScheme={"red"}>
          Löschen
        </Button>
      </ValidatedForm>
    </Td>
  );
}
