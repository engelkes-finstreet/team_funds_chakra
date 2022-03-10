import { PayPalButtons } from "@paypal/react-paypal-js";
import { useFetcher } from "remix";

type Props = {
  value: string | undefined;
};

export function PayPalButton({ value }: Props) {
  const fetcher = useFetcher();
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: value ?? "0",
              },
            },
          ],
        });
      }}
      onError={(err) => {
        console.log(err);
      }}
      onApprove={(data1, actions) => {
        console.log("onApprove called");
        if (actions.order) {
          return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name;
            console.log(`Transaction completed by ${name}`);
            fetcher.submit(
              { details: JSON.stringify(details) },
              { method: "post", action: "/me/acceptPayment" }
            );
          });
        }

        return new Promise<void>(() => {});
      }}
    />
  );
}
