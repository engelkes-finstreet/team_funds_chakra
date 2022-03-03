import { FUNDING, PayPalButtons } from "@paypal/react-paypal-js";

type Props = {
  value: string | undefined;
  isValid: boolean;
};

export function PayPalButton({ value, isValid }: Props) {
  return (
    <PayPalButtons
      disabled={!isValid}
      forceReRender={[value]}
      fundingSource={FUNDING.PAYPAL}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: `${value}`,
              },
            },
          ],
        });
      }}
      onApprove={(data1, actions) => {
        if (actions.order) {
          return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name;
            console.log(`Transaction completed by ${name}`);
          });
        }

        return new Promise<void>(() => {});
      }}
    />
  );
}
