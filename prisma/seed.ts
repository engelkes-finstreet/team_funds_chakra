import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const db = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash("Anmeldung1.", 10);

  const adminUser = await db.adminUser.create({
    data: {
      email: "test@test.de",
      passwordHash: password,
      slug: "test@test.de",
    },
  });

  const user = await db.user.create({
    data: {
      email: "test@test.de",
      passwordHash: password,
      firstName: "Patrick",
      lastName: "Engelkes",
      slug: "Patrick-Engelkes",
    },
  });

  const player = await db.player.create({
    data: {
      firstName: "Patrick",
      lastName: "Engelkes",
      slug: "Patrick-Engelkes",
      adminUserId: adminUser.id,
      userId: user.id,
      position: "PLAYER",
    },
  });

  const season = await db.season.create({
    data: {
      adminUserId: adminUser.id,
      startDate: new Date(2021, 5, 30),
      endDate: new Date(2022, 6, 1),
      slug: "2021-2022",
    },
  });

  const punishment = await db.punishment.create({
    data: {
      adminUserId: adminUser.id,
      seasonId: season.id,
      name: "Tunnel",
      slug: "Tunnel",
      amount: 2,
      type: "MONEY",
    },
  });
}

seed();
