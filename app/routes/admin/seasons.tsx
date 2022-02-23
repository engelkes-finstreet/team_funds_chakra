import { ActionFunction, useLoaderData, useNavigate } from "remix";
import { db } from "~/utils/db.server";
import {
  Box,
  Button,
  Center,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { setFlashContent } from "~/utils/flashMessage.server";
import { TFHandle } from "~/utils/types/handle.types";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { AiOutlinePlus } from "react-icons/ai";
import { IconLinkButton } from "~/components/buttons";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => "Saison",
  actionButtons: (data) => (
    <IconLinkButton
      to={"/admin/seasons/new"}
      aria-label={"Neue Saison erstellen"}
      icon={<AiOutlinePlus />}
    />
  ),
};

const deleteValidator = withZod(
  z.object({
    _seasonId: z.string(),
    _method: z.string(),
  })
);

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const seasons = await db.season.findMany();

  return { seasons };
};

export let action: ActionFunction = async ({ request }) => {
  const data = await deleteValidator.validate(await request.formData());
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

  return (
    <>
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
    </>
  );
}
