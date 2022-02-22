import { DataFunctionArgs } from "@remix-run/server-runtime";
import { db } from "~/utils/db.server";
import { ActionFunction, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import { Prisma } from "@prisma/client";
import { setFlashContent } from "~/utils/flashMessage.server";
import { AllPunishmentsTable } from "~/components/punishment/AllPunishmentsTable";
import { deletePunishmentValidator } from "~/utils/validations/punishmentValidation";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const punishments = await db.punishment.findMany();

  return { punishments };
};

export const action: ActionFunction = async ({ request }) => {
  const data = await deletePunishmentValidator.validate(
    await request.formData()
  );
  if (data.error) return validationError(data.error);
  const { _method, _punishmentId } = data.data;

  if (_method === "delete") {
    const punishment = await db.punishment.findUnique({
      where: { id: _punishmentId },
    });

    if (!punishment) {
      throw new Response("Was nicht da ist kann nicht gelöscht werden", {
        status: 404,
      });
    }

    try {
      await db.punishment.delete({ where: { id: _punishmentId } });

      return await setFlashContent(
        "admin/punishments",
        request,
        `Strafe ${punishment.name} erfolgreich gelöscht`,
        "success"
      );
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") {
          return await setFlashContent(
            "/admin/players",
            request,
            "Strafe kann nicht gelöscht werden",
            "error",
            "Sie wurde schon einem Spieler hinzugefügt"
          );
        }
      }
    }
  }
};

export default function PunishmentsIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return <AllPunishmentsTable isAdmin={true} punishments={data.punishments} />;
}
