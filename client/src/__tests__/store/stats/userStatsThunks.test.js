import { fetchStats, resetStats } from "../../../store/stats/userStatsThunks";
import { StatsService } from "../../../services/statsService";

jest.mock("../../../services/statsService");

describe("stats thunks", () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchStats", () => {
        it("dispatches fulfilled action with stats data", async () => {
            const fakeData = { exp: 100, level: 2 };

            StatsService.getStats.mockResolvedValueOnce({ data: fakeData });

            const result = await fetchStats()(dispatch, getState, undefined);

            expect(StatsService.getStats).toHaveBeenCalledTimes(1);
            expect(result.payload).toEqual(fakeData);
            expect(result.type).toBe("stats/fetchStats/fulfilled");
        });
    });

    describe("resetStats", () => {
        it("dispatches fulfilled action when reset is successful", async () => {
            const fakeReset = { exp: 0, level: 1 };

            StatsService.resetStats.mockResolvedValueOnce({ data: fakeReset });

            const result = await resetStats()(dispatch, getState, undefined);

            expect(StatsService.resetStats).toHaveBeenCalledTimes(1);
            expect(result.payload).toEqual(fakeReset);
            expect(result.type).toBe("stats/reset/fulfilled");
        });

        it("dispatches rejected action on reset failure", async () => {
            StatsService.resetStats.mockImplementationOnce(() => {
                throw new Error("test failure");
            });

            const result = await resetStats()(dispatch, getState, undefined);

            expect(StatsService.resetStats).toHaveBeenCalledTimes(1);
            expect(result.payload).toBe("Failed to reset stats");
            expect(result.type).toBe("stats/reset/rejected");
        });
    });
});
