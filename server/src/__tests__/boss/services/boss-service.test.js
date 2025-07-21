import { jest } from "@jest/globals";

const mockSave = jest.fn();
const mockDeleteOne = jest.fn();

class BossModelMock {
    constructor(data) {
        this.user = data.user;
        this.rage = 0;
        this.alreadyRagedTaskIds = [];
        this.bossRageBar = 3;
        this.bossPower = 5;
        this.bossRewardExp = 100;
        this.healthPoints = 100;
        this.bossId = 1;
        this.bossName = "Test Boss";
        this.save = mockSave;
        this.deleteOne = mockDeleteOne;
    }

    static findOne = jest.fn();
}

await jest.unstable_mockModule("../../../boss/models/boss-model.js", () => ({
    __esModule: true,
    default: BossModelMock,
}));

const mockHasBossFound = jest.fn();

await jest.unstable_mockModule(
    "../../../boss/helpers/has-boss-found.js",
    () => ({
        __esModule: true,
        default: mockHasBossFound,
    })
);

await jest.unstable_mockModule("../../../boss/data/bosses.js", () => ({
    __esModule: true,
    default: [
        {
            bossId: 1,
            bossName: "Test Boss",
            bossRageBar: 3,
            bossPower: 5,
            bossRewardExp: 100,
        },
    ],
}));

await jest.unstable_mockModule(
    "../../../stats/services/user-stats-service.js",
    () => ({
        __esModule: true,
        default: {
            gainExperience: jest.fn(),
            takeDamage: jest
                .fn()
                .mockResolvedValue({ stats: {}, message: null }),
        },
    })
);

await jest.unstable_mockModule(
    "../../../boss/services/boss-progress-service.js",
    () => ({
        __esModule: true,
        default: {
            updateBossProgress: jest
                .fn()
                .mockResolvedValue({ currentAvailableBossId: 2 }),
            resetBossProgress: jest.fn(),
        },
    })
);

await jest.unstable_mockModule(
    "../../../boss/utils/update-boss-from-template.js",
    () => ({
        __esModule: true,
        default: jest.fn(),
    })
);

await jest.unstable_mockModule(
    "../../../shared/utils/validations/validate-object-id.js",
    () => ({
        __esModule: true,
        validateObjectId: jest.fn(),
    })
);

await jest.unstable_mockModule(
    "../../../shared/utils/notifications/notifications.js",
    () => ({
        __esModule: true,
        success: jest.fn((msg) => ({ type: "success", msg })),
        info: jest.fn((msg) => ({ type: "info", msg })),
        warning: jest.fn((msg) => ({ type: "warning", msg })),
    })
);

const bossService = (await import("../../../boss/services/boss-service.js"))
    .default;

