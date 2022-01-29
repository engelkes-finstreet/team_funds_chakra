import { PageWrapper } from "~/components/Layout/PageWrapper";
import { ActionFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Prisma, Role } from "@prisma/client";
import { Form } from "~/components/form/Form";
import { withZod } from "@remix-validated-form/with-zod";
import * as z from "zod";
import { UserForm } from "~/components/user/UserForm";
import { validationError } from "remix-validated-form";
import { DataFunctionArgs } from "@remix-run/server-runtime";

const userValidator = withZod(
  z.object({
    role: z.nativeEnum(Role),
  })
);

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const slug = params.userSlug;
  if (!slug) {
    throw redirect("/admin/users");
  }

  const user = await db.user.findUnique({
    where: { slug },
    select: { username: true, role: true },
  });

  if (!user) {
    throw new Response("Oh Snap! Wir konnten den User nicht finden.", {
      status: 404,
    });
  }

  return { user };
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = userValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { role } = data.data;

  const user = await db.user.findUnique({
    where: { id: params.userId },
    select: { id: true },
  });

  if (!user) {
    throw new Response("Saison nicht gefunden", {
      status: 404,
    });
  }

  await db.user.update({
    where: { id: params.userId },
    data: { role },
  });

  return redirect(`/admin/users`);
};

export default function EditUserRoute() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <PageWrapper heading={`User ${data.user.username} bearbeiten`}>
      <Form
        submitText={"User bearbeiten"}
        validator={userValidator}
        method={"post"}
        defaultValues={{ role: data.user.role }}
      >
        <UserForm />
      </Form>
    </PageWrapper>
  );
}
