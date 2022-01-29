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

async function getUsers() {
  return await db.user.findMany({
    select: { id: true, username: true, role: true, slug: true },
  });
}

type LoaderData = { users: Prisma.PromiseReturnType<typeof getUsers> };

export let loader: LoaderFunction = async ({ request, params }) => {
  const users = await getUsers();

  const data: LoaderData = { users };

  return data;
};

export default function UsersIndexRoute() {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  console.log("user", data.users);

  return (
    <PageWrapper heading={"Alle User"}>
      {data.users.length > 0 ? (
        <Table variant={"striped"} colorScheme={"blue"}>
          <Thead>
            <Tr>
              <Th w={"10%"}>#</Th>
              <Th w={"90%"}>Username</Th>
              <Th>Rolle</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.users.map((user, index) => (
              <Tr
                key={user.id}
                onClick={() => {
                  navigate(`${user.slug}/edit`);
                }}
                cursor={"pointer"}
              >
                <Td>{index}</Td>
                <Td>{user.username}</Td>
                <Td>{user.role}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center>Es wurden noch keine Usesr angelegt</Center>
      )}
    </PageWrapper>
  );
}
