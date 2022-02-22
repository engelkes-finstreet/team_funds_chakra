import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Bezahlen",
};

export default function PayRoute() {
  return <>Pay</>;
}
