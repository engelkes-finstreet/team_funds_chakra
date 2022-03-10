import { PunishmentType } from "@prisma/client";
import prisma from "../client";
import { name } from "minifaker";
import "minifaker/dist/cjs/locales/en";

export async function punishmentFactory(
  adminUserId: string,
  seasonId: string,
  type: PunishmentType
) {
  return prisma.punishment.create({
    data: {
      adminUserId,
      seasonId,
      name: name(),
      slug: name(),
      amount: 1,
      type,
    },
  });
}
