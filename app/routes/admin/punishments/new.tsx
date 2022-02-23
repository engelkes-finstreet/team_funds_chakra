import { Form } from "~/components/form/Form";
import { punishmentValidator } from "~/utils/validations/punishmentValidation";
import PunishmentForm from "~/components/punishment/PunishmentForm";
import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { requireUserId } from "~/utils/session.server";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getAllSeasons } from "~/backend/season/getAllSeasons";
import { useResetForm } from "~/hooks/useResetForm";
import { Checkbox } from "~/components/form/Checkbox";
import { TFHandle } from "~/utils/types/handle.types";
import { setFlashContent } from "~/utils/flashMessage.server";
import { db } from "~/utils/db.server";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => "Erstellen",
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getAllSeasons();
};

export const action: ActionFunction = async ({ request }) => {
  const adminUserId = await requireUserId(request);
  const data = await punishmentValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const {
    punishmentName,
    punishmentType,
    amount,
    seasonId,
    createOtherPunishment,
  } = data.data;

  const punishment = await db.punishment.create({
    data: {
      name: punishmentName,
      type: punishmentType,
      amount: amount,
      slug: punishmentName,
      adminUserId,
      seasonId,
    },
  });

  return await setFlashContent(
    createOtherPunishment ? "/admin/punishments/new" : `/admin/punishments`,
    request,
    `Strafe ${punishment.name} erfolgreich angelegt`,
    "success"
  );
};

export default function NewPunishmentRoute() {
  const { formRef, inputRef } = useResetForm();

  return (
    <>
      <Form
        submitText={"Erstellen"}
        validator={punishmentValidator}
        method={"post"}
        formRef={formRef}
        additionalSubmits={
          <Checkbox
            label={"Weitere Strafe hinzufügen"}
            name={"createOtherPunishment"}
            value={"createOtherPunishment"}
          />
        }
      >
        <PunishmentForm firstInputRef={inputRef} />
      </Form>
    </>
  );
}
