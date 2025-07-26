import { jest } from "@jest/globals";
import userController from "../../user/controllers/user-controller.js";
import userService from "../../user/services/user-service.js";

describe("userController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        userService.getUserById = jest.fn();
        userService.updateUserProfile = jest.fn();
        userService.getAllUsers = jest.fn();
    });

    describe("getUserProfile", () => {
        it("should return user profile data", async () => {
            const req = { user: { id: "user123" } };
            const userMock = {
                id: "user123",
                email: "test@example.com",
                username: "testuser",
                bio: "Hello",
                isActivated: true,
                createdAt: "2023-01-01",
                stats: { posts: 5 },
                photoUrl: "/img.jpg",
            };
            const res = { json: jest.fn() };
            const next = jest.fn();

            userService.getUserById.mockResolvedValue(userMock);

            await userController.getUserProfile(req, res, next);

            expect(userService.getUserById).toHaveBeenCalledWith(
                "user123",
                true
            );
            expect(res.json).toHaveBeenCalledWith({
                id: userMock.id,
                email: userMock.email,
                username: "testuser",
                bio: "Hello",
                isActivated: true,
                createdAt: "2023-01-01",
                stats: { posts: 5 },
                photoUrl: "/img.jpg",
            });
        });

        it("should call next with error if getUserById fails", async () => {
            const req = { user: { id: "user123" } };
            const res = {};
            const next = jest.fn();

            userService.getUserById.mockRejectedValue(new Error("DB error"));

            await userController.getUserProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        it("should return defaults when optional fields are missing", async () => {
            const req = { user: { id: "user123" } };
            const userMock = {
                id: "user123",
                email: "test@example.com",
                username: undefined,
                bio: undefined,
                isActivated: true,
                createdAt: "2023-01-01",
                stats: undefined,
                photoUrl: undefined,
            };
            const res = { json: jest.fn() };
            const next = jest.fn();

            userService.getUserById.mockResolvedValue(userMock);

            await userController.getUserProfile(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                id: "user123",
                email: "test@example.com",
                username: null,
                bio: "",
                isActivated: true,
                createdAt: "2023-01-01",
                stats: null,
                photoUrl: null,
            });
        });
    });

    describe("updateUserProfile", () => {
        it("should update user profile and return updated data", async () => {
            const req = {
                user: { id: "user123" },
                body: { username: "newuser", bio: "updated bio" },
                file: { filename: "avatar.png" },
            };
            const updatedMock = {
                id: "user123",
                username: "newuser",
                bio: "updated bio",
                photoUrl: "/public/avatars/avatar.png",
            };
            const res = { json: jest.fn() };
            const next = jest.fn();

            userService.updateUserProfile.mockResolvedValue(updatedMock);

            await userController.updateUserProfile(req, res, next);

            expect(userService.updateUserProfile).toHaveBeenCalledWith(
                "user123",
                {
                    username: "newuser",
                    bio: "updated bio",
                    photoUrl: "/public/avatars/avatar.png",
                }
            );
            expect(res.json).toHaveBeenCalledWith(updatedMock);
        });

        it("should handle missing fields in body", async () => {
            const req = {
                user: { id: "user123" },
                body: {},
                file: { filename: "avatar.png" },
            };
            const updatedMock = {
                id: "user123",
                photoUrl: "/public/avatars/avatar.png",
            };
            const res = { json: jest.fn() };
            const next = jest.fn();

            userService.updateUserProfile.mockResolvedValue(updatedMock);

            await userController.updateUserProfile(req, res, next);

            expect(userService.updateUserProfile).toHaveBeenCalledWith(
                "user123",
                {
                    photoUrl: "/public/avatars/avatar.png",
                }
            );
            expect(res.json).toHaveBeenCalledWith(updatedMock);
        });

        it("should call next with error if updateUserProfile fails", async () => {
            const req = {
                user: { id: "user123" },
                body: { username: "user" },
            };
            const res = {};
            const next = jest.fn();

            userService.updateUserProfile.mockRejectedValue(
                new Error("Update failed")
            );

            await userController.updateUserProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getUsers", () => {
        it("should return list of users", async () => {
            const req = {};
            const res = { json: jest.fn() };
            const next = jest.fn();
            const usersMock = [
                { id: "1", username: "Alice" },
                { id: "2", username: "Bob" },
            ];

            userService.getAllUsers.mockResolvedValue(usersMock);

            await userController.getUsers(req, res, next);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(usersMock);
        });

        it("should call next with error if getAllUsers fails", async () => {
            const req = {};
            const res = {};
            const next = jest.fn();

            userService.getAllUsers.mockRejectedValue(
                new Error("Failed to fetch users")
            );

            await userController.getUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getUserByIdPublic", () => {
        it("should return public user profile", async () => {
            const req = { params: { id: "user456" } };
            const res = { json: jest.fn() };
            const next = jest.fn();
            const userMock = {
                id: "user456",
                username: "PublicUser",
                bio: null,
                createdAt: "2023-06-01",
                stats: { followers: 10 },
            };

            userService.getUserById.mockResolvedValue(userMock);

            await userController.getUserByIdPublic(req, res, next);

            expect(userService.getUserById).toHaveBeenCalledWith(
                "user456",
                true
            );
            expect(res.json).toHaveBeenCalledWith({
                id: "user456",
                username: "PublicUser",
                bio: "",
                createdAt: "2023-06-01",
                stats: { followers: 10 },
            });
        });

        it("should handle missing optional fields in public profile", async () => {
            const req = { params: { id: "user789" } };
            const res = { json: jest.fn() };
            const next = jest.fn();
            const userMock = {
                id: "user789",
                username: undefined,
                bio: undefined,
                createdAt: "2023-06-10",
                stats: undefined,
            };

            userService.getUserById.mockResolvedValue(userMock);

            await userController.getUserByIdPublic(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                id: "user789",
                username: null,
                bio: "",
                createdAt: "2023-06-10",
                stats: null,
            });
        });

        it("should call next with error if getUserById fails", async () => {
            const req = { params: { id: "user456" } };
            const res = {};
            const next = jest.fn();

            userService.getUserById.mockRejectedValue(
                new Error("Failed to fetch user")
            );

            await userController.getUserByIdPublic(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("searchUsers", () => {
        it("should return matched users", async () => {
            const req = {
                user: { id: "user123" },
                query: { query: "test" },
            };
            const res = { json: jest.fn() };
            const next = jest.fn();
            const usersMock = [
                { id: "u1", username: "test1" },
                { id: "u2", username: "test2" },
            ];

            userService.searchUsers = jest
                .fn()
                .mockResolvedValue({ users: usersMock });

            await userController.searchUsers(req, res, next);

            expect(userService.searchUsers).toHaveBeenCalledWith(
                "test",
                "user123",
                undefined,
                undefined
            );
            expect(res.json).toHaveBeenCalledWith({ users: usersMock });
        });

        it("should call next with error if searchUsers fails", async () => {
            const req = {
                user: { id: "user123" },
                query: { query: "test" },
            };
            const res = {};
            const next = jest.fn();

            userService.searchUsers = jest
                .fn()
                .mockRejectedValue(new Error("Search failed"));

            await userController.searchUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        it("should pass page and limit to searchUsers", async () => {
            const req = {
                user: { id: "user123" },
                query: { query: "test", page: "2", limit: "5" },
            };
            const res = { json: jest.fn() };
            const next = jest.fn();
            const usersMock = [{ id: "u1", username: "test1" }];

            userService.searchUsers = jest
                .fn()
                .mockResolvedValue({ users: usersMock });

            await userController.searchUsers(req, res, next);

            expect(userService.searchUsers).toHaveBeenCalledWith(
                "test",
                "user123",
                "2",
                "5"
            );
            expect(res.json).toHaveBeenCalledWith({ users: usersMock });
        });
    });
});
