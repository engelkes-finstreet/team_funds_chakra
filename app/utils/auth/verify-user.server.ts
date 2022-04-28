import { Params } from "react-router";
import { db } from "~/utils/db.server";
import { getFlashCookie } from "~/utils/flashMessage.server";
import { createAdminSession, createUserSession } from "~/utils/session.server";

type VerifyUser = {
  request: Request;
  token?: string;
};

export async function verifyUser({ request, token }: VerifyUser) {
  const userToken = await db.confirmUserToken.findUnique({ where: { token } });
  if (!userToken) {
    throw new Response("Der angegebene Token wurde nicht gefunden", {
      status: 400,
    });
  }

  await db.user.update({
    where: {
      id: userToken.userId,
    },
    data: {
      isConfirmed: true,
    },
  });

  await db.confirmUserToken.delete({ where: { token } });

  const flashCookie = await getFlashCookie({
    request,
    title: "Account erfolgreich bestätigt",
    status: "success",
  });

  return createUserSession(userToken.userId, "/", [flashCookie]);
}

export async function verifyAdminUser({ request, token }: VerifyUser) {
  console.log({ token });
  const adminToken = await db.confirmAdminUserToken.findUnique({
    where: { token },
  });
  if (!adminToken) {
    throw new Response("Der angegebene Token wurde nicht gefunden", {
      status: 400,
    });
  }

  await db.adminUser.update({
    where: {
      id: adminToken.adminId,
    },
    data: {
      isConfirmed: true,
    },
  });

  await db.confirmAdminUserToken.delete({ where: { token } });

  const flashCookie = await getFlashCookie({
    request,
    title: "Account erfolgreich bestätigt",
    status: "success",
  });

  return createAdminSession(adminToken.adminId, "/admin", [flashCookie]);
}