describe("bossService", () => {
    const userId = "user123";
    const mockBossInstance = new BossModelMock({ user: userId });

    beforeEach(() => {
        jest.clearAllMocks();
        mockBossInstance.rage = 0;
        mockBossInstance.healthPoints = 100;
        mockBossInstance.alreadyRagedTaskIds = [];
        mockHasBossFound.mockResolvedValue(mockBossInstance);
    });

    describe("getBoss", () => {
        it("returns found boss", async () => {
            BossModelMock.findOne.mockResolvedValue(mockBossInstance);
            const result = await bossService.getBoss(userId);
            expect(result).toBe(mockBossInstance);
        });
    });

    describe("spawnBoss", () => {
        it("spawns new boss if none exists", async () => {
            BossModelMock.findOne.mockResolvedValue(null);
            const result = await bossService.spawnBoss(userId, 1);
            expect(result.boss).toBeDefined();
            expect(result.allBossesDefeated).toBe(false);
        });

        it("uses existing boss if found", async () => {
            BossModelMock.findOne.mockResolvedValue(mockBossInstance);
            const result = await bossService.spawnBoss(userId, 1);
            expect(result.boss).toBe(mockBossInstance);
            expect(mockSave).toHaveBeenCalled();
        });

        it("returns allBossesDefeated when config is missing", async () => {
            const result = await bossService.spawnBoss(userId, 999);
            expect(result.boss).toBe(null);
            expect(result.allBossesDefeated).toBe(true);
        });
    });

    describe("damageBoss", () => {
        it("kills the boss if damage >= hp", async () => {
            const boss = {
                ...mockBossInstance,
                healthPoints: 10,
                bossRewardExp: 100,
                bossId: 1,
                bossName: "Test Boss",
                save: jest.fn(),
                deleteOne: mockDeleteOne,
            };
            mockHasBossFound.mockResolvedValue(boss);

            const result = await bossService.damageBoss(userId, 10);
            expect(result.isDead).toBe(true);
            expect(result.healthPoints).toBe(0);
        });

        it("throws on invalid damage", async () => {
            await expect(bossService.damageBoss(userId, -5)).rejects.toThrow();
        });

        it("damages boss without killing", async () => {
            const boss = {
                ...mockBossInstance,
                healthPoints: 100,
                save: jest.fn(),
            };
            mockHasBossFound.mockResolvedValue(boss);

            const result = await bossService.damageBoss(userId, 5);
            expect(result.isDead).toBe(false);
            expect(result.healthPoints).toBe(95);
        });
    });

    describe("addRage", () => {
        it("throws if newTaskIds is not array", async () => {
            await expect(
                bossService.addRage(userId, "invalid")
            ).rejects.toThrow();
        });

        it("adds rage and triggers attack", async () => {
            const boss = {
                ...mockBossInstance,
                rage: 2,
                bossRageBar: 3,
                bossPower: 5,
                alreadyRagedTaskIds: [],
                save: jest.fn(),
            };
            mockHasBossFound.mockResolvedValue(boss);
            const result = await bossService.addRage(userId, ["task1"]);
            expect(result.shouldAttack).toBe(true);
            expect(result.rage).toBe(0);
        });

        it("does not add duplicate taskIds", async () => {
            const boss = {
                ...mockBossInstance,
                rage: 0,
                alreadyRagedTaskIds: ["task1"],
                save: jest.fn(),
            };
            mockHasBossFound.mockResolvedValue(boss);
            const result = await bossService.addRage(userId, ["task1"]);
            expect(result.rage).toBe(0);
            expect(result.messages.length).toBe(0);
        });

        it("includes extra message from takeDamage", async () => {
            const mockMessage = { type: "info", msg: "extra info" };
            const boss = {
                ...mockBossInstance,
                rage: 2,
                bossRageBar: 3,
                bossPower: 5,
                alreadyRagedTaskIds: [],
                save: jest.fn(),
            };
            const userStatsService = (
                await import("../../../stats/services/user-stats-service.js")
            ).default;
            userStatsService.takeDamage.mockResolvedValueOnce({
                stats: {},
                message: mockMessage,
            });

            mockHasBossFound.mockResolvedValue(boss);
            const result = await bossService.addRage(userId, ["task2"]);
            expect(result.messages).toContainEqual(mockMessage);
        });

        it("uses default empty array when newTaskIds not provided", async () => {
            const boss = {
                ...mockBossInstance,
                rage: 0,
                alreadyRagedTaskIds: [],
                save: jest.fn(),
            };
            mockHasBossFound.mockResolvedValue(boss);

            const result = await bossService.addRage(userId);

            expect(result.rage).toBe(0);
            expect(result.shouldAttack).toBe(false);
            expect(result.messages.length).toBe(0);
        });
    });

    describe("markTaskAsRaged", () => {
        it("adds new task", async () => {
            const boss = {
                ...mockBossInstance,
                alreadyRagedTaskIds: [],
                save: jest.fn(),
            };
            mockHasBossFound.mockResolvedValue(boss);
            const result = await bossService.markTaskAsRaged(userId, "task1");
            expect(result.alreadyRagedTaskIds).toContain("task1");
            expect(boss.save).toHaveBeenCalled();
        });

        it("does not add if already raged", async () => {
            const boss = {
                ...mockBossInstance,
                alreadyRagedTaskIds: ["task1"],
                save: jest.fn(),
            };
            mockHasBossFound.mockResolvedValue(boss);
            const result = await bossService.markTaskAsRaged(userId, "task1");
            expect(boss.save).not.toHaveBeenCalled();
        });
    });

    describe("resetBoss", () => {
        it("resets boss if found", async () => {
            BossModelMock.findOne.mockResolvedValue(mockBossInstance);
            const result = await bossService.resetBoss(userId);
            expect(mockDeleteOne).toHaveBeenCalled();
            expect(result.boss).toBe(null);
        });

        it("does not delete boss if not found", async () => {
            BossModelMock.findOne.mockResolvedValue(null);
            const result = await bossService.resetBoss(userId);
            expect(mockDeleteOne).not.toHaveBeenCalled();
        });
    });
});
