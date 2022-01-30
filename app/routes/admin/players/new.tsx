import { ActionFunction, redirect } from "remix";
import { PageWrapper } from "~/components/Layout/PageWrapper";
import { Form } from "~/components/form/Form";
import { PlayerForm } from "~/components/player/PlayerForm";
import { playerValidator } from "~/validations/playerValidations";
import { requireUserId } from "~/utils/session.server";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import {
  commitFlashSession,
  getFlashSession,
  setFlashContent,
} from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const data = playerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { firstName, lastName, position } = data.data;

  const player = await db.player.create({
    data: {
      firstName,
      lastName,
      position,
      userId,
      slug: `${firstName}-${lastName}`,
    },
  });

  const { headers } = await setFlashContent(
    request,
    "Erfolg",
    `Spieler ${getPlayerName(player)} angelegt`,
    "success"
  );

  return redirect(`/admin/players/${player.id}`, headers);
};

export default function NewPlayerRoute() {
  return (
    <PageWrapper heading={"Neuen Spieler erstellen"}>
      <Form
        submitText={"Erstellen"}
        validator={playerValidator}
        method={"post"}
      >
        <PlayerForm />
      </Form>
    </PageWrapper>
  );
}
