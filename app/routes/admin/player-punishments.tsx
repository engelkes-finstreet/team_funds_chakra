import { Outlet } from "remix";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Spieler bestrafen",
};

export default function PlayerPunishmentsLayoutRoute() {
  return <Outlet />;
}
