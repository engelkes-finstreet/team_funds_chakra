import prisma from "../client";
import { email, firstName, lastName, password } from "minifaker";
import "minifaker/dist/cjs/locales/en";

export async function userFactory() {
  return prisma.user.create({
    data: {
      email: email(),
      passwordHash: password(),
      firstName: firstName(),
      lastName: lastName(),
      slug: email(),
    },
  });
}
