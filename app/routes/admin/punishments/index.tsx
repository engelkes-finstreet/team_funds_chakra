import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { db } from "~/utils/db.server";
import {
  ActionFunction,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "remix";
import * as z from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import {
  Button,
  Center,
  useBreakpointValue,
  Text,
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { Punishment } from "@prisma/client";
import { ValidatedForm } from "remix-validated-form/";
import { TextField } from "~/components/form/TextField";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPunishmentTypeMapping } from "~/utils/enumMappings";

const deleteValidator = withZod(
  z.object({
    _punishmentId: z.string(),
    _method: z.string(),
  })
);

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const punishments = await db.punishment.findMany();

  return { punishments };
};

export const action: ActionFunction = async ({ request }) => {
  const data = deleteValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { _method, _punishmentId } = data.data;

  if (_method === "delete") {
    const punishment = await db.punishment.findUnique({
      where: { id: _punishmentId },
    });

    if (!punishment) {
      throw new Response("Was nicht da ist kann nicht gelöscht werden", {
        status: 404,
      });
    }

    await db.punishment.delete({ where: { id: _punishmentId } });

    const { headers } = await setFlashContent(
      request,
      `Strafe ${punishment.name} erfolgreich gelöscht`,
      "success"
    );

    return redirect("/admin/punishments", headers);
  }
};

export default function PunishmentsIndexRoute() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  function handleClick(punishment: Punishment) {
    navigate(`${punishment.slug}`);
  }

  return (
    <PageWrapper
      heading={"Alle Strafen"}
      buttonText={"Strafe erstellen"}
      linkTo={"new"}
    >
      {data.punishments.length > 0 ? (
        <Table variant={"striped"} colorScheme={"blue"}>
          <Thead>
            <Tr>
              <Th w={"10%"}>#</Th>
              <Th w={"33%"}>Name</Th>
              <Th w={"33%"}>Menge</Th>
              <Th w={"33%"}>Typ</Th>
              {isDesktop ? (
                <>
                  <Th>Bearbeiten</Th>
                  <Th>Löschen</Th>
                </>
              ) : null}
            </Tr>
          </Thead>
          <Tbody>
            {data.punishments.map((punishment, index) => (
              <Tr key={punishment.id}>
                <Td onClick={() => handleClick(punishment)} cursor={"pointer"}>
                  {index}
                </Td>
                <Td onClick={() => handleClick(punishment)} cursor={"pointer"}>
                  {punishment.name}
                </Td>
                <Td onClick={() => handleClick(punishment)} cursor={"pointer"}>
                  {punishment.amount}
                </Td>
                <Td onClick={() => handleClick(punishment)} cursor={"pointer"}>
                  {getPunishmentTypeMapping(punishment.type)}
                </Td>
                {isDesktop ? (
                  <>
                    <Td>
                      <Button
                        onClick={() => navigate(`${punishment.slug}/edit`)}
                      >
                        Bearbeiten
                      </Button>
                    </Td>
                    <DeletePunishment punishmentId={punishment.id} />
                  </>
                ) : null}
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center>
          <VStack>
            <Text>Es wurde noch keine Strafe angelegt</Text>
            <Button as={Link} colorScheme={"blue"} to={"new"}>
              Neue Strafe anlegen
            </Button>
          </VStack>
        </Center>
      )}
    </PageWrapper>
  );
}

function DeletePunishment({ punishmentId }: { punishmentId: string }) {
  const fetcher = useFetcher();
  const isDeleting =
    fetcher.submission?.formData.get("_punishmentId") === punishmentId;

  return (
    <Td hidden={isDeleting}>
      <ValidatedForm
        fetcher={fetcher}
        validator={deleteValidator}
        method={"post"}
        defaultValues={{
          _method: "delete",
          _punishmentId: punishmentId,
        }}
      >
        <TextField hidden={true} name={"_method"} />
        <TextField hidden={true} name={"_punishmentId"} />
        <Button type={"submit"} colorScheme={"red"}>
          Löschen
        </Button>
      </ValidatedForm>
    </Td>
  );
}
