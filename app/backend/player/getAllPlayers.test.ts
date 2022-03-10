import { clearDatabase } from "../../../tests/utils";
import {
  getAllConnectedPlayers,
  getAllPlayers,
  getAllUnconnectedPlayers,
} from "~/backend/player/getAllPlayers";
import { userFactory } from "../../../tests/factories/userFactory";
import { playerFactory } from "../../../tests/factories/playerFactory";

beforeEach(async () => {
  for (let i = 0; i < 5; i++) {
    const { id: userId } = await userFactory();

    await playerFactory(userId);
  }

  for (let i = 0; i < 5; i++) {
    await playerFactory();
  }
});

afterEach(() => {
  return clearDatabase();
});

describe("get the correct number of players", () => {
  it("should return the number of all players", async () => {
    const { players } = await getAllPlayers();
    expect(players.length).toBe(10);
  });

  it("should return the number of all connected players", async () => {
    const { connectedPlayers } = await getAllConnectedPlayers();
    expect(connectedPlayers.length).toBe(5);
  });

  it("should return the number of all unconnected players", async () => {
    const { unconnectedPlayers } = await getAllUnconnectedPlayers();
    expect(unconnectedPlayers.length).toBe(5);
  });
});
