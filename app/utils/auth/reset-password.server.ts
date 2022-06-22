//@ts-ignore
import bcrypt from "bcrypt";
import { db } from "~/utils/db.server";
import { json } from "remix";
import crypto from "crypto";
import { sendMail } from "~/utils/mail/sendMail.server";
import {
  ConfirmPasswordResetType,
  RequestResetPasswordType,
} from "~/utils/mail/types";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getConnectionString, getUserName } from "~/utils/functions";
import { createUserSession } from "~/utils/session.server";

type ResetPasswordFromSettings = {
  userId: string;
  oldPassword: string;
  password: string;
  request: Request;
};

export async function resetPasswordFromSettings({
  userId,
  oldPassword,
  password,
  request,
}: ResetPasswordFromSettings) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(
    oldPassword,
    user.passwordHash
  );
  if (!isCorrectPassword)
    throw new Response("Oh Snap, wrong password", { status: 401 });
  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: userId },
    data: {
      passwordHash,
    },
  });

  return setFlashContent(
    "/me",
    request,
    "Passwort erfolgreich zurückgesetzt",
    "success"
  );
}

type ResetPassword = {
  token: string;
  newPassword: string;
  request: Request;
};
export async function resetPassword({
  token,
  newPassword,
  request,
}: ResetPassword) {
  const resetPasswordToken = await db.resetUserPasswordToken.findUnique({
    where: { token },
  });
  if (!resetPasswordToken) {
    return json({ formInfo: "Ungültiger Reset-Token" });
  }

  const user = await db.user.findUnique({
    where: { id: resetPasswordToken.userId },
  });
  if (!user) {
    return json({ formInfo: "User existiert nicht" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: {
      id: resetPasswordToken.userId,
    },
    data: {
      passwordHash,
    },
  });

  const loginLink = `${getConnectionString({ request })}/login`;

  await sendMail<ConfirmPasswordResetType>({
    templateVars: {
      name: getUserName(user),
      loginLink,
    },
    templateFile: "confirm-password-reset.mjml",
    subject: "Passwort reset erfolgreich",
    to: user.email,
  });

  return await createUserSession(user.id, "/");
}

type RequestResetPassword = {
  email: string;
  request: Request;
};

export async function requestResetPassword({
  email,
  request,
}: RequestResetPassword) {
  const user = await db.user.findUnique({ where: { email } });

  const formInfo =
    "Falls ein Account mit der E-Mail Adresse existiert wurde ein Link zum Zurücksetzen des Passwortes an diese Adresse gesendet";

  if (!user) {
    return json({ formInfo });
  }

  const { token } = await db.resetUserPasswordToken.upsert({
    create: {
      token: crypto.randomBytes(32).toString("hex"),
      userId: user.id,
      expiresAt: await new Date(new Date().setHours(new Date().getHours() + 2)),
    },
    update: {
      expiresAt: await new Date(new Date().setHours(new Date().getHours() + 2)),
    },
    where: {
      userId: user.id,
    },
  });

  const connectionString = getConnectionString({ request });
  const requestResetPasswordLink = `${connectionString}/reset-password/${token}`;

  await sendMail<RequestResetPasswordType>({
    subject: "Passwort zurücksetzen",
    to: email,
    templateFile: "request-reset-password.mjml",
    templateVars: {
      requestResetPasswordLink,
      name: getUserName(user),
    },
  });

  return json({ formInfo });
}
