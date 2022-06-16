//@ts-ignore
import bcrypt from "bcrypt";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/requests";
import {json, redirect} from "remix";
import crypto from "crypto";
import { sendConfirmationMail } from "../mail/send-confirmation-mail.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getCurrentAdminUser } from "~/utils/auth/session-utils.server";
import { UserType } from "~/utils/enums/UserType";
import {createAdminSession} from "~/utils/session.server";

type RegisterAdminUser = {
  email: string;
  password: string;
  request: Request;
};

type CreateAdminUserToken = {
  adminId: string;
};
async function createAdminUserToken({ adminId }: CreateAdminUserToken) {
  const { token } = await db.confirmAdminUserToken.create({
    data: {
      token: crypto.randomBytes(32).toString("hex"),
      adminId,
      expiresAt: await new Date(new Date().getHours() + 24),
    },
  });

  return token;
}

type ResendAdminConfirmationMail = {
  email: string;
  request: Request;
};
export async function resendAdminConfirmationMail({
  email,
  request,
}: ResendAdminConfirmationMail) {
  const admin = await db.adminUser.findUnique({ where: { email } });

  if (!admin) {
    return null;
  }

  //check if user has existing token
  const oldToken = await db.confirmAdminUserToken.findUnique({
    where: { adminId: admin.id },
  });
  if (oldToken) {
    await db.confirmAdminUserToken.delete({ where: { adminId: admin.id } });
  }

  const newToken = await createAdminUserToken({ adminId: admin.id });
  await sendConfirmationMail({
    token: newToken,
    to: admin.email,
    userType: UserType.ADMIN,
    request,
  });

  return setFlashContent(
    "/confirm-admin",
    request,
    "E-Mail versendet",
    "success",
    "Weitere Bestätigungsmail verschickt"
  );
}

type ChangeAdminConfirmationMail = {
  request: Request;
  newMail: string;
};
export async function changeAdminConfirmationMail({
  request,
  newMail,
}: ChangeAdminConfirmationMail) {
  const adminExists = await db.adminUser.findFirst({
    where: { email: newMail },
  });

  if (adminExists) {
    return badRequest({
      formError: `User mit der E-Mail ${newMail} existiert bereits`,
    });
  }
  const admin = await getCurrentAdminUser({ request });

  const oldToken = await db.confirmAdminUserToken.findUnique({
    where: { adminId: admin.id },
  });

  if (oldToken) {
    await db.confirmAdminUserToken.delete({ where: { adminId: admin.id } });
  }

  const newToken = await createAdminUserToken({ adminId: admin.id });
  await sendConfirmationMail({
    token: newToken,
    to: newMail,
    userType: UserType.ADMIN,
    request,
  });
  await db.adminUser.update({
    where: {
      id: admin.id,
    },
    data: {
      email: newMail,
    },
  });

  return setFlashContent(
    "/confirm-admin",
    request,
    "E-Mail geändert",
    "success",
    "E-Mail geändert und Bestätigungsmail erneut verschickt"
  );
}

export async function registerAdminUser({
  email,
  password,
  request,
}: RegisterAdminUser) {
  const passwordHash = await bcrypt.hash(password, 10);

  const adminExists = await db.adminUser.findFirst({
    where: { email },
  });

  if (adminExists) {
    return badRequest({
      formError: `User mit der E-Mail ${email} existiert bereits`,
    });
  }

  const admin = await db.adminUser.create({
    data: { email, passwordHash, slug: email },
  });

  if (!admin) {
    return badRequest({
      formError: `Ups, uns ist ein Fehler beim Erstellen deines Users unterlaufen`,
    });
  }

  const token = await createAdminUserToken({ adminId: admin.id });
  await sendConfirmationMail({
    token,
    to: email,
    userType: UserType.ADMIN,
    request,
  });

  return createAdminSession(admin.id, "/confirm-admin");
}
