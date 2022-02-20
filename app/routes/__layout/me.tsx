import { PageWrapper } from "~/components/Layout/PageWrapper";
import { DataFunctionArgs } from "@remix-run/server-runtime";

export let loader = async ({ request, params }: DataFunctionArgs) => {};

export default function MeRoute() {
  return <PageWrapper heading={"Me"}>Me Page</PageWrapper>;
}
