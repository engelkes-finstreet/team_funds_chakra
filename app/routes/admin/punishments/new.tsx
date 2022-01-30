import { Form } from "~/components/form/Form";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { punishmentValidator } from "~/validations/punishmentValidation";
import PunishmentForm from "~/components/punishment/PunishmentForm";
import { ActionFunction, redirect } from "remix";
import { validationError } from "remix-validated-form";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const data = punishmentValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { punishmentName, punishmentType, amount } = data.data;

  const punishment = await db.punishment.create({
    data: {
      name: punishmentName,
      type: punishmentType,
      amount: amount,
      slug: punishmentName,
      userId,
    },
  });

  const { headers } = await setFlashContent(
    request,
    `Strafe ${punishment.name} erfolgreich angelegt`,
    "success"
  );

  return redirect(`/admin/punishments/${punishment.slug}`, headers);
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
