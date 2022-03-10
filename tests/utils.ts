import prisma from "./client";

/*
Creates everything that is needed in the databse.
The created player will have a punishment of 2 beers and 8EUR
 */
export async function setupDatabase() {
  const adminUser = await prisma.adminUser.create({
    data: {
      email: "test@test.de",
      passwordHash: "asdf",
      slug: "test@test.de",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "test@test.de",
      passwordHash: "asdf",
      firstName: "Patrick",
      lastName: "Engelkes",
      slug: "Patrick-Engelkes",
    },
  });

  const player = await prisma.player.create({
    data: {
      firstName: "Patrick",
      lastName: "Engelkes",
      slug: "Patrick-Engelkes",
      adminUserId: adminUser.id,
      userId: user.id,
      position: "PLAYER",
    },
  });

  const season = await prisma.season.create({
    data: {
      adminUserId: adminUser.id,
      startDate: new Date(2021, 5, 30),
      endDate: new Date(2022, 6, 1),
      slug: "2021-2022",
    },
  });

  const moneyPunishment = await prisma.punishment.create({
    data: {
      adminUserId: adminUser.id,
      seasonId: season.id,
      name: "Tunnel",
      slug: "Tunnel",
      amount: 2,
      type: "MONEY",
    },
  });

  const beerPunishment = await prisma.punishment.create({
    data: {
      adminUserId: adminUser.id,
      seasonId: season.id,
      name: "Kiste",
      slug: "Kiste",
      amount: 1,
      type: "BEER",
    },
  });

  await prisma.playerPunishments.create({
    data: {
      adminUserId: adminUser.id,
      amount: 4,
      playerId: player.id,
      punishmentId: moneyPunishment.id,
      seasonId: season.id,
    },
  });

  await prisma.playerPunishments.create({
    data: {
      adminUserId: adminUser.id,
      amount: 2,
      playerId: player.id,
      punishmentId: moneyPunishment.id,
      seasonId: season.id,
    },
  });

  return { player };
}

export async function clearDatabase() {
  const deletePayments = prisma.playerPayments.deleteMany();
  const playerPunishments = prisma.playerPunishments.deleteMany();
  const punishments = prisma.punishment.deleteMany();
  const season = prisma.season.deleteMany();
  const player = prisma.player.deleteMany();
  const user = prisma.user.deleteMany();
  const adminUser = prisma.adminUser.deleteMany();

  await prisma.$transaction([
    deletePayments,
    playerPunishments,
    punishments,
    season,
    player,
    user,
    adminUser,
  ]);

  await prisma.$disconnect();
}
