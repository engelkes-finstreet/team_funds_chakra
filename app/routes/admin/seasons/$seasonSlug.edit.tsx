import { PageWrapper } from "~/components/Layout/PageWrapper";
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from "remix";
import { Season } from "@prisma/client";
import { db } from "~/utils/db.server";
import { seasonValidator } from "~/validations/seasonValidations";
import { SeasonForm } from "~/components/season/SeasonForm";
import { Form } from "~/components/form/Form";
import { validationError } from "remix-validated-form";
import { setFlashContent } from "~/utils/flashMessage.server";

type LoaderData = { season: Season };
export let loader: LoaderFunction = async ({ request, params }) => {
  const season = await db.season.findUnique({
    where: { slug: params.seasonSlug },
  });

  if (!season) {
    throw new Response("Saison wurde nicht gefunden", {
      status: 404,
    });
  }
  const data: LoaderData = { season };

  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = seasonValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { timePeriod } = data.data;

  const season = await db.season.findUnique({
    where: { slug: params.seasonSlug },
  });

  if (!season) {
    throw new Response("Saison nicht gefunden", {
      status: 404,
    });
  }

  await db.season.update({
    where: { slug: params.seasonSlug },
    data: { timePeriod, slug: timePeriod },
  });

  return await setFlashContent(
    `/admin/seasons/${season.slug}`,
    request,
    `Strafe ${season.timePeriod} erfolgreich bearbeitet`,
    "success"
  );
};

export default function EditSeasonRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <PageWrapper heading={`Saison ${data.season.timePeriod} bearbeiten`}>
      <Form
        submitText={"Bearbeiten"}
        validator={seasonValidator}
        method={"post"}
        defaultValues={{ timePeriod: data.season.timePeriod }}
      >
        <SeasonForm />
      </Form>
    </PageWrapper>
  );
}
