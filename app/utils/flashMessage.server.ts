import { createCookieSessionStorage, redirect } from "remix";
import { getPlayerName } from "~/utils/functions";
import { AlertStatus } from "@chakra-ui/react";

export const {
  getSession: getFlashSession,
  commitSession: commitFlashSession,
  destroySession: destroyFlashSession,
} = createCookieSessionStorage({
  cookie: {
    name: "tf_flash",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const getFlashContent = async (request: Request) => {
  const session = await getFlashSession(request.headers.get("Cookie"));
  const title = session.get("title") || null;
  const description = session.get("description") || null;
  const status = session.get("status") || null;
  const header = {
    headers: {
      // only necessary with cookieSessionStorage
      "Set-Cookie": await commitFlashSession(session),
    },
  };

  return { title, description, status, header };
};

export const setFlashContent = async (
  redirectTo: string,
  request: Request,
  title: string,
  status: AlertStatus,
  description?: string
) => {
  const session = await getFlashSession(request.headers.get("Cookie"));
  session.flash("title", title);
  session.flash("description", description);
  session.flash("status", status);

  const headers = {
    headers: {
      "Set-Cookie": await commitFlashSession(session),
    },
  };

  return redirect(redirectTo, headers);
};
