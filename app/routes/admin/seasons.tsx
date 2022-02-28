import { Outlet } from "remix";
import { TFHandle } from "~/utils/types/handle.types";

export const handle: TFHandle<any> = {
  breadcrumb: (data) => "Saisons",
};

export default function () {
  return <Outlet />;
}
