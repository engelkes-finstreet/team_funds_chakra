import { ActionFunction, redirect } from "remix";
import { Form } from "~/components/form/Form";
import { PlayerForm } from "~/components/player/PlayerForm";
import { playerValidator } from "~/utils/validations/playerValidations";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";
import { Checkbox } from "~/components/form/Checkbox";
import { useResetForm } from "~/hooks/useResetForm";
import { TFHandle } from "~/utils/types/handle.types";
import { getUserId } from "~/utils/auth/session-utils.server";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Erstellen",
};

export const action: ActionFunction = async ({ request }) => {
  const adminUserId = await getUserId({ request });
  const data = await playerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { firstName, lastName, position, createOtherPlayer } = data.data;

  const player = await db.player.create({
    data: {
      firstName,
      lastName,
      position,
      adminUserId,
      slug: `${firstName}-${lastName}`,
    },
  });

  return await setFlashContent(
    createOtherPlayer ? "/admin/players/new" : `/admin/players`,
    request,
    `Spieler ${getPlayerName(player)} erfolgreich angelegt`,
    "success"
  );
};

export default function NewPlayerRoute() {
  const { formRef, inputRef } = useResetForm();

  return (
    <Form
      submitText={"Erstellen"}
      validator={playerValidator}
      method={"post"}
      formRef={formRef}
      additionalSubmits={
        <Checkbox
          label={"Weiteren Spieler hinzufügen"}
          name={"createOtherPlayer"}
          value={"createOtherPlayer"}
        />
      }
    >
      <PlayerForm firstInputRef={inputRef} />
    </Form>
  );
}
