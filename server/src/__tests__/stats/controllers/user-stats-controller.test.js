import { jest } from "@jest/globals";

const mockUserStatsService = {
    getOrCreateStats: jest.fn(),
    resetUserStats: jest.fn(),
};

await jest.unstable_mockModule(
    "../../../stats/services/user-stats-service.js",
    () => ({
        default: mockUserStatsService,
    })
);

const userStatsController = (
    await import("../../../stats/controllers/user-stats-controller.js")
).default;

describe("userStatsController", () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: {
                id: "user123",
            },
        };

        res = {
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    describe("getStats", () => {
        it("should return user stats successfully", async () => {
            const mockStats = {
                userId: "user123",
                level: 5,
                experience: 250,
                healthPoints: 100,
            };

            mockUserStatsService.getOrCreateStats.mockResolvedValue(mockStats);

            await userStatsController.getStats(req, res, next);

            expect(mockUserStatsService.getOrCreateStats).toHaveBeenCalledWith(
                "user123"
            );
            expect(res.json).toHaveBeenCalledWith(mockStats);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with error when service throws", async () => {
            const error = new Error("Database connection failed");

            mockUserStatsService.getOrCreateStats.mockRejectedValue(error);

            await userStatsController.getStats(req, res, next);

            expect(mockUserStatsService.getOrCreateStats).toHaveBeenCalledWith(
                "user123"
            );
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("resetUserStats", () => {
        it("should reset user stats successfully", async () => {
            const mockResetResult = {
                success: true,
                message: "Stats reset successfully",
                stats: {
                    userId: "user123",
                    level: 1,
                    experience: 0,
                    healthPoints: 100,
                },
            };

            mockUserStatsService.resetUserStats.mockResolvedValue(
                mockResetResult
            );

            await userStatsController.resetUserStats(req, res, next);

            expect(mockUserStatsService.resetUserStats).toHaveBeenCalledWith(
                "user123"
            );
            expect(res.json).toHaveBeenCalledWith(mockResetResult);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with error when service throws", async () => {
            const error = new Error("Failed to reset stats");

            mockUserStatsService.resetUserStats.mockRejectedValue(error);

            await userStatsController.resetUserStats(req, res, next);

            expect(mockUserStatsService.resetUserStats).toHaveBeenCalledWith(
                "user123"
            );
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("edge cases", () => {
        it("should handle missing user id in getStats", async () => {
            req.user.id = undefined;

            await userStatsController.getStats(req, res, next);

            expect(mockUserStatsService.getOrCreateStats).toHaveBeenCalledWith(
                undefined
            );
        });

        it("should handle missing user id in resetUserStats", async () => {
            req.user.id = null;

            await userStatsController.resetUserStats(req, res, next);

            expect(mockUserStatsService.resetUserStats).toHaveBeenCalledWith(
                null
            );
        });

        it("should handle service returning null in getStats", async () => {
            mockUserStatsService.getOrCreateStats.mockResolvedValue(null);

            await userStatsController.getStats(req, res, next);

            expect(res.json).toHaveBeenCalledWith(null);
            expect(next).not.toHaveBeenCalled();
        });

        it("should handle service returning empty object in resetUserStats", async () => {
            mockUserStatsService.resetUserStats.mockResolvedValue({});

            await userStatsController.resetUserStats(req, res, next);

            expect(res.json).toHaveBeenCalledWith({});
            expect(next).not.toHaveBeenCalled();
        });
    });
});
