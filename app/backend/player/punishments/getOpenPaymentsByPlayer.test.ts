import { Player, Season } from "@prisma/client";
import { paymentFactory } from "tests/factories/paymentFactory";
import { playerFactory } from "tests/factories/playerFactory";
import { playerPunishmentFactory } from "tests/factories/playerPunishmentFactory";
import { seasonFactory } from "tests/factories/seasonFactory";
import { clearDatabase } from "tests/utils";
import { getOpenPaymentsByPlayer } from "~/backend/player/punishments/getOpenPaymentsByPlayer";

let player: Player;
let season: Season;

beforeAll(async () => {
  season = await seasonFactory();
  player = await playerFactory();
  for (let i = 0; i < 4; i++) {
    await playerPunishmentFactory(player.id, season.id, "MONEY");
    await playerPunishmentFactory(player.id, season.id, "BEER");
  }

  await paymentFactory(player.id, season.id, 2, "MONEY");
  await paymentFactory(player.id, season.id, 3, "BEER");
});

afterAll(() => {
  return clearDatabase();
});

describe("return the open amount of payments by player and type", () => {
  it("should return the correct amount for money punishments", async () => {
    const result = await getOpenPaymentsByPlayer(player.id, season.id, "MONEY");

    expect(result).toBe(2);
  });

  it("should return the correct amount for beer punishments", async () => {
    const result = await getOpenPaymentsByPlayer(player.id, season.id, "BEER");

    expect(result).toBe(1);
  });
});
