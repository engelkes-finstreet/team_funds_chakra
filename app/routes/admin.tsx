import { AdminLayout } from "~/components/Layout/Layout";
import { useLoaderData } from "remix";
import {
  getUserSession,
  requireAndReturnAdminUser,
} from "~/utils/session.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { IS_ADMIN } from "~/utils/session-keys/userSessionKeys";

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const session = await getUserSession(request);
  const isAdmin = session.get(IS_ADMIN);

  if (!isAdmin) {
    throw await setFlashContent(
      "/",
      request,
      "Fehlende Berechtigung",
      "error",
      "Du musst ein Admin sein um auf diese Seite zugreifen zu dürfen"
    );
  }

  return await requireAndReturnAdminUser(request);
};

export default function AdminRoute() {
  const { admin } = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return <AdminLayout admin={admin} />;
}
