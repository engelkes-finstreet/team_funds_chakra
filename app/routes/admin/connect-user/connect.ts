import { ActionFunction } from "remix";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";

export const action: ActionFunction = async ({ request }) => {
  const data = await connectValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { userId, playerId } = data.data;

  await db.player.update({
    where: {
      id: playerId,
    },
    data: {
      userId,
    },
  });

  return await setFlashContent(
    `/admin/connect-user`,
    request,
    `User und Spieler erfolgreich verbunden`,
    "success"
  );
};

const connectValidator = withZod(
  z.object({
    playerId: z.string(),
    userId: z.string(),
  })
);
