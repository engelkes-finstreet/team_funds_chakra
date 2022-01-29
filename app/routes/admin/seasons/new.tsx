import { PageWrapper } from "~/components/Layout/PageWrapper";
import { Form } from "~/components/form/Form";
import { ActionFunction, redirect } from "remix";
import { requireUserId } from "~/utils/session.server";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { seasonValidator } from "~/validations/seasonValidations";
import { SeasonForm } from "~/components/season/SeasonForm";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const data = seasonValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { timePeriod } = data.data;

  const season = await db.season.create({
    data: { timePeriod, userId, slug: timePeriod },
  });

  return redirect(`/admin/seasons/${season.slug}`);
};

export default function NewSeasonRoute() {
  return (
    <PageWrapper heading={"Neue Saison erstellen"}>
      <Form submitText={"Erstelen"} validator={seasonValidator} method={"post"}>
        <SeasonForm />
      </Form>
    </PageWrapper>
  );
}
