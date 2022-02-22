import { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import { Divider, Heading } from "@chakra-ui/react";
import { PunishmentsTable } from "~/components/punishment/PunishmentsTable";
import { getPunishmentDetails } from "~/backend/punishment/getPunishmentDetails";
import { PunishmentStats } from "~/components/punishment/PunishmentStats";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPunishmentDetails(params);
};

export default function PunishmentRoute() {
  const { punishment } = useLoaderData<LoaderData>();

  return (
    <>
      <PunishmentStats />
      <Heading size={"md"} mb={4}>
        Historie
      </Heading>
      <Divider mb={6} />
      <PunishmentsTable />
    </>
  );
}
