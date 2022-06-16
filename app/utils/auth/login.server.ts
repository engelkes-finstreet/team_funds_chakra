//@ts-ignore
import bcrypt from "bcrypt";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/requests";
import { createAdminSession, createUserSession } from "~/utils/session.server";

type LoginAdminUser = {
  email: string;
  password: string;
  redirectTo: string;
};

export async function loginAdminUser({
  email,
  password,
  redirectTo,
}: LoginAdminUser) {
  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin)
    return badRequest({
      formError: `Kombination aus Benurtzername und Passwort ist falsch`,
    });

  const isCorrectPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!isCorrectPassword) {
    return badRequest({
      formError: `Kombination aus Benurtzername und Passwort ist falsch`,
    });
  }

  return createAdminSession(admin.id, redirectTo);
}

type Login = {
  email: string;
  password: string;
  redirectTo: string;
};

export async function login({ email, password, redirectTo }: Login) {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return badRequest({
      formError: `Kombination aus Benutzername und Passwort stimmt nicht überein`,
    });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return badRequest({
      formError: `Kombination aus Benutzername und Passwort stimmt nicht überein`,
    });
  }

  return createUserSession(user.id, redirectTo);
}
