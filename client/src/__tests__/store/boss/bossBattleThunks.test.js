import { fetchBoss } from "../../../store/boss/bossBattleThunks.js";
import { BossService } from "../../../services/bossService";

jest.mock("../../../services/bossService");

describe("boss thunks", () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchBoss", () => {
        it("dispatches fulfilled action with boss data", async () => {
            const fakeBoss = { id: 1, name: "Dragon", hp: 1000 };

            BossService.getBoss.mockResolvedValueOnce({ data: fakeBoss });

            const result = await fetchBoss()(dispatch, getState, undefined);

            expect(BossService.getBoss).toHaveBeenCalledTimes(1);
            expect(result.payload).toEqual(fakeBoss);
            expect(result.type).toBe("boss/fetchBoss/fulfilled");
        });

        it("dispatches rejected action when boss is not found", async () => {
            BossService.getBoss.mockImplementationOnce(() => {
                throw new Error("Not found");
            });

            const result = await fetchBoss()(dispatch, getState, undefined);

            expect(BossService.getBoss).toHaveBeenCalledTimes(1);
            expect(result.payload).toBe("Boss not found");
            expect(result.type).toBe("boss/fetchBoss/rejected");
        });
    });
});
