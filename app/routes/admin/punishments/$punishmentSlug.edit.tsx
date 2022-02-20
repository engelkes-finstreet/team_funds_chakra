import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { db } from "~/utils/db.server";
import { ActionFunction, redirect, useLoaderData } from "remix";
import { punishmentValidator } from "~/utils/validations/punishmentValidation";
import { validationError } from "remix-validated-form";
import { Form } from "~/components/form/Form";
import PunishmentForm from "~/components/punishment/PunishmentForm";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const punishment = await db.punishment.findUnique({
    where: { slug: params.punishmentSlug },
  });

  if (!punishment) {
    throw new Response("Strafe wurde nicht gefunden", { status: 404 });
  }

  return { punishment };
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = await punishmentValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { amount, punishmentType, punishmentName } = data.data;

  const punishment = await db.punishment.findUnique({
    where: { slug: params.punishmentSlug },
  });

  if (!punishment) {
    throw new Response("Strafe wurde nicht gefunden", { status: 404 });
  }

  await db.punishment.update({
    where: { slug: params.punishmentSlug },
    data: {
      name: punishmentName,
      amount,
      type: punishmentType,
      slug: punishmentName,
    },
  });

  return await setFlashContent(
    `/admin/punishments/${punishment.slug}`,
    request,
    `Strafe ${punishment.name} erfolgreich bearbeitet`,
    "success"
  );
};

export default function EditPunishmentRoute() {
  const {
    punishment: { name, amount, type },
  } = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <PageWrapper heading={"Strafe bearbeiten"}>
      <Form
        method={"post"}
        validator={punishmentValidator}
        submitText={"Bearbeiten"}
        defaultValues={{
          amount,
          punishmentName: name,
          punishmentType: type,
        }}
      >
        <PunishmentForm />
      </Form>
    </PageWrapper>
  );
}
