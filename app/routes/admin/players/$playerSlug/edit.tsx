import { ActionFunction, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { playerValidator } from "~/utils/validations/playerValidations";
import { validationError } from "remix-validated-form";
import { Form } from "~/components/form/Form";
import { PlayerForm } from "~/components/player/PlayerForm";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getPlayerName } from "~/utils/functions";
import { TFHandle } from "~/utils/types/handle.types";
import { getPlayer } from "~/backend/player/getPlayer";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => "Bearbeiten",
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader: LoaderFunction = async ({ request, params }) => {
  return await getPlayer(params);
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = await playerValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { firstName, lastName, position } = data.data;

  const player = await db.player.findUnique({
    where: { slug: params.playerSlug },
  });

  if (!player) {
    throw new Response("Saison nicht gefunden", { status: 404 });
  }

  await db.player.update({
    where: { slug: params.playerSlug },
    data: { firstName, lastName, position, slug: `${firstName}-${lastName}` },
  });

  return await setFlashContent(
    `/admin/players/${player.slug}`,
    request,
    `Spieler ${getPlayerName(player)} erfolgreich bearbeitet`,
    "success"
  );
};

export default function PlayerEditRoute() {
  const {
    player: { firstName, lastName, position },
  } = useLoaderData<LoaderData>();

  return (
    <Form
      submitText={"Bearbeiten"}
      validator={playerValidator}
      method={"post"}
      defaultValues={{ firstName, lastName, position }}
    >
      <PlayerForm />
    </Form>
  );
}
