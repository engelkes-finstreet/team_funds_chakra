import { LoaderFunction, redirect, useLoaderData } from "remix";
import { Layout } from "~/components/Layout/Layout";
import { requireAndReturnUser } from "~/utils/auth/session-utils.server";

type LoaderData = Awaited<ReturnType<typeof loader>>;
export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireAndReturnUser({ request });

  if (!user.isConfirmed) {
    return redirect("/confirm");
  }

  return { user };
};

export default function AdminRoute() {
  const { user } = useLoaderData<LoaderData>();

  return <Layout user={user} />;
}
