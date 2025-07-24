import { jest } from "@jest/globals";

jest.unstable_mockModule("../../user/models/user-model.js", () => ({
    default: {
        findById: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
    },
}));

jest.unstable_mockModule("../../stats/models/user-stats-model.js", () => ({
    default: {
        findOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../../user/helpers/validate-username.js", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.unstable_mockModule(
    "../../user/helpers/delete-old-user-avatar.js",
    () => ({
        __esModule: true,
        default: jest.fn(),
    })
);

const UserModel = (await import("../../user/models/user-model.js")).default;
const UserStatsModel = (await import("../../stats/models/user-stats-model.js"))
    .default;
const validateUsername = (
    await import("../../user/helpers/validate-username.js")
).default;
const deleteOldAvatarIfNeeded = (
    await import("../../user/helpers/delete-old-user-avatar.js")
).default;
const UserDto = (await import("../../shared/dtos/user-dto.js")).default;
const userService = (await import("../../user/services/user-service.js"))
    .default;

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserById", () => {
        it("should return user with stats when includeStats is true", async () => {
            const userId = "id123";
            const mockUser = { _id: userId, email: "test@mail.com" };
            const mockStats = { gamesPlayed: 5 };

            UserModel.findById.mockResolvedValue(mockUser);
            UserStatsModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockStats),
            });

            const result = await userService.getUserById(userId, true);

            expect(UserModel.findById).toHaveBeenCalledWith(userId);
            expect(UserStatsModel.findOne).toHaveBeenCalledWith({
                user: userId,
            });
            expect(result).toEqual(expect.any(UserDto));
            expect(result.stats).toEqual(mockStats);
        });

        it("should return user without stats when includeStats is false", async () => {
            const userId = "id123";
            const mockUser = { _id: userId, email: "test@mail.com" };

            UserModel.findById.mockResolvedValue(mockUser);

            const result = await userService.getUserById(userId, false);

            expect(UserModel.findById).toHaveBeenCalledWith(userId);
            expect(UserStatsModel.findOne).not.toHaveBeenCalled();
            expect(result).toEqual(expect.any(UserDto));
            expect(result.stats).toBeNull();
        });

        it("should throw if user not found", async () => {
            UserModel.findById.mockResolvedValue(null);

            await expect(userService.getUserById("no-user")).rejects.toThrow(
                "User not found"
            );
        });
    });

    describe("updateUserProfile", () => {
        it("should validate username and delete old avatar", async () => {
            const userId = "id123";
            const user = {
                _id: userId,
                username: "oldUser",
                bio: "old bio",
                photoUrl: "/public/avatars/old.png",
                save: jest.fn(),
            };

            UserModel.findById.mockResolvedValue(user);
            UserModel.findOne.mockResolvedValue(null);
            validateUsername.mockResolvedValue();
            deleteOldAvatarIfNeeded.mockResolvedValue();

            const updateData = {
                username: "newUser",
                bio: "new bio",
                photoUrl: "/public/avatars/new.png",
            };

            const result = await userService.updateUserProfile(
                userId,
                updateData
            );

            expect(validateUsername).toHaveBeenCalledWith("newUser", "oldUser");
            expect(deleteOldAvatarIfNeeded).toHaveBeenCalledWith(
                "/public/avatars/old.png",
                "/public/avatars/new.png"
            );
            expect(user.username).toBe("newUser");
            expect(user.bio).toBe("new bio");
            expect(user.photoUrl).toBe("/public/avatars/new.png");
            expect(user.save).toHaveBeenCalled();
            expect(result).toEqual(expect.any(UserDto));
        });

        it("should throw if user not found", async () => {
            UserModel.findById.mockResolvedValue(null);

            await expect(
                userService.updateUserProfile("id123", {})
            ).rejects.toThrow("User not found");
        });

        it("should preserve existing values if updateData fields are missing", async () => {
            const userId = "id456";
            const user = {
                _id: userId,
                username: "existingUser",
                bio: "existing bio",
                photoUrl: "/public/avatars/existing.png",
                save: jest.fn(),
            };

            UserModel.findById.mockResolvedValue(user);
            validateUsername.mockResolvedValue();
            deleteOldAvatarIfNeeded.mockResolvedValue();

            const updateData = {};

            const result = await userService.updateUserProfile(
                userId,
                updateData
            );

            expect(validateUsername).toHaveBeenCalledWith(
                undefined,
                "existingUser"
            );
            expect(deleteOldAvatarIfNeeded).toHaveBeenCalledWith(
                "/public/avatars/existing.png",
                undefined
            );

            expect(user.username).toBe("existingUser");
            expect(user.bio).toBe("existing bio");
            expect(user.photoUrl).toBe("/public/avatars/existing.png");
            expect(user.save).toHaveBeenCalled();
            expect(result).toEqual(expect.any(UserDto));
        });
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const users = [{ email: "a" }, { email: "b" }];

            UserModel.find.mockResolvedValue(users);

            const result = await userService.getAllUsers();

            expect(UserModel.find).toHaveBeenCalled();
            expect(result).toEqual(users);
        });
    });

    describe("searchUsers", () => {
        it("should return matched users by username", async () => {
            const mockUsers = [
                { _id: "u1", username: "TestUser" },
                { _id: "u2", username: "AnotherUser" },
            ];

            UserModel.find.mockResolvedValue(mockUsers);

            const result = await userService.searchUsers(
                "test",
                "requester123"
            );

            expect(UserModel.find).toHaveBeenCalledWith({
                $or: [{ username: /test/i }],
                _id: { $ne: "requester123" },
            });

            expect(result.users).toEqual([
                expect.any(UserDto),
                expect.any(UserDto),
            ]);
        });

        it("should add _id search condition if query is valid ObjectId", async () => {
            const validId = "64b7c51e961c4b5d6f305c24";
            const mockUsers = [{ _id: validId, username: "ExactIdUser" }];

            UserModel.find.mockResolvedValue(mockUsers);

            const result = await userService.searchUsers(validId, "otherId");

            expect(UserModel.find).toHaveBeenCalledWith({
                $or: [{ username: new RegExp(validId, "i") }, { _id: validId }],
                _id: { $ne: "otherId" },
            });

            expect(result.users).toEqual([expect.any(UserDto)]);
        });

        it("should not include _id condition if query is not valid ObjectId", async () => {
            const invalidId = "not-an-object-id";
            const mockUsers = [{ _id: "123", username: "not-an-object-id" }];

            UserModel.find.mockResolvedValue(mockUsers);

            const result = await userService.searchUsers(invalidId, "abc");

            expect(UserModel.find).toHaveBeenCalledWith({
                $or: [{ username: /not-an-object-id/i }],
                _id: { $ne: "abc" },
            });

            expect(result.users).toEqual([expect.any(UserDto)]);
        });
    });
});
