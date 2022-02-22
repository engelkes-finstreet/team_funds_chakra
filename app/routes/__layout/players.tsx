import { Outlet } from "remix";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Spieler",
};

export default function PlayersLayoutRoute() {
  return <Outlet />;
}
