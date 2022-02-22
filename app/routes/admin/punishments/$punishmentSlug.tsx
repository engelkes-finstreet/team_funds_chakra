import { Outlet } from "remix";
import { TFHandle } from "~/utils/types/handle.types";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPunishmentDetails } from "~/backend/punishment/getPunishmentDetails";
import { capitalize } from "~/utils/functions";

export const handle: TFHandle<LoaderData> = {
  breadcrumb: (data) => capitalize(data.punishment.slug),
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPunishmentDetails(params);
};

export default function () {
  return <Outlet />;
}
