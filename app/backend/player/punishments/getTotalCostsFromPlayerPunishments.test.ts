import { Player, Season } from "@prisma/client";
import { playerFactory } from "tests/factories/playerFactory";
import { playerPunishmentFactory } from "tests/factories/playerPunishmentFactory";
import { seasonFactory } from "tests/factories/seasonFactory";
import { clearDatabase } from "tests/utils";
import { getPunishmentAmountByPlayer } from "~/backend/player/punishments/getPunishmentAmountByPlayer";
import { getTotalCostsFromPlayerPunishments } from "~/backend/player/punishments/getTotalCostsFromPlayerPunishments";

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

describe("return the total costs per season for a player by type", () => {
  it("should return the correct amount for money punishments", async () => {
    const result = await getTotalCostsFromPlayerPunishments(
      player.id,
      season.id,
      "MONEY"
    );

    expect(result).toBe(4);
  });

  it("should return the correct amount for beer punishments", async () => {
    const result = await getTotalCostsFromPlayerPunishments(
      player.id,
      season.id,
      "BEER"
    );

    expect(result).toBe(4);
  });
});
