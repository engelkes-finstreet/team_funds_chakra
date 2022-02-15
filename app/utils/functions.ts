import { Player } from "@prisma/client";

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getPlayerName(player: Player | undefined | null): string {
  if (player) {
    return `${capitalize(player.firstName)} ${capitalize(player.lastName)}`;
  }

  return "";
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function toLocaleDate(value: string | Date) {
  return new Date(value).toLocaleDateString("de-DE");
}

export function playerNameFromSlug(slug: string) {
  return slug
    .split("-")
    .map((name) => capitalize(name))
    .join(" ");
}
