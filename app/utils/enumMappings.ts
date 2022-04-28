import * as z from "zod";
import { Position, PunishmentType } from "@prisma/client";

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
