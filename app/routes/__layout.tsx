import {
  requireAndReturnUser,
  UserWithoutPassword,
} from "~/utils/session.server";
import { LoaderFunction, useLoaderData } from "remix";
import { Layout } from "~/components/Layout/Layout";

type LoaderData = { user: UserWithoutPassword };
export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireAndReturnUser(request);

  const data: LoaderData = { user };

  return data;
};

export default function AdminRoute() {
  const data = useLoaderData<LoaderData>();

  return <Layout user={data.user} />;
}
