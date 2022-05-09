//@ts-ignore
import bcrypt from "bcrypt";
import { db } from "~/utils/db.server";
import crypto from "crypto";
import { badRequest } from "~/utils/requests";
import { createUserSession } from "~/utils/session.server";
import { setFlashContent } from "~/utils/flashMessage.server";
import { getCurrentUser } from "~/utils/auth/session-utils.server";
import { sendConfirmationMail } from "../mail/send-confirmation-mail.server";
import { UserType } from "~/utils/enums/UserType";

type CreateUserToken = {
  userId: string;
};
async function createUserToken({ userId }: CreateUserToken) {
  const { token } = await db.confirmUserToken.create({
    data: {
      token: crypto.randomBytes(32).toString("hex"),
      userId,
      expiresAt: await new Date(
        new Date().setHours(new Date().getHours() + 24)
      ),
    },
  });

  return token;
}

type Register = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function register({
  email,
  password,
  firstName,
  lastName,
}: Register) {
  const userExists = await db.user.findFirst({
    where: { email },
  });

  if (userExists) {
    return badRequest({
      formError: `User mit der E-Mail ${email} existiert bereits`,
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      slug: `${firstName}-${lastName}`,
      firstName,
      lastName,
    },
  });

  const token = await createUserToken({ userId: user.id });
  await sendConfirmationMail({ token, to: email, userType: UserType.USER });

  return await createUserSession(user.id, "/confirm");
}

type ResendConfirmationMail = {
  email: string;
  request: Request;
};
export async function resendConfirmationMail({
  email,
  request,
}: ResendConfirmationMail) {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return null;
  }

  //check if user has existing token
  const oldToken = await db.confirmUserToken.findUnique({
    where: { userId: user.id },
  });
  if (oldToken) {
    await db.confirmUserToken.delete({ where: { userId: user.id } });
  }

  const newToken = await createUserToken({ userId: user.id });
  await sendConfirmationMail({
    token: newToken,
    to: user.email,
    userType: UserType.USER,
  });

  return setFlashContent(
    "/confirm",
    request,
    "E-Mail versendet",
    "success",
    "Weitere Bestätigungsmail verschickt"
  );
}

type ChangeConfirmationMail = {
  request: Request;
  newMail: string;
};
export async function changeConfirmationMail({
  request,
  newMail,
}: ChangeConfirmationMail) {
  const userExists = await db.user.findFirst({
    where: { email: newMail },
  });

  if (userExists) {
    return badRequest({
      formError: `User mit der E-Mail ${newMail} existiert bereits`,
    });
  }
  const user = await getCurrentUser({ request });

  const oldToken = await db.confirmUserToken.findUnique({
    where: { userId: user.id },
  });

  if (oldToken) {
    await db.confirmUserToken.delete({ where: { userId: user.id } });
  }

  const newToken = await createUserToken({ userId: user.id });
  await sendConfirmationMail({
    token: newToken,
    to: newMail,
    userType: UserType.USER,
  });
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: newMail,
    },
  });

  return setFlashContent(
    "/confirm",
    request,
    "E-Mail geändert",
    "success",
    "E-Mail geändert und Bestätigungsmail erneut verschickt"
  );
}
