import bcrypt from "bcrypt";
import { db } from "~/utils/db.server";
import { createCookieSessionStorage, redirect } from "remix";
import { AdminUser, User } from "@prisma/client";
import { URLSearchParams } from "url";
import { IS_ADMIN, USER_ID } from "~/utils/session-keys/userSessionKeys";

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      email,
      passwordHash,
      slug: `${firstName}-${lastName}`,
      firstName,
      lastName,
    },
  });
}

export async function registerAdminUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  return db.adminUser.create({
    data: { email, passwordHash, slug: email },
  });
}

export async function loginAdminUser(email: string, password: string) {
  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin) return null;

  const isCorrectPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!isCorrectPassword || !admin.isApproved) return null;

  return admin;
}

export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return user;
}

export async function resetPassword(
  userId: string,
  oldPassword: string,
  password: string
) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const isCorrectPasswort = await bcrypt.compare(
    oldPassword,
    user.passwordHash
  );
  if (!isCorrectPasswort)
    throw new Response("Oh Snap, wrong password", { status: 401 });
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.update({
    where: { id: userId },
    data: {
      passwordHash,
    },
  });
}

export async function updateUser(
  userId: string,
  firstName: string,
  lastName: string
) {
  return db.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      slug: `${firstName}-${lastName}`,
    },
  });
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get(USER_ID);
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const session = await getUserSession(request);
  const userId = session.get(USER_ID);
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get(USER_ID);

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
}

export async function requireAndReturnAdminUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
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

  const { passwordHash, ...userWithoutPassword } = admin;
  return { admin: userWithoutPassword };
}

export type AdminWithoutPassword = Omit<AdminUser, "passwordHash">;

export async function requireAndReturnUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
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

export type UserWithoutPassword = Omit<User, "passwordHash">;
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const result = await db.user.findUnique({
      where: { id: userId },
    });

    if (result) {
      const { passwordHash, ...userWithoutPassword } = result;
      return userWithoutPassword;
    }

    return null;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  if (session.get(IS_ADMIN)) {
    return redirect("/admin/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set(USER_ID, userId);
  session.set(IS_ADMIN, false);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function createAdminSession(
  adminUserId: string,
  redirectTo: string
) {
  const session = await storage.getSession();

  session.set(USER_ID, adminUserId);
  session.set(IS_ADMIN, true);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
