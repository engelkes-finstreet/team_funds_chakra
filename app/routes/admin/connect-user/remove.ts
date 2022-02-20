import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";

const removeValidator = withZod(
  z.object({
    playerId: z.string(),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const data = await removeValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { playerId } = data.data;

  await db.player.update({
    where: {
      id: playerId,
    },
    data: {
      userId: null,
    },
  });

  return await setFlashContent(
    `/admin/connect-user`,
    request,
    `User und Spieler erfolgreich getrennt`,
    "success"
  );
};
