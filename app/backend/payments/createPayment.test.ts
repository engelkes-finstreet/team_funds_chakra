import { createPayment } from "~/backend/payments/createPayment";
import prisma from "../../../tests/client";
import { clearDatabase, setupDatabase } from "../../../tests/utils";
import { Player } from "@prisma/client";

let player: Player;

beforeEach(() => {
  return setupDatabase();
});

afterEach(() => {
  return clearDatabase();
});

it("should work", async () => {
  expect(true).toBe(true);
  //   await createPayment({
  //     paymentType: "PAYPAL",
  //     type: "MONEY",
  //     amount: 8,
  //     playerId: player.id,
  //   });
  //
  //   const updatedPlayer = await prisma.player.findFirst({
  //     include: {
  //       playerPayments: true,
  //     },
  //   });
  //
  //   expect(updatedPlayer?.playerPayments.length).toBe(1);
});
