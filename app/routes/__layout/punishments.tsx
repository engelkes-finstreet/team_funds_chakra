import { Outlet } from "remix";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Strafen",
};

export default function PunishmentsLayoutRoute() {
  return <Outlet />;
}
