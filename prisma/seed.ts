import {
  Player,
  PrismaClient,
  Punishment,
  PunishmentType,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { randomDate, randomInt } from "~/utils/functions";
const db = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash("Anmeldung1.", 10);

  const adminUser = await db.adminUser.create({
    data: {
      email: "test@test.de",
      passwordHash: password,
      slug: "test@test.de",
      isApproved: true,
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

  const season = await db.season.create({
    data: {
      adminUserId: adminUser.id,
      startDate: new Date(2021, 5, 30),
      endDate: new Date(2022, 6, 1),
      slug: "2021-2022",
    },
  });

  const players: Array<Player> = [];
  for (let i = 0; i < 20; i++) {
    const player = await playerFactory();
    players.push(player);
  }

  const moneyPunishments: Array<Punishment> = [];
  const beerPunishments: Array<Punishment> = [];

  for (let i = 0; i < 10; i++) {
    const moneyPunishment = await punishmentFactory(
      adminUser.id,
      season.id,
      "MONEY"
    );
    moneyPunishments.push(moneyPunishment);

    const beerPunishment = await punishmentFactory(
      adminUser.id,
      season.id,
      "BEER"
    );
    beerPunishments.push(beerPunishment);
  }

  for (let i = 0; i < 100; i++) {
    const randomPlayer = players[randomInt(19)];
    const randomMoneyPunishment = moneyPunishments[randomInt(9)];
    const randomBeerPunishment = beerPunishments[randomInt(9)];
    const createdAt = randomDate();

    await playerPunishmentFactoryWithPunishment(
      randomPlayer.id,
      season.id,
      randomMoneyPunishment.id,
      createdAt
    );

    await playerPunishmentFactoryWithPunishment(
      randomPlayer.id,
      season.id,
      randomBeerPunishment.id,
      createdAt
    );

    await paymentFactory({
      adminUserId: adminUser.id,
      playerId: randomPlayer.id,
      seasonId: season.id,
      type: randomInt(1) === 0 ? "MONEY" : "BEER",
      amount: randomInt(1) + 1,
    });
  }
}

async function adminUserFactory() {
  return db.adminUser.create({
    data: {
      email: `${randomString()}@gmail.com`,
      passwordHash: randomString(),
      slug: randomString(),
    },
  });
}

type PaymentFactoryArgs = {
  adminUserId: string;
  playerId: string;
  seasonId: string;
  amount: number;
  type: PunishmentType;
};

async function paymentFactory({
  adminUserId,
  playerId,
  seasonId,
  amount,
  type,
}: PaymentFactoryArgs) {
  return db.playerPayments.create({
    data: {
      adminUserId,
      playerId,
      seasonId,
      amount,
      type,
      paymentType: "ADMIN",
      createdAt: randomDate(),
    },
  });
}

async function playerFactory(userId?: string) {
  const { id: adminUserId } = await adminUserFactory();

  return db.player.create({
    data: {
      firstName: randomString(),
      lastName: randomString(),
      slug: randomString(),
      adminUserId,
      position: "PLAYER",
      userId,
    },
  });
}

async function punishmentFactory(
  adminUserId: string,
  seasonId: string,
  type: PunishmentType
) {
  return db.punishment.create({
    data: {
      adminUserId,
      seasonId,
      name: randomString(),
      slug: randomString(),
      amount: 1,
      type,
    },
  });
}

async function playerPunishmentFactoryWithPunishment(
  playerId: string,
  seasonId: string,
  punishmentId: string,
  createdAt: Date
) {
  const { id: adminUserId } = await adminUserFactory();

  return db.playerPunishments.create({
    data: {
      punishmentId,
      playerId,
      seasonId,
      adminUserId,
      createdAt,
      amount: randomInt(4) + 1,
    },
  });
}

function randomString() {
  return (Math.random() + 1).toString(36).substring(7);
}

seed();
