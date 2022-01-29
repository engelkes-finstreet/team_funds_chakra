import { Player } from "@prisma/client";

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getPlayerName(player: Player | undefined): string {
  if (player) {
    return `${capitalize(player.firstName)} ${capitalize(player.lastName)}`;
  }

  return "";
}
