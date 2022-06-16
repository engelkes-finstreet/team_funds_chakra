import { ActionFunction, useLoaderData, useNavigate } from "remix";
import { db } from "~/utils/db.server";
import {
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
import { Button } from "~/components/chakra/Button";

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

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const seasons = await db.season.findMany();

  return { seasons };
};

export default function SeasonsIndexRoute() {
  const { seasons } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  return (
    <>
      {seasons.length > 0 ? (
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
            {seasons.map((season) => (
              <Tr key={season.id}>
                <Td>{season.slug}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center>
          <VStack>
            <Text>Es wurde noch keine Saison angelegt</Text>
            <Button onClick={() => navigate("/admin/seasons/new")}>
              Neue Saison erstellen
            </Button>
          </VStack>
        </Center>
      )}
    </>
  );
}
