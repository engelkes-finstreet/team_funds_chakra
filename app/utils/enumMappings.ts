import * as z from "zod";
import { Position, PunishmentType, Role } from "@prisma/client";

export const RoleEnum = z.nativeEnum(Role);
export type RoleType = z.infer<typeof RoleEnum>;

const roleMapping: Record<RoleType, string> = {
  ADMIN: "Admin",
  USER: "User",
};

export function getRoleMapping(role: RoleType) {
  return roleMapping[role];
}

export const PositionEnum = z.nativeEnum(Position);
export type PositionType = z.infer<typeof PositionEnum>;

const positionMapping: Record<PositionType, string> = {
  PLAYER: "Spieler",
  ASSISTANT: "Betreuer",
  COACH: "Trainer",
};

export function getPositionMapping(position: PositionType) {
  return positionMapping[position];
}

export const PunishmentTypeEnum = z.nativeEnum(PunishmentType);
export type ZodPunishmentType = z.infer<typeof PunishmentTypeEnum>;

const punishmentTypeMapping: Record<ZodPunishmentType, string> = {
  BEER: "Bier",
  MONEY: "Geld",
};
export function getPunishmentTypeMapping(punishmentType: ZodPunishmentType) {
  return punishmentTypeMapping[punishmentType];
}
