import { Outlet } from "remix";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Bezahlung hinzufügen",
};

export default function PaymentsLayoutRoute() {
  return <Outlet />;
}
