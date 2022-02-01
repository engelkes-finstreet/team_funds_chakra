import { Role, User, Prisma } from "@prisma/client";
import { LoaderFunction, useLoaderData, useNavigate } from "remix";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { db } from "~/utils/db.server";
import {
  Button,
  Center,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";
import { getRoleMapping } from "~/utils/enumMappings";

export let loader: LoaderFunction = async ({ request, params }) => {
  const users = await db.user.findMany({
    select: { id: true, username: true, role: true, slug: true },
  });

  return { users };
};

export default function UsersIndexRoute() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const navigate = useNavigate();

  return (
    <PageWrapper heading={"Alle User"}>
      {data.users.length > 0 ? (
        <Table
          variant={"striped"}
          colorScheme={"blue"}
          maxW={"full"}
          __css={{ tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th w={"90%"}>Username</Th>
              <Th>Rolle</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.users.map((user) => (
              <Tr
                key={user.id}
                onClick={() => {
                  navigate(`${user.slug}/edit`);
                }}
                cursor={"pointer"}
              >
                <Td>{user.username}</Td>
                <Td>{getRoleMapping(user.role)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center>Es wurden noch keine User angelegt</Center>
      )}
    </PageWrapper>
  );
}
