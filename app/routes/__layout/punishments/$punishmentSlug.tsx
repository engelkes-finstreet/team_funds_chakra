import { PunishmentStats } from "~/components/punishment/PunishmentStats";
import { Divider, Heading } from "@chakra-ui/react";
import { PunishmentsTable } from "~/components/punishment/PunishmentsTable";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { useLoaderData } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  getPunishmentDetails,
  GetPunishmentDetailsType,
} from "~/backend/punishment/getPunishmentDetails";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPunishmentDetails(params);
};

export default function PunishmentDetailRoute() {
  const { punishment } = useLoaderData<GetPunishmentDetailsType>();

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
