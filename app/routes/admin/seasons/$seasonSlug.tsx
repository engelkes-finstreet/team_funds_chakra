import { PageWrapper } from "~/components/Layout/PageWrapper";
import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { SeasonDisplay } from "~/components/season/SeasonDisplay";
import { TFHandle } from "~/utils/types/handle.types";
import { capitalize } from "~/utils/functions";
import { DataFunctionArgs } from "@remix-run/server-runtime";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => capitalize(data.season.slug),
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const season = await db.season.findUnique({
    where: { slug: params.seasonSlug },
  });

  if (!season) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }

  return { season };
};

export default function SeasonRoute() {
  const { season } = useLoaderData<LoaderData>();

  return (
    <PageWrapper
      heading={`Saison ${season.slug}`}
      linkTo={`edit`}
      buttonText={"Bearbeiten"}
    >
      <SeasonDisplay season={season} />
    </PageWrapper>
  );
}
