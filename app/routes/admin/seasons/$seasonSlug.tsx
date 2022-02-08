import { PageWrapper } from "~/components/Layout/PageWrapper";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Season } from "@prisma/client";
import { SeasonDisplay } from "~/components/season/SeasonDisplay";

type LoaderData = { season: Season };
export let loader: LoaderFunction = async ({ request, params }) => {
  const season = await db.season.findUnique({
    where: { slug: params.seasonSlug },
  });

  if (!season) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  const data: LoaderData = { season };

  return data;
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
