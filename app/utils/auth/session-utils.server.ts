import { IS_ADMIN, USER_ID } from "~/utils/session-keys/userSessionKeys";
import { sessionStorage } from "~/utils/session.server";
import { URLSearchParams } from "url";
import { redirect } from "remix";
import { db } from "~/utils/db.server";
import { AdminUser, User } from "@prisma/client";

export type AdminWithoutPassword = Omit<AdminUser, "passwordHash">;
export type UserWithoutPassword = Omit<User, "passwordHash">;

type IsAdmin = {
  request: Request;
};
export async function isLoggedInUserAdmin({ request }: IsAdmin) {
  const session = await getUserSession({ request });
  return session.get(IS_ADMIN);
}

type IsUserLoggedIn = {
  request: Request;
};
export async function isUserLoggedIn({ request }: IsUserLoggedIn) {
  const session = await getUserSession({ request });
  const userId = session.get(USER_ID);
  return !!userId;
}

type GetCurrentUser = {
  request: Request;
};
export async function getCurrentUser({ request }: GetCurrentUser) {
  const userId = await getUserId({ request });
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Response("Es muss ein User eingelogged sein", { status: 404 });
  }

  return user;
}

export async function getCurrentAdminUser({ request }: GetCurrentUser) {
  const userId = await getUserId({ request });
  const admin = await db.adminUser.findUnique({
    where: {
      id: userId,
    },
  });

  if (!admin) {
    throw new Response("Es muss ein User eingelogged sein", { status: 404 });
  }

  return admin;
}

type GetUserSession = {
  request: Request;
};
export function getUserSession({ request }: GetUserSession) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

type RequireAndReturnUserId = {
  request: Request;
  redirectTo?: string;
};
export async function getUserId({
  request,
  redirectTo = new URL(request.url).pathname,
}: RequireAndReturnUserId): Promise<string> {
  const session = await getUserSession({ request });
  const userId = session.get(USER_ID);
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

type RequireAndReturnAdminUser = {
  request: Request;
  redirectTo?: string;
};
export async function requireAndReturnAdminUser({
  request,
  redirectTo = new URL(request.url).pathname,
}: RequireAndReturnAdminUser) {
  const session = await getUserSession({ request });
  const userId = session.get(USER_ID);

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/admin/login?${searchParams}`);
  }

  const admin = await db.adminUser.findUnique({ where: { id: userId } });

  if (!admin) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  const { passwordHash, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
}

type RequireAndReturnUser = {
  request: Request;
  redirectTo?: string;
};
export async function requireAndReturnUser({
  request,
  redirectTo = new URL(request.url).pathname,
}: RequireAndReturnUser) {
  const session = await getUserSession({ request });
  const userId = session.get(USER_ID);

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { player: true },
  });

  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
