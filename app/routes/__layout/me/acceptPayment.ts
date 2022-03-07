import { ActionFunction, LoaderFunction, redirect } from "remix";
import { OrderResponseBody } from "@paypal/paypal-js";
import { requireUserId } from "~/utils/session.server";
import { getPlayer } from "~/backend/player/getPlayer";
import { createPayment } from "~/backend/payments/createPayment";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const player = await getPlayer({ where: { userId } });
  const data = await request.formData();
  const detailsFormDataEntryValue = data.get("details");
  if (
    detailsFormDataEntryValue &&
    typeof detailsFormDataEntryValue === "string"
  ) {
    const details: OrderResponseBody = JSON.parse(detailsFormDataEntryValue);
    const amount = details.purchase_units[0].amount.value;
    await createPayment({
      paymentType: "PAYPAL",
      playerId: player.id,
      amount: Number(amount),
      type: "MONEY",
    });
  }

  return null;
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
