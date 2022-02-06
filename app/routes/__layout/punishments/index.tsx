import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { db } from "~/utils/db.server";
import { useLoaderData } from "remix";
import { AllPunishmentsTable } from "~/components/punishment/AllPunishmentsTable";

export type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const punishments = await db.punishment.findMany();

  return { punishments };
};

export default function () {
  const data = useLoaderData<LoaderData>();

  return (
    <PageWrapper heading={"Alle Strafen"}>
      <AllPunishmentsTable isAdmin={false} punishments={data.punishments} />
    </PageWrapper>
  );
}
