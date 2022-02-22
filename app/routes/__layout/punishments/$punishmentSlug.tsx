import { PunishmentStats } from "~/components/punishment/PunishmentStats";
import { Divider, Heading } from "@chakra-ui/react";
import { PunishmentsTable } from "~/components/punishment/PunishmentsTable";
import { useLoaderData } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPunishmentDetails } from "~/backend/punishment/getPunishmentDetails";
import { TFHandle } from "~/utils/types/handle.types";
import { capitalize } from "~/utils/functions";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => capitalize(data.punishment.name),
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPunishmentDetails(params);
};

export default function PunishmentDetailRoute() {
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
