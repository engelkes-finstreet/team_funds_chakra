import prisma from "./client";

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
