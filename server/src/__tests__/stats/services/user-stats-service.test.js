import { jest } from "@jest/globals";

const mockUserStatsModel = {
    findOne: jest.fn(),
    create: jest.fn(),
};

const mockBossService = {
    resetBoss: jest.fn(),
};

const mockNotifications = {
    success: jest.fn((msg) => ({ type: "success", message: msg })),
    error: jest.fn((msg) => ({ type: "error", message: msg })),
    info: jest.fn((msg) => ({ type: "info", message: msg })),
};

await jest.unstable_mockModule(
    "../../../stats/models/user-stats-model.js",
    () => ({
        default: mockUserStatsModel,
    })
);

await jest.unstable_mockModule(
    "../../../boss/services/boss-service.js",
    () => ({
        default: mockBossService,
    })
);

await jest.unstable_mockModule(
    "../../../shared/utils/notifications/notifications.js",
    () => mockNotifications
);

const userStatsService = (
    await import("../../../stats/services/user-stats-service.js")
).default;

describe("userStatsService", () => {
    const userId = "user123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getOrCreateStats", () => {
        it("should return existing stats if found", async () => {
            const existingStats = {
                user: userId,
                level: 5,
                xp: 150,
                hp: 100,
                maxHp: 100,
            };

            mockUserStatsModel.findOne.mockResolvedValue(existingStats);

            const result = await userStatsService.getOrCreateStats(userId);

            expect(mockUserStatsModel.findOne).toHaveBeenCalledWith({
                user: userId,
            });
            expect(mockUserStatsModel.create).not.toHaveBeenCalled();
            expect(result).toBe(existingStats);
        });

        it("should create new stats if not found", async () => {
            const newStats = {
                user: userId,
                level: 1,
                xp: 0,
                hp: 100,
                maxHp: 100,
            };

            mockUserStatsModel.findOne.mockResolvedValue(null);
            mockUserStatsModel.create.mockResolvedValue(newStats);

            const result = await userStatsService.getOrCreateStats(userId);

            expect(mockUserStatsModel.findOne).toHaveBeenCalledWith({
                user: userId,
            });
            expect(mockUserStatsModel.create).toHaveBeenCalledWith({
                user: userId,
            });
            expect(result).toBe(newStats);
        });
    });

    describe("gainExperience", () => {
        it("should add experience without leveling up", async () => {
            const stats = {
                user: userId,
                level: 1,
                xp: 50,
                hp: 100,
                maxHp: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.gainExperience(userId, 30);

            expect(stats.xp).toBe(80);
            expect(stats.level).toBe(1);
            expect(stats.save).toHaveBeenCalled();
            expect(result.stats).toBe(stats);
            expect(result.message).toBeNull();
        });

        it("should level up once when gaining enough experience", async () => {
            const stats = {
                user: userId,
                level: 1,
                xp: 50,
                hp: 80,
                maxHp: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.gainExperience(userId, 60);

            expect(stats.xp).toBe(10);
            expect(stats.level).toBe(2);
            expect(stats.hp).toBe(100);
            expect(stats.save).toHaveBeenCalled();
            expect(result.message).toEqual({
                type: "success",
                message: "Your level has increased: 2!",
            });
        });

        it("should level up multiple times", async () => {
            const stats = {
                user: userId,
                level: 2,
                xp: 150,
                hp: 50,
                maxHp: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.gainExperience(userId, 200);

            expect(stats.xp).toBe(150);
            expect(stats.level).toBe(3);
            expect(stats.hp).toBe(100);
            expect(stats.save).toHaveBeenCalled();
            expect(result.message).toEqual({
                type: "success",
                message: "Your level has increased: 3!",
            });
        });

        it("should level up multiple times with large experience gain", async () => {
            const stats = {
                user: userId,
                level: 1,
                xp: 50,
                hp: 50,
                maxHp: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.gainExperience(userId, 450);

            expect(stats.xp).toBe(200);
            expect(stats.level).toBe(3);
            expect(stats.hp).toBe(100);
            expect(stats.save).toHaveBeenCalled();
            expect(result.message).toEqual({
                type: "success",
                message: "Your level has increased: 3!",
            });
        });

        it("should create stats if they don't exist", async () => {
            const newStats = {
                user: userId,
                level: 1,
                xp: 0,
                hp: 100,
                maxHp: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(null);
            mockUserStatsModel.create.mockResolvedValue(newStats);

            const result = await userStatsService.gainExperience(userId, 50);

            expect(newStats.xp).toBe(50);
            expect(newStats.level).toBe(1);
            expect(newStats.save).toHaveBeenCalled();
        });
    });

    describe("takeDamage", () => {
        it("should reduce HP when taking damage", async () => {
            const stats = {
                user: userId,
                hp: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.takeDamage(userId, 30);

            expect(stats.hp).toBe(70);
            expect(stats.save).toHaveBeenCalled();
            expect(result.stats).toBe(stats);
            expect(result.message).toBeNull();
        });

        it("should set HP to 0 if damage exceeds current HP", async () => {
            const stats = {
                user: userId,
                hp: 50,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.takeDamage(userId, 80);

            expect(stats.hp).toBe(0);
            expect(stats.save).toHaveBeenCalled();
            expect(result.message).toEqual({
                type: "error",
                message: "Your health dropped to zero!",
            });
        });

        it("should not take damage if HP is already 0", async () => {
            const stats = {
                user: userId,
                hp: 0,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.takeDamage(userId, 30);

            expect(stats.hp).toBe(0);
            expect(stats.save).not.toHaveBeenCalled();
            expect(result.stats).toBe(stats);
            expect(result.message).toBeNull();
        });

        it("should return error message when HP drops to exactly 0", async () => {
            const stats = {
                user: userId,
                hp: 30,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            const result = await userStatsService.takeDamage(userId, 30);

            expect(stats.hp).toBe(0);
            expect(result.message).toEqual({
                type: "error",
                message: "Your health dropped to zero!",
            });
        });

        it("should create stats if they don't exist", async () => {
            const newStats = {
                user: userId,
                hp: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(null);
            mockUserStatsModel.create.mockResolvedValue(newStats);

            const result = await userStatsService.takeDamage(userId, 20);

            expect(newStats.hp).toBe(80);
            expect(newStats.save).toHaveBeenCalled();
        });
    });

    describe("resetUserStats", () => {
        it("should reset user stats to default values", async () => {
            const stats = {
                user: userId,
                level: 5,
                xp: 250,
                hp: 50,
                maxHp: 150,
                xpToNextLevel: 500,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);
            mockBossService.resetBoss.mockResolvedValue();

            const result = await userStatsService.resetUserStats(userId);

            expect(stats.xp).toBe(0);
            expect(stats.level).toBe(1);
            expect(stats.hp).toBe(100);
            expect(stats.maxHp).toBe(100);
            expect(stats.xpToNextLevel).toBe(100);
            expect(mockBossService.resetBoss).toHaveBeenCalledWith(userId);
            expect(stats.save).toHaveBeenCalled();
            expect(result.stats).toBe(stats);
            expect(result.message).toEqual({
                type: "info",
                message: "Player progress reset.",
            });
        });

        it("should create stats if they don't exist and then reset", async () => {
            const newStats = {
                user: userId,
                level: 1,
                xp: 0,
                hp: 100,
                maxHp: 100,
                xpToNextLevel: 100,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(null);
            mockUserStatsModel.create.mockResolvedValue(newStats);
            mockBossService.resetBoss.mockResolvedValue();

            const result = await userStatsService.resetUserStats(userId);

            expect(newStats.xp).toBe(0);
            expect(newStats.level).toBe(1);
            expect(newStats.hp).toBe(100);
            expect(newStats.maxHp).toBe(100);
            expect(newStats.xpToNextLevel).toBe(100);
            expect(mockBossService.resetBoss).toHaveBeenCalledWith(userId);
            expect(newStats.save).toHaveBeenCalled();
        });

        it("should handle bossService.resetBoss error gracefully", async () => {
            const stats = {
                user: userId,
                level: 3,
                xp: 150,
                hp: 80,
                maxHp: 120,
                xpToNextLevel: 300,
                save: jest.fn(),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);
            mockBossService.resetBoss.mockRejectedValue(
                new Error("Boss reset failed")
            );

            await expect(
                userStatsService.resetUserStats(userId)
            ).rejects.toThrow("Boss reset failed");

            expect(stats.save).not.toHaveBeenCalled();
        });
    });

    describe("edge cases", () => {
        it("should handle database errors in getOrCreateStats", async () => {
            mockUserStatsModel.findOne.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                userStatsService.getOrCreateStats(userId)
            ).rejects.toThrow("Database error");
        });

        it("should handle save errors in gainExperience", async () => {
            const stats = {
                user: userId,
                level: 1,
                xp: 50,
                hp: 100,
                maxHp: 100,
                save: jest.fn().mockRejectedValue(new Error("Save failed")),
            };

            mockUserStatsModel.findOne.mockResolvedValue(stats);

            await expect(
                userStatsService.gainExperience(userId, 30)
            ).rejects.toThrow("Save failed");
        });
    });
});
