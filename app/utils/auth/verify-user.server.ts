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

  console.log({userToken})
  
  await db.user.update({
    where: {
      id: '705d5594-4c50-44d3-b378-81b650a81565',
    },
    data: {
      firstName: "Test",
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
  const adminToken = await db.confirmAdminUserToken.findUnique({
    where: { token },
  });

  if (!adminToken) {
    throw new Response("Der angegebene Token wurde nicht gefunden", {
      status: 400,
    });
  }

  const updatedAdmin = await db.adminUser.update({
    where: {
      id: adminToken.adminId,
    },
    data: {
      isConfirmed: true,
    },
  });

  if (!updatedAdmin) {
    throw new Response('Es ist ein Fehler bei der Bestätigung aufgetreten. Versuche es noch einmal', {
      status: 400
    })
  }

  await db.confirmAdminUserToken.delete({ where: { token } });

  const flashCookie = await getFlashCookie({
    request,
    title: "Account erfolgreich bestätigt",
    status: "success",
  });

  return createAdminSession(adminToken.adminId, "/admin", [flashCookie]);
}
