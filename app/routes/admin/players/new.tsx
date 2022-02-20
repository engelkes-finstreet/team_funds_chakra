import { ActionFunction } from "remix";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { Form } from "~/components/form/Form";
import { PlayerForm } from "~/components/player/PlayerForm";
import { playerValidator } from "~/utils/validations/playerValidations";
import { requireUserId } from "~/utils/session.server";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";
import { Checkbox } from "~/components/form/Checkbox";
import { useResetForm } from "~/hooks/useResetForm";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const data = await playerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { firstName, lastName, position, createOtherPlayer } = data.data;

  const player = await db.player.create({
    data: {
      firstName,
      lastName,
      position,
      userId,
      slug: `${firstName}-${lastName}`,
    },
  });

  return await setFlashContent(
    createOtherPlayer ? "/admin/players/new" : `/admin/players/${player.slug}`,
    request,
    `Spieler ${getPlayerName(player)} erfolgreich angelegt`,
    "success"
  );
};

export default function NewPlayerRoute() {
  const { formRef, inputRef } = useResetForm();

  return (
    <PageWrapper heading={"Neuen Spieler erstellen"}>
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
    </PageWrapper>
  );
}
