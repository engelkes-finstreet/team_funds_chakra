import { createPayment } from "~/backend/payments/createPayment";
import bcrypt from "bcrypt";
import prisma from "../../../tests/client";
import { clearDatabase } from "../../../tests/utils";

beforeEach(async () => {
  const password = await bcrypt.hash("Anmeldung1.", 10);

  const adminUser = await prisma.adminUser.create({
    data: {
      email: "test@test.de",
      passwordHash: password,
      slug: "test@test.de",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "test@test.de",
      passwordHash: password,
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

  const punishment = await prisma.punishment.create({
    data: {
      adminUserId: adminUser.id,
      seasonId: season.id,
      name: "Tunnel",
      slug: "Tunnel",
      amount: 2,
      type: "MONEY",
    },
  });
});

afterEach(async () => {
  await clearDatabase();
});

it("should work", async () => {
  const player = await prisma.player.findFirst();

  if (player) {
    await createPayment({
      paymentType: "PAYPAL",
      type: "MONEY",
      amount: 8,
      playerId: player.id,
    });

    const updatedPlayer = await prisma.player.findFirst({
      include: {
        playerPayments: true,
      },
    });

    expect(updatedPlayer?.playerPayments.length).toBe(1);
  }
});
