import {} from "minifaker";
import "minifaker/dist/cjs/locales/en";
import { adminUserFactory } from "./adminUserFactory";
import { punishmentFactory } from "./punishmentFactory";
import { PunishmentType } from "@prisma/client";
import prisma from "../client";

export async function playerPunishmentFactory(
  playerId: string,
  seasonId: string,
  type: PunishmentType
) {
  const { id: adminUserId } = await adminUserFactory();
  const { id: punishmentId } = await punishmentFactory(
    adminUserId,
    seasonId,
    type
  );

  return prisma.playerPunishments.create({
    data: {
      punishmentId,
      adminUserId,
      playerId,
      amount: 1,
      seasonId,
    },
  });
}
