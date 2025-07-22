import { jest } from "@jest/globals";
import userService from "../../../auth/services/user-service.js";
import userController from "../../../auth/controllers/user-controller.js";
import RESPONSE_MESSAGES from "../../../shared/utils/messages/response-messages.js";

beforeAll(() => {
    userService.registration = jest.fn();
    userService.login = jest.fn();
    userService.forgotPassword = jest.fn();
    userService.resetPassword = jest.fn();
    userService.activate = jest.fn();
    userService.logout = jest.fn();
    userService.refresh = jest.fn();
    userService.updateUserProfile = jest.fn();
    userService.getAllUsers = jest.fn();
    userService.getUserById = jest.fn();
});

describe("User Controller", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, cookies: {}, user: { id: "user-id" } };
        res = {
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
            redirect: jest.fn(),
        };
        next = jest.fn();

        jest.clearAllMocks();
    });

    describe("registration", () => {
        it("should register a user and set refresh token cookie", async () => {
            const mockData = {
                refreshToken: "token",
                user: { email: "test@mail.com" },
            };

            req.body = { email: "test@mail.com", password: "123456" };
            userService.registration.mockResolvedValue(mockData);

            await userController.registration(req, res, next);

            expect(userService.registration).toHaveBeenCalledWith(
                "test@mail.com",
                "123456"
            );
            expect(res.cookie).toHaveBeenCalledWith(
                "refreshToken",
                "token",
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it("should call next with error on registration failure", async () => {
            const error = new Error("Fail");

            userService.registration.mockRejectedValue(error);
            req.body = { email: "fail@mail.com", password: "123456" };

            await userController.registration(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("login", () => {
        it("should login a user and set refresh token cookie", async () => {
            const mockData = {
                refreshToken: "token",
                user: { email: "test@mail.com" },
            };

            req.body = { email: "test@mail.com", password: "123456" };
            userService.login.mockResolvedValue(mockData);

            await userController.login(req, res, next);

            expect(userService.login).toHaveBeenCalledWith(
                "test@mail.com",
                "123456"
            );
            expect(res.cookie).toHaveBeenCalledWith(
                "refreshToken",
                "token",
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it("should call next with error on login failure", async () => {
            const error = new Error("Login Fail");

            userService.login.mockRejectedValue(error);
            req.body = { email: "fail@mail.com", password: "123456" };

            await userController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("forgotPassword", () => {
        it("should call forgotPassword and return success message", async () => {
            req.body = { email: "test@mail.com" };
            userService.forgotPassword.mockResolvedValue();

            await userController.forgotPassword(req, res, next);

            expect(userService.forgotPassword).toHaveBeenCalledWith(
                "test@mail.com"
            );
            expect(res.json).toHaveBeenCalledWith({
                message: RESPONSE_MESSAGES.forgotPassword,
            });
        });

        it("should call next with error if forgotPassword fails", async () => {
            const error = new Error("Forgot password fail");

            userService.forgotPassword.mockRejectedValue(error);
            req.body = { email: "fail@mail.com" };

            await userController.forgotPassword(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("resetPassword", () => {
        it("should reset password and return success message", async () => {
            req.body.password = "newPass";
            req.params.token = "abc123";
            userService.resetPassword.mockResolvedValue();

            await userController.resetPassword(req, res, next);

            expect(userService.resetPassword).toHaveBeenCalledWith(
                "abc123",
                "newPass"
            );
            expect(res.json).toHaveBeenCalledWith({
                message: RESPONSE_MESSAGES.passwordResetSuccess,
            });
        });

        it("should call next with error on resetPassword failure", async () => {
            const error = new Error("Reset fail");

            userService.resetPassword.mockRejectedValue(error);
            req.body.password = "failPass";
            req.params.token = "failToken";

            await userController.resetPassword(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("activate", () => {
        it("should activate account and redirect to login", async () => {
            req.params.link = "activation-link";
            process.env.CLIENT_URL = "http://localhost:3000";
            userService.activate.mockResolvedValue();

            await userController.activate(req, res, next);

            expect(userService.activate).toHaveBeenCalledWith(
                "activation-link"
            );
            expect(res.redirect).toHaveBeenCalledWith(
                "http://localhost:3000/login?activated=1"
            );
        });

        it("should redirect to login with error on activation failure", async () => {
            const error = new Error("Activation failed");

            userService.activate.mockRejectedValue(error);
            req.params.link = "bad-link";
            process.env.CLIENT_URL = "http://localhost:3000";

            await userController.activate(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith(
                `http://localhost:3000/login?activated=0&error=${encodeURIComponent(
                    error.message
                )}`
            );
        });
    });

    describe("logout", () => {
        it("should clear refresh cookie and return token", async () => {
            req.cookies.refreshToken = "token";
            userService.logout.mockResolvedValue({ success: true });

            await userController.logout(req, res, next);

            expect(userService.logout).toHaveBeenCalledWith("token");
            expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
            expect(res.json).toHaveBeenCalledWith({ success: true });
        });

        it("should call next with error on logout failure", async () => {
            const error = new Error("Logout fail");

            userService.logout.mockRejectedValue(error);
            req.cookies.refreshToken = "token";

            await userController.logout(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("refresh", () => {
        it("should refresh token and set cookie", async () => {
            req.cookies.refreshToken = "token";

            const mockData = { refreshToken: "newToken", user: {} };

            userService.refresh.mockResolvedValue(mockData);

            await userController.refresh(req, res, next);

            expect(userService.refresh).toHaveBeenCalledWith("token");
            expect(res.cookie).toHaveBeenCalledWith(
                "refreshToken",
                "newToken",
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it("should call next with error on refresh failure", async () => {
            const error = new Error("Refresh fail");

            userService.refresh.mockRejectedValue(error);
            req.cookies.refreshToken = "token";

            await userController.refresh(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("getUserProfile", () => {
        it("should return user profile with username and bio", async () => {
            const mockUser = {
                id: "user-id",
                email: "test@mail.com",
                username: "testuser",
                bio: "User bio",
                isActivated: true,
                createdAt: "2023-01-01T00:00:00Z",
                stats: null,
            };

            req.user.id = "user-id";
            userService.getUserById.mockResolvedValue(mockUser);

            await userController.getUserProfile(req, res, next);

            expect(userService.getUserById).toHaveBeenCalledWith(
                "user-id",
                true
            );
            expect(res.json).toHaveBeenCalledWith({
                id: mockUser.id,
                email: mockUser.email,
                username: mockUser.username,
                bio: mockUser.bio,
                isActivated: mockUser.isActivated,
                createdAt: mockUser.createdAt,
                stats: mockUser.stats,
            });
        });

        it("should return user profile with username=null and bio=''", async () => {
            const mockUser = {
                id: "user-id",
                email: "test@mail.com",
                username: undefined,
                bio: undefined,
                isActivated: true,
                createdAt: "2023-01-01T00:00:00Z",
                stats: undefined,
            };

            req.user.id = "user-id";
            userService.getUserById.mockResolvedValue(mockUser);

            await userController.getUserProfile(req, res, next);

            expect(userService.getUserById).toHaveBeenCalledWith(
                "user-id",
                true
            );
            expect(res.json).toHaveBeenCalledWith({
                id: mockUser.id,
                email: mockUser.email,
                username: null,
                bio: "",
                isActivated: mockUser.isActivated,
                createdAt: mockUser.createdAt,
                stats: null,
            });
        });

        it("should call next with error on failure", async () => {
            const error = new Error("Failed to get user");

            userService.getUserById.mockRejectedValue(error);

            await userController.getUserProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("updateUserProfile", () => {
        it("should update user profile and return updated user", async () => {
            const updatedUser = {
                id: "user-id",
                username: "newName",
                bio: "bio",
            };

            userService.updateUserProfile.mockResolvedValue(updatedUser);

            req.user.id = "user-id";
            req.body = { username: "newName", bio: "bio" };

            await userController.updateUserProfile(req, res, next);

            expect(userService.updateUserProfile).toHaveBeenCalledWith(
                "user-id",
                {
                    username: "newName",
                    bio: "bio",
                }
            );
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it("should call next with error on updateUserProfile failure", async () => {
            const error = new Error("Update fail");

            userService.updateUserProfile.mockRejectedValue(error);
            req.body = { username: "failName" };

            await userController.updateUserProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it("should update only username when bio is undefined", async () => {
            const updatedUser = {
                id: "user-id",
                username: "onlyUsername",
                bio: undefined,
            };

            userService.updateUserProfile.mockResolvedValue(updatedUser);

            req.user.id = "user-id";
            req.body = { username: "onlyUsername" };

            await userController.updateUserProfile(req, res, next);

            expect(userService.updateUserProfile).toHaveBeenCalledWith(
                "user-id",
                {
                    username: "onlyUsername",
                }
            );

            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it("should update only bio when username is undefined", async () => {
            const updatedUser = {
                id: "user-id",
                username: undefined,
                bio: "only bio updated",
            };

            userService.updateUserProfile.mockResolvedValue(updatedUser);

            req.user.id = "user-id";
            req.body = { bio: "only bio updated" };

            await userController.updateUserProfile(req, res, next);

            expect(userService.updateUserProfile).toHaveBeenCalledWith(
                "user-id",
                {
                    bio: "only bio updated",
                }
            );

            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });
    });

    describe("getUsers", () => {
        it("should return all users", async () => {
            const mockUsers = [
                { email: "user1@mail.com" },
                { email: "user2@mail.com" },
            ];

            userService.getAllUsers.mockResolvedValue(mockUsers);

            await userController.getUsers(req, res, next);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it("should call next with error on getAllUsers failure", async () => {
            const error = new Error("Get users fail");

            userService.getAllUsers.mockRejectedValue(error);

            await userController.getUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("getUserByIdPublic", () => {
        it("should return public user data", async () => {
            const mockUser = {
                id: "public-id",
                username: "publicUser",
                bio: "Public bio",
                createdAt: "2023-01-01T00:00:00Z",
                stats: { posts: 5, comments: 10 },
            };

            req.params.id = "public-id";
            userService.getUserById.mockResolvedValue(mockUser);

            await userController.getUserByIdPublic(req, res, next);

            expect(userService.getUserById).toHaveBeenCalledWith(
                "public-id",
                true
            );
            expect(res.json).toHaveBeenCalledWith({
                id: mockUser.id,
                username: mockUser.username,
                bio: mockUser.bio,
                createdAt: mockUser.createdAt,
                stats: mockUser.stats,
            });
        });

        it("should return null username, empty bio and null stats if missing", async () => {
            const mockUser = {
                id: "public-id",
                username: undefined,
                bio: undefined,
                createdAt: "2023-01-01T00:00:00Z",
                stats: undefined,
            };

            req.params.id = "public-id";
            userService.getUserById.mockResolvedValue(mockUser);

            await userController.getUserByIdPublic(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                id: mockUser.id,
                username: null,
                bio: "",
                createdAt: mockUser.createdAt,
                stats: null,
            });
        });

        it("should call next with error on getUserByIdPublic failure", async () => {
            const error = new Error("Public user fetch failed");

            userService.getUserById.mockRejectedValue(error);
            req.params.id = "public-id";

            await userController.getUserByIdPublic(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
