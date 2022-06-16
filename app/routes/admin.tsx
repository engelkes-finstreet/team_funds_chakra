import { AdminLayout } from "~/components/Layout/Layout";
import { redirect, useLoaderData } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireAndReturnAdminUser } from "~/utils/auth/session-utils.server";

type LoaderData = Awaited<ReturnType<typeof loader>>
export let loader = async ({ request, params }: DataFunctionArgs) => {
  const admin = await requireAndReturnAdminUser({ request });

  if (!admin.isConfirmed) {
    throw redirect("/confirm-admin");
  }

  if (!admin.isApproved) {
    throw redirect('/approve-admin')
  }

  return { admin };
};

export default function AdminRoute() {
  const { admin } = useLoaderData<LoaderData>();

  return <AdminLayout admin={admin} />;
}
