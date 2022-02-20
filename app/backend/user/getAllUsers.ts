import { db } from "~/utils/db.server";

export async function getAllUsers() {
  const users = await db.user.findMany();

  return { users };
}

export async function getAllUnconnectedUsers() {
  const unconnectedUsers = await db.user.findMany({
    where: {
      player: {
        is: null,
      },
    },
  });

  return { unconnectedUsers };
}
