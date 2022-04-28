//@ts-ignore
import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";
import { IS_ADMIN, USER_ID } from "~/utils/session-keys/userSessionKeys";
import {
  getUserSession,
  isLoggedInUserAdmin,
} from "~/utils/auth/session-utils.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
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

export async function logout(request: Request) {
  const session = await getUserSession({ request });
  const isAdmin = await isLoggedInUserAdmin({ request });

  if (isAdmin) {
    return redirect("/admin/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function createUserSession(
  userId: string,
  redirectTo: string,
  additionalHeaders: Array<string> = []
) {
  const session = await sessionStorage.getSession();
  session.set(USER_ID, userId);
  session.set(IS_ADMIN, false);

  additionalHeaders.push(await sessionStorage.commitSession(session));

  const headers = new Headers();
  additionalHeaders.forEach((header) => {
    headers.append("Set-Cookie", header);
  });

  return redirect(redirectTo, {
    headers,
  });
}

export async function createAdminSession(
  adminUserId: string,
  redirectTo: string,
  additionalHeaders: Array<string> = []
) {
  const session = await sessionStorage.getSession();

  session.set(USER_ID, adminUserId);
  session.set(IS_ADMIN, true);

  additionalHeaders.push(await sessionStorage.commitSession(session));

  const headers = new Headers();
  additionalHeaders.forEach((header) => {
    headers.append("Set-Cookie", header);
  });

  return redirect(redirectTo, {
    headers,
  });
}
