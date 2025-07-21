import { jest } from "@jest/globals";

const mockValidateUserId = jest.fn();
const mockCreate = jest.fn();
const mockFindOne = jest.fn();
const mockSave = jest.fn();
const mockDeleteOne = jest.fn();

await jest.unstable_mockModule(
    "../../../shared/utils/validations/validate-object-id.js",
    () => ({
        __esModule: true,
        validateUserId: mockValidateUserId,
    })
);

await jest.unstable_mockModule(
    "../../../boss/models/boss-progress-model.js",
    () => ({
        __esModule: true,
        default: {
            findOne: mockFindOne,
            create: mockCreate,
        },
    })
);

const bossProgressService = (
    await import("../../../boss/services/boss-progress-service.js")
).default;

describe("bossProgressService", () => {
    const userId = "user-123";

    beforeEach(() => {
        jest.clearAllMocks();
        mockValidateUserId.mockImplementation(() => true);
    });

    describe("getBossProgress", () => {
        it("returns existing progress", async () => {
            const existingProgress = { _id: "progress1" };

            mockFindOne.mockResolvedValue(existingProgress);

            const result = await bossProgressService.getBossProgress(userId);

            expect(mockValidateUserId).toHaveBeenCalledWith(userId);
            expect(mockFindOne).toHaveBeenCalledWith({ user: userId });
            expect(result).toBe(existingProgress);
        });

        it("creates default progress if not found", async () => {
            const createdProgress = { _id: "progress2" };

            mockFindOne.mockResolvedValue(null);
            mockCreate.mockResolvedValue(createdProgress);

            const result = await bossProgressService.getBossProgress(userId);

            expect(mockCreate).toHaveBeenCalledWith({
                user: userId,
                lastDefeatedBossId: 0,
                currentAvailableBossId: 1,
                totalBossesDefeated: 0,
                totalExpFromBosses: 0,
            });

            expect(result).toBe(createdProgress);
        });
    });

    describe("updateBossProgress", () => {
        it("updates fields and saves", async () => {
            const defeatedBossId = 3;
            const expGained = 100;
            const fakeProgress = {
                totalBossesDefeated: 1,
                totalExpFromBosses: 150,
                save: mockSave,
            };

            mockFindOne.mockResolvedValue(fakeProgress);

            const updated = await bossProgressService.updateBossProgress(
                userId,
                defeatedBossId,
                expGained
            );

            expect(updated.lastDefeatedBossId).toBe(defeatedBossId);
            expect(updated.currentAvailableBossId).toBe(defeatedBossId + 1);
            expect(updated.totalBossesDefeated).toBe(2);
            expect(updated.totalExpFromBosses).toBe(250);
            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe("resetBossProgress", () => {
        it("deletes progress if exists", async () => {
            const fakeProgress = { deleteOne: mockDeleteOne };

            mockFindOne.mockResolvedValue(fakeProgress);

            const result = await bossProgressService.resetBossProgress(userId);

            expect(mockDeleteOne).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it("does nothing if progress doesn't exist", async () => {
            mockFindOne.mockResolvedValue(null);

            const result = await bossProgressService.resetBossProgress(userId);

            expect(result).toBe(true);
        });
    });

    describe("getAvailableBossId", () => {
        it("returns currentAvailableBossId", async () => {
            const progress = { currentAvailableBossId: 7 };

            mockFindOne.mockResolvedValue(progress);

            const result = await bossProgressService.getAvailableBossId(userId);

            expect(result).toBe(7);
        });
    });
});
