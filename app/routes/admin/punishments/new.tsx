import { Form } from "~/components/form/Form";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { punishmentValidator } from "~/validations/punishmentValidation";
import PunishmentForm from "~/components/punishment/PunishmentForm";
import { ActionFunction, redirect } from "remix";
import { validationError } from "remix-validated-form";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const data = punishmentValidator.validate(await request.formData());
  console.log({ data });
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

  console.log({ punishment });

  return redirect(`/admin/punishments/${punishment.slug}`);
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
