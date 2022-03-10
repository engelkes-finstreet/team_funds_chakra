import prisma from "../client";
import {
  email,
  firstName,
  lastName,
  password,
  setDefaultLocale,
} from "minifaker";
import "minifaker/dist/cjs/locales/en";
import { adminUserFactory } from "./adminUserFactory";
import { userFactory } from "./userFactory";

export async function playerFactory(userId?: string) {
  const { id: adminUserId } = await adminUserFactory();

  return prisma.player.create({
    data: {
      firstName: firstName(),
      lastName: lastName(),
      slug: email(),
      adminUserId,
      position: "PLAYER",
      userId,
    },
  });
}
