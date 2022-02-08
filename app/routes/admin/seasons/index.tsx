import { Season } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
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
import { validationError } from "remix-validated-form";
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

    return await setFlashContent(
      "/admin/seasons",
      request,
      `Strafe ${season.slug} erfolgreich gelöscht`,
      "success"
    );
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
          w={"full"}
          __css={{ tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th>Zeitraum</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.seasons.map((season) => (
              <Tr key={season.id}>
                <Td
                  onClick={() => navigate(`${season.slug}`)}
                  cursor={"pointer"}
                >
                  {season.slug}
                </Td>
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
