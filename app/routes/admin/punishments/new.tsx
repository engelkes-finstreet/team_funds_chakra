import { Form } from "~/components/form/Form";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { punishmentValidator } from "~/validations/punishmentValidation";
import PunishmentForm from "~/components/punishment/PunishmentForm";
import { ActionFunction, redirect, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getAllSeasons } from "~/backend/season/getAllSeasons";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getAllSeasons();
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const data = punishmentValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { punishmentName, punishmentType, amount, seasonId } = data.data;

  const punishment = await db.punishment.create({
    data: {
      name: punishmentName,
      type: punishmentType,
      amount: amount,
      slug: punishmentName,
      userId,
      seasonId,
    },
  });

  return await setFlashContent(
    `/admin/punishments/${punishment.slug}`,
    request,
    `Strafe ${punishment.name} erfolgreich angelegt`,
    "success"
  );
};

export default function NewPunishmentRoute() {
  return (
    <PageWrapper heading={"Neue Strafe erstellen"}>
      <Form
        submitText={"Erstellen"}
        validator={punishmentValidator}
        method={"post"}
      >
        <PunishmentForm />
      </Form>
    </PageWrapper>
  );
}
