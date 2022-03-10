import prisma from "../client";
import { email, password } from "minifaker";
import "minifaker/dist/cjs/locales/en";

export async function adminUserFactory() {
  return prisma.adminUser.create({
    data: {
      email: email(),
      passwordHash: password(),
      slug: email(),
    },
  });
}
