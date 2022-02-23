import { Outlet } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getPunishmentDetails } from "~/backend/punishment/getPunishmentDetails";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader = async ({ request, params }: DataFunctionArgs) => {
  return await getPunishmentDetails(params);
};

export default function () {
  return <Outlet />;
}
