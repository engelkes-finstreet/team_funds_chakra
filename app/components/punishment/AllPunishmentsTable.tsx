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
import { getPunishmentTypeMapping } from "~/utils/enumMappings";
import { useFetcher, useNavigate } from "remix";
import { useIsDesktop } from "~/hooks/useIsDesktop";
import { Punishment } from "@prisma/client";
import { ValidatedForm } from "remix-validated-form";
import { TextField } from "~/components/form/TextField";
import { deletePunishmentValidator } from "~/utils/validations/punishmentValidation";
import { GetAllPunishmentsType } from "~/backend/punishment/getAllPunishments";
import { Button, ButtonType } from "../chakra/Button";

type Props = {
  isAdmin: boolean;
} & GetAllPunishmentsType;

export function AllPunishmentsTable({ punishments, isAdmin }: Props) {
  const isDesktop = useIsDesktop();
  const doRender = isDesktop && isAdmin;
  const navigate = useNavigate();

  function handleClick(punishment: Punishment) {
    if (isAdmin) {
      navigate(`${punishment.slug}/edit`);
    } else {
      navigate(`${punishment.slug}`);
    }
  }

  if (punishments.length > 0) {
    return (
      <Table
        variant={"striped"}
        colorScheme={"blue"}
        w={"full"}
        __css={{ tableLayout: "fixed" }}
      >
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Menge</Th>
            <Th>Typ</Th>
            <AdminHead doRender={doRender} />
          </Tr>
        </Thead>
        <Tbody>
          {punishments.map((punishment) => (
            <Tr key={punishment.id}>
              <Td onClick={() => handleClick(punishment)} cursor={"pointer"}>
                {punishment.name}
              </Td>
              <Td onClick={() => handleClick(punishment)} cursor={"pointer"}>
                {punishment.amount}
              </Td>
              <Td onClick={() => handleClick(punishment)} cursor={"pointer"}>
                {getPunishmentTypeMapping(punishment.type)}
              </Td>
              <AdminColumns doRender={doRender} punishment={punishment} />
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }

  if (isAdmin) {
    return (
      <Center>
        <VStack>
          <Text>Es wurde noch keine Strafe angelegt</Text>
          <Button onClick={() => navigate("new")}>Neue Strafe anlegen</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Center>
      <VStack>
        <Text>Es wurden noch keine Strafen angelegt</Text>
      </VStack>
    </Center>
  );
}

type AdminHeadProps = {
  doRender: boolean | undefined;
};

function AdminHead({ doRender }: AdminHeadProps) {
  if (doRender) {
    return (
      <>
        <Th w={"20%"}>Löschen</Th>
      </>
    );
  }

  return null;
}

type AdminColumnProps = {
  doRender: boolean | undefined;
  punishment: Punishment;
};

function AdminColumns({ doRender, punishment }: AdminColumnProps) {
  const navigate = useNavigate();

  if (doRender) {
    return (
      <>
        <DeletePunishment punishmentId={punishment.id} />
      </>
    );
  }

  return null;
}

function DeletePunishment({ punishmentId }: { punishmentId: string }) {
  const fetcher = useFetcher();
  const isDeleting =
    fetcher.submission?.formData.get("_punishmentId") === punishmentId;

  return (
    <Td hidden={isDeleting} w={"20%"}>
      <ValidatedForm
        fetcher={fetcher}
        validator={deletePunishmentValidator}
        method={"post"}
        defaultValues={{
          _method: "delete",
          _punishmentId: punishmentId,
        }}
      >
        <TextField hidden={true} name={"_method"} />
        <TextField hidden={true} name={"_punishmentId"} />
        <Button type={"submit"} buttonType={ButtonType.DELETE}>
          Löschen
        </Button>
      </ValidatedForm>
    </Td>
  );
}
