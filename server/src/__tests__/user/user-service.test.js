import { jest } from "@jest/globals";

jest.unstable_mockModule("../../user/models/user-model.js", () => ({
    default: {
        find: jest.fn(),
    },
}));

jest.unstable_mockModule("../../stats/models/user-stats-model.js", () => ({
    default: {
        findOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../../shared/helpers/findUserById.js", () => ({
    findUserById: jest.fn(),
}));

jest.unstable_mockModule("../../shared/helpers/paginate.js", () => ({
    paginate: jest.fn(),
}));

jest.unstable_mockModule("../../user/helpers/validate-username.js", () => ({
    default: jest.fn(),
}));

jest.unstable_mockModule(
    "../../user/helpers/delete-old-user-avatar.js",
    () => ({
        default: jest.fn(),
    })
);

jest.unstable_mockModule(
    "../../shared/utils/search-filters/filter-search-query.js",
    () => ({
        filterSearchQuery: jest.fn(),
    })
);

const UserModel = (await import("../../user/models/user-model.js")).default;
const UserStatsModel = (await import("../../stats/models/user-stats-model.js"))
    .default;
const { findUserById } = await import("../../shared/helpers/findUserById.js");
const { paginate } = await import("../../shared/helpers/paginate.js");
const validateUsername = (
    await import("../../user/helpers/validate-username.js")
).default;
const deleteOldAvatarIfNeeded = (
    await import("../../user/helpers/delete-old-user-avatar.js")
).default;
const { filterSearchQuery } = await import(
    "../../shared/utils/search-filters/filter-search-query.js"
);

const UserService = (await import("../../user/services/user-service.js"))
    .default;

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserById", () => {
        it("returns user without stats", async () => {
            const mockUser = { _id: "u1", username: "tester" };
            findUserById.mockResolvedValue(mockUser);

            const result = await UserService.getUserById("u1");

            expect(findUserById).toHaveBeenCalledWith("u1");
            expect(result).toMatchObject({ username: "tester" });
        });

        it("returns user with stats", async () => {
            const mockUser = { _id: "u1", username: "tester" };
            const mockStats = { gamesPlayed: 10 };

            findUserById.mockResolvedValue(mockUser);
            UserStatsModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockStats),
            });

            const result = await UserService.getUserById("u1", true);

            expect(UserStatsModel.findOne).toHaveBeenCalledWith({ user: "u1" });
            expect(result.stats).toEqual(mockStats);
        });

        it("returns user with null stats when stats not found", async () => {
            const mockUser = { _id: "u1", username: "tester" };

            findUserById.mockResolvedValue(mockUser);
            UserStatsModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            const result = await UserService.getUserById("u1", true);

            expect(result.stats).toBeNull();
        });
    });

    describe("updateUserProfile", () => {
        it("updates username, bio and photoUrl", async () => {
            const user = {
                _id: "123",
                username: "old",
                bio: "old bio",
                photoUrl: "old.png",
                save: jest.fn(),
            };

            findUserById.mockResolvedValue(user);

            const updateData = {
                username: "new",
                bio: "new bio",
                photoUrl: "new.png",
            };

            const result = await UserService.updateUserProfile(
                "123",
                updateData
            );

            expect(validateUsername).toHaveBeenCalledWith("new", "old");
            expect(deleteOldAvatarIfNeeded).toHaveBeenCalledWith(
                "old.png",
                "new.png"
            );
            expect(user.username).toBe("new");
            expect(user.bio).toBe("new bio");
            expect(user.photoUrl).toBe("new.png");
            expect(user.save).toHaveBeenCalled();
            expect(result).toMatchObject({ username: "new" });
        });

        it("keeps old values if not provided", async () => {
            const user = {
                username: "existing",
                bio: "existing bio",
                photoUrl: "existing.jpg",
                save: jest.fn(),
            };

            findUserById.mockResolvedValue(user);

            const result = await UserService.updateUserProfile("id1", {});

            expect(user.username).toBe("existing");
            expect(user.bio).toBe("existing bio");
            expect(user.photoUrl).toBe("existing.jpg");
            expect(result).toMatchObject({ username: "existing" });
        });

        it("updates only provided fields", async () => {
            const user = {
                _id: "123",
                username: "old",
                bio: "old bio",
                photoUrl: "old.png",
                save: jest.fn(),
            };

            findUserById.mockResolvedValue(user);

            const updateData = { bio: "updated bio only" };

            const result = await UserService.updateUserProfile(
                "123",
                updateData
            );

            expect(validateUsername).toHaveBeenCalledWith(undefined, "old");
            expect(user.username).toBe("old");
            expect(user.bio).toBe("updated bio only");
            expect(user.photoUrl).toBe("old.png");
            expect(result).toMatchObject({
                username: "old",
                bio: "updated bio only",
            });
        });

        it("handles empty string values correctly", async () => {
            const user = {
                _id: "123",
                username: "old",
                bio: "old bio",
                photoUrl: "old.png",
                save: jest.fn(),
            };

            findUserById.mockResolvedValue(user);

            const updateData = {
                bio: "",
                photoUrl: "",
            };

            const result = await UserService.updateUserProfile(
                "123",
                updateData
            );

            expect(user.bio).toBe("");
            expect(user.photoUrl).toBe("old.png");
            expect(result.bio).toBe("");
            expect(result.photoUrl).toBe("old.png");
        });

        it("converts empty photoUrl to null in DTO", async () => {
            const user = {
                _id: "123",
                username: "test",
                bio: "test bio",
                photoUrl: "",
                save: jest.fn(),
            };

            findUserById.mockResolvedValue(user);

            const result = await UserService.updateUserProfile("123", {});

            expect(result.photoUrl).toBeNull();
        });
    });

    describe("getAllUsers", () => {
        it("returns all users", async () => {
            const mockUsers = [{ username: "one" }, { username: "two" }];
            UserModel.find.mockResolvedValue(mockUsers);

            const result = await UserService.getAllUsers();

            expect(UserModel.find).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });

    describe("searchUsers", () => {
        it("returns paginated users as DTOs", async () => {
            const query = "john";
            const requesterId = "u123";
            const mockUserData = {
                _id: "u456",
                username: "john_doe",
                email: "john@test.com",
                isActivated: true,
                bio: "Test bio",
                photoUrl: "avatar.jpg",
                createdAt: new Date("2023-01-01"),
            };

            const filter = {
                username: { $regex: query, $options: "i" },
                _id: { $ne: "u123" },
            };

            const paginated = {
                results: [mockUserData],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
                hasMore: false,
            };

            filterSearchQuery.mockReturnValue({
                username: { $regex: query, $options: "i" },
            });
            paginate.mockResolvedValue(paginated);

            const result = await UserService.searchUsers(
                query,
                requesterId,
                1,
                10
            );

            expect(filterSearchQuery).toHaveBeenCalledWith(["username"], query);
            expect(paginate).toHaveBeenCalledWith(UserModel, filter, {
                page: 1,
                limit: 10,
            });

            expect(result.users).toHaveLength(1);
            expect(result.users[0]).toMatchObject({
                id: "u456",
                username: "john_doe",
                email: "john@test.com",
                isActivated: true,
                bio: "Test bio",
                photoUrl: "avatar.jpg",
            });
            expect(result.total).toBe(1);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
        });

        it("excludes requester from results", async () => {
            const query = "test";
            const requesterId = "u123";

            filterSearchQuery.mockReturnValue({
                username: { $regex: query, $options: "i" },
            });
            paginate.mockResolvedValue({ results: [], total: 0 });

            await UserService.searchUsers(query, requesterId, 1, 10);

            expect(paginate).toHaveBeenCalledWith(
                UserModel,
                expect.objectContaining({
                    _id: { $ne: requesterId },
                }),
                { page: 1, limit: 10 }
            );
        });

        it("handles search without requesterId", async () => {
            const query = "test";

            filterSearchQuery.mockReturnValue({
                username: { $regex: query, $options: "i" },
            });
            paginate.mockResolvedValue({ results: [], total: 0 });

            await UserService.searchUsers(query, null, 1, 10);

            expect(paginate).toHaveBeenCalledWith(
                UserModel,
                expect.not.objectContaining({
                    _id: expect.anything(),
                }),
                { page: 1, limit: 10 }
            );
        });

        it("handles users with null/undefined fields in DTO conversion", async () => {
            const mockUserData = {
                _id: "u456",
                email: "test@test.com",
                isActivated: false,
                username: null,
                bio: undefined,
                photoUrl: "  ",
                createdAt: null,
            };

            const paginated = {
                results: [mockUserData],
                total: 1,
                page: 1,
                limit: 10,
            };

            filterSearchQuery.mockReturnValue({});
            paginate.mockResolvedValue(paginated);

            const result = await UserService.searchUsers("test", "u123", 1, 10);

            expect(result.users[0]).toMatchObject({
                id: "u456",
                username: null,
                bio: "",
                photoUrl: null,
                createdAt: null,
            });
        });
    });
});
