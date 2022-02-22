import { Form } from "~/components/form/Form";
import { ActionFunction, useLoaderData } from "remix";
import { requireUserId } from "~/utils/session.server";
import { validationError } from "remix-validated-form";
import { db } from "~/utils/db.server";
import { seasonValidator } from "~/utils/validations/seasonValidations";
import { SeasonForm } from "~/components/season/SeasonForm";
import { setFlashContent } from "~/utils/flashMessage.server";
import { Prisma } from "@prisma/client";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Erstellen",
};

export const action: ActionFunction = async ({ request }) => {
  const adminUserId = await requireUserId(request);
  const data = await seasonValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { startYear } = data.data;

  try {
    const season = await db.season.create({
      data: {
        startDate: new Date(Number(startYear), 5, 30),
        endDate: new Date(2022, 6, 1),
        slug: `${startYear}-${Number(startYear) + 1}`,
        adminUserId,
      },
    });

    return await setFlashContent(
      `/admin/seasons/${season.slug}`,
      request,
      `Strafe ${season.slug} erfolgreich angelegt`,
      "success"
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return await setFlashContent(
          "/admin/seasons/new",
          request,
          "Zeitraum belegt",
          "error",
          "Es existiert schon eine Saison in diesem Zeitraum"
        );
      }
    }
  }
};

export default function NewSeasonRoute() {
  useLoaderData();
  return (
    <Form submitText={"Erstelen"} validator={seasonValidator} method={"post"}>
      <SeasonForm />
    </Form>
  );
}
