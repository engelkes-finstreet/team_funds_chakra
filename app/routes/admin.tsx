import { Layout } from "~/components/Layout/Layout";
import { LoaderFunction, useLoaderData } from "remix";
import {
  getUser,
  requireAndReturnUser,
  requireUserId,
  UserWithoutPassword,
} from "~/utils/session.server";

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
