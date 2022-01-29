import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const testUser = await db.user.create({
    data: {
      username: "test@test.de",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$PdAAoqzdvzLEWmNQUzyate1muvEpxBcUipRNj7n8Go4IxVsN6KkX.",
    },
  });
}

seed();
