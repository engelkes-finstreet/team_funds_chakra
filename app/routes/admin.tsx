import { Layout } from "~/components/Layout/Layout";
import { LoaderFunction, useLoaderData } from "remix";
import {
  getUserSession,
  requireAndReturnUser,
  UserWithoutPassword,
} from "~/utils/session.server";
import { setFlashContent } from "~/utils/flashMessage.server";

type LoaderData = { user: UserWithoutPassword };
export let loader: LoaderFunction = async ({ request, params }) => {
  const session = await getUserSession(request);
  const role = session.get("role");

  if (role !== "ADMIN") {
    throw await setFlashContent(
      "/",
      request,
      "Fehlende Berechtigung",
      "error",
      "Du musst ein Admin sein um auf diese Seite zugreifen zu dürfen"
    );
  }

  const user = await requireAndReturnUser(request);

  const data: LoaderData = { user };

  console.log("DO THIS!");
  return data;
};

export default function AdminRoute() {
  const data = useLoaderData<LoaderData>();

  return <Layout user={data.user} />;
}
