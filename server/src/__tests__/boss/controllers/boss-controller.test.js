import { jest } from "@jest/globals";

const mockGetBoss = jest.fn();
const mockSpawnBoss = jest.fn();
const mockGetBossProgress = jest.fn();

await jest.unstable_mockModule(
    "../../../boss/services/boss-service.js",
    () => ({
        __esModule: true,
        default: {
            getBoss: mockGetBoss,
            spawnBoss: mockSpawnBoss,
        },
    })
);

await jest.unstable_mockModule(
    "../../../boss/services/boss-progress-service.js",
    () => ({
        __esModule: true,
        default: {
            getBossProgress: mockGetBossProgress,
        },
    })
);

const bossController = (
    await import("../../../boss/controllers/boss-controller.js")
).default;

describe("bossController", () => {
    const mockUserId = "user-123";
    const mockBoss = { id: 1, name: "Goblin King" };
    const mockProgress = { currentAvailableBossId: 2 };

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getBoss", () => {
        it("should return boss and progress", async () => {
            const req = { user: { id: mockUserId }, boss: null };

            mockGetBoss.mockResolvedValue(mockBoss);
            mockGetBossProgress.mockResolvedValue(mockProgress);

            await bossController.getBoss(req, mockRes, next);

            expect(mockGetBoss).toHaveBeenCalledWith(mockUserId);
            expect(mockGetBossProgress).toHaveBeenCalledWith(mockUserId);
            expect(mockRes.json).toHaveBeenCalledWith({
                boss: mockBoss,
                progress: mockProgress,
            });
        });

        it("should use req.boss if already provided", async () => {
            const req = { user: { id: mockUserId }, boss: mockBoss };

            mockGetBossProgress.mockResolvedValue(mockProgress);

            await bossController.getBoss(req, mockRes, next);

            expect(mockGetBoss).not.toHaveBeenCalled();
            expect(mockGetBossProgress).toHaveBeenCalledWith(mockUserId);
            expect(mockRes.json).toHaveBeenCalledWith({
                boss: mockBoss,
                progress: mockProgress,
            });
        });

        it("should handle null boss and return null in response", async () => {
            const req = { user: { id: mockUserId }, boss: null };

            mockGetBoss.mockResolvedValue(null);
            mockGetBossProgress.mockResolvedValue(mockProgress);

            await bossController.getBoss(req, mockRes, next);

            expect(mockRes.json).toHaveBeenCalledWith({
                boss: null,
                progress: mockProgress,
            });
        });

        it("should call next on error", async () => {
            const error = new Error("Test error");
            const req = { user: { id: mockUserId }, boss: null };

            mockGetBossProgress.mockRejectedValue(error);

            await bossController.getBoss(req, mockRes, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("spawnBoss", () => {
        it("should spawn boss with specified bossId", async () => {
            const req = { user: { id: mockUserId }, body: { bossId: 5 } };

            mockGetBossProgress.mockResolvedValue(mockProgress);
            mockSpawnBoss.mockResolvedValue(mockBoss);

            await bossController.spawnBoss(req, mockRes, next);

            expect(mockSpawnBoss).toHaveBeenCalledWith(mockUserId, 5);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockBoss);
        });

        it("should fallback to currentAvailableBossId if bossId is invalid", async () => {
            const req = { user: { id: mockUserId }, body: { bossId: -1 } };

            mockGetBossProgress.mockResolvedValue(mockProgress);
            mockSpawnBoss.mockResolvedValue(mockBoss);

            await bossController.spawnBoss(req, mockRes, next);

            expect(mockSpawnBoss).toHaveBeenCalledWith(
                mockUserId,
                mockProgress.currentAvailableBossId
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockBoss);
        });

        it("should fallback to bossId = 1 if currentAvailableBossId is undefined", async () => {
            const req = { user: { id: mockUserId }, body: { bossId: null } };
            const progress = {};

            mockGetBossProgress.mockResolvedValue(progress);
            mockSpawnBoss.mockResolvedValue(mockBoss);

            await bossController.spawnBoss(req, mockRes, next);

            expect(mockSpawnBoss).toHaveBeenCalledWith(mockUserId, 1);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockBoss);
        });

        it("should call next on error", async () => {
            const error = new Error("Spawn error");
            const req = { user: { id: mockUserId }, body: {} };

            mockGetBossProgress.mockRejectedValue(error);

            await bossController.spawnBoss(req, mockRes, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
