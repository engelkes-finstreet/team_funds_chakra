import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Stat } from "~/components/player/Stat";
import { getPlayerName } from "~/utils/functions";
import {
  Divider,
  Heading,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { PunishmentsTable } from "~/components/punishment/PunishmentsTable";
import { getPunishmentDetails } from "~/backend/punishment/getPunishmentDetails";
import { PunishmentStats } from "~/components/punishment/PunishmentStats";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPunishmentDetails(params);
};

export default function PunishmentRoute() {
  const { punishment } = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <PageWrapper heading={punishment.name}>
      <PunishmentStats />
      <Heading size={"md"} mb={4}>
        Historie
      </Heading>
      <Divider mb={6} />
      <PunishmentsTable />
    </PageWrapper>
  );
}
