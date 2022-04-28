import { Player } from "@prisma/client";
import { UserWithoutPassword } from "./auth/session-utils.server";

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getPlayerName(player: Player | undefined | null): string {
  if (player) {
    return `${capitalize(player.firstName)} ${capitalize(player.lastName)}`;
  }

  return "";
}

export function getUserName(user: UserWithoutPassword): string {
  if (user.firstName && user.lastName) {
    return `${capitalize(user.firstName)} ${capitalize(user.lastName)}`;
  }

  return user.email;
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

export function randomInt(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

export function randomDate() {
  const startDate = new Date(2021, 5, 30).getTime();
  const endDate = new Date(2022, 6, 1).getTime();

  return new Date(startDate + Math.random() * (endDate - startDate));
}
