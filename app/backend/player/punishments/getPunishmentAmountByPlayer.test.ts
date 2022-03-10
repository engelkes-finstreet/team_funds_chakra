import { Player, Season } from "@prisma/client";
import { playerFactory } from "tests/factories/playerFactory";
import { playerPunishmentFactory } from "tests/factories/playerPunishmentFactory";
import { seasonFactory } from "tests/factories/seasonFactory";
import { clearDatabase } from "tests/utils";
import { getPunishmentAmountByPlayer } from "./getPunishmentAmountByPlayer";

let player: Player;
let season: Season;

beforeAll(async () => {
  season = await seasonFactory();
  player = await playerFactory();
  for (let i = 0; i < 4; i++) {
    await playerPunishmentFactory(player.id, season.id, "MONEY");
    await playerPunishmentFactory(player.id, season.id, "BEER");
  }
});

afterAll(() => {
  return clearDatabase();
});

describe("return the correct punishment amount by type", () => {
  it("should return the correct amount for money punishments", async () => {
    const result = await getPunishmentAmountByPlayer(
      player.id,
      season.id,
      "MONEY"
    );

    expect(result.length).toBe(4);
    expect(result[0]._sum.amount).toBe(1);
  });

  it("should return the correct amount for beer punishments", async () => {
    const result = await getPunishmentAmountByPlayer(
      player.id,
      season.id,
      "BEER"
    );

    expect(result.length).toBe(4);
    expect(result[0]._sum.amount).toBe(1);
  });
});
