import { jest } from "@jest/globals";

jest.unstable_mockModule("bcrypt", () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn(),
    },
}));

jest.unstable_mockModule("uuid", () => ({
    v4: jest.fn(),
}));

jest.unstable_mockModule("../../../user/models/user-model.js", () => ({
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.unstable_mockModule("../../../auth/services/mail-service.js", () => ({
    default: {
        sendActivationMail: jest.fn(),
        sendPasswordResetMail: jest.fn(),
    },
}));

jest.unstable_mockModule("../../../auth/services/token-service.js", () => ({
    default: {
        generateTokens: jest.fn(),
        saveToken: jest.fn(),
        removeToken: jest.fn(),
        validateRefreshToken: jest.fn(),
        findToken: jest.fn(),
        generateResetToken: jest.fn(),
        saveResetToken: jest.fn(),
        validateResetToken: jest.fn(),
        findResetToken: jest.fn(),
        removeResetToken: jest.fn(),
    },
}));

jest.unstable_mockModule("../../../shared/dtos/user-dto.js", () => ({
    default: jest.fn().mockImplementation((user) => ({
        id: user._id || "user-id",
        email: user.email,
        isActivated: user.isActivated,
    })),
}));

jest.unstable_mockModule("../../../shared/helpers/findUserById.js", () => ({
    findUserById: jest.fn(),
}));

const bcrypt = (await import("bcrypt")).default;
const uuid = await import("uuid");
const UserModel = (await import("../../../user/models/user-model.js")).default;
const mailService = (await import("../../../auth/services/mail-service.js"))
    .default;
const tokenService = (await import("../../../auth/services/token-service.js"))
    .default;
const ApiError = (await import("../../../shared/exceptions/api-error.js"))
    .default;
const { findUserById } = await import(
    "../../../shared/helpers/findUserById.js"
);

const authService = (await import("../../../auth/services/auth-service.js"))
    .default;

describe("AuthService", () => {
    const email = "test@example.com";
    const password = "plain_password";
    const hashedPassword = "hashed_password";
    const activationLink = "uuid-activation-link";

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_URL = "http://localhost:5000";
    });

    describe("registration", () => {
        it("should register user and return tokens and user DTO", async () => {
            UserModel.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            uuid.v4.mockReturnValue(activationLink);

            const mockUser = {
                _id: "user-id-1",
                email,
                password: hashedPassword,
                activationLink,
                isActivated: false,
            };

            UserModel.create.mockResolvedValue(mockUser);
            mailService.sendActivationMail.mockResolvedValue();
            tokenService.generateTokens.mockReturnValue({
                accessToken: "access-token",
                refreshToken: "refresh-token",
            });
            tokenService.saveToken.mockResolvedValue();

            const result = await authService.registration(email, password);

            expect(UserModel.findOne).toHaveBeenCalledWith({ email });
            expect(bcrypt.hash).toHaveBeenCalledWith(password, 3);
            expect(UserModel.create).toHaveBeenCalledWith({
                email,
                password: hashedPassword,
                activationLink,
            });
            expect(mailService.sendActivationMail).toHaveBeenCalledWith(
                email,
                `${process.env.API_URL}/api/auth/activate/${activationLink}`
            );
            expect(tokenService.generateTokens).toHaveBeenCalled();
            expect(tokenService.saveToken).toHaveBeenCalledWith(
                mockUser._id,
                expect.any(String)
            );
            expect(result.user).toBeInstanceOf(Object);
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });

        it("should throw if user already exists", async () => {
            UserModel.findOne.mockResolvedValue({ email });

            await expect(
                authService.registration(email, password)
            ).rejects.toThrow(
                new ApiError(
                    400,
                    `A user with this mailbox: ${email} is already registered.`
                ).message
            );
        });
    });

    describe("activate", () => {
        it("should activate user with valid activation link", async () => {
            const mockUser = { isActivated: false, save: jest.fn() };

            UserModel.findOne.mockResolvedValue(mockUser);

            await authService.activate(activationLink);

            expect(UserModel.findOne).toHaveBeenCalledWith({ activationLink });
            expect(mockUser.isActivated).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it("should throw if activation link invalid", async () => {
            UserModel.findOne.mockResolvedValue(null);

            await expect(authService.activate("bad-link")).rejects.toThrow(
                new ApiError(400, "Invalid activation link").message
            );
        });
    });

    describe("login", () => {
        it("should login with valid credentials", async () => {
            const mockUser = {
                _id: "user-id-1",
                email,
                password: hashedPassword,
                isActivated: true,
            };

            UserModel.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            tokenService.generateTokens.mockReturnValue({
                accessToken: "access-token",
                refreshToken: "refresh-token",
            });
            tokenService.saveToken.mockResolvedValue();

            const result = await authService.login(email, password);

            expect(result.user).toBeInstanceOf(Object);
            expect(result.accessToken).toBe("access-token");
            expect(result.refreshToken).toBe("refresh-token");
        });

        it("should throw if user not found", async () => {
            UserModel.findOne.mockResolvedValue(null);

            await expect(authService.login(email, password)).rejects.toThrow(
                new ApiError(400, "User with this email address was not found")
                    .message
            );
        });

        it("should throw if password incorrect", async () => {
            UserModel.findOne.mockResolvedValue({
                password: hashedPassword,
                isActivated: true,
            });
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login(email, password)).rejects.toThrow(
                new ApiError(400, "Incorrect password").message
            );
        });

        it("should throw if account not activated", async () => {
            UserModel.findOne.mockResolvedValue({
                password: hashedPassword,
                isActivated: false,
            });
            bcrypt.compare.mockResolvedValue(true);

            await expect(authService.login(email, password)).rejects.toThrow(
                new ApiError(400, "Please activate your account via email")
                    .message
            );
        });
    });

    describe("logout", () => {
        it("should remove token on logout", async () => {
            tokenService.removeToken.mockResolvedValue("token-removed");

            const result = await authService.logout("refresh-token");

            expect(tokenService.removeToken).toHaveBeenCalledWith(
                "refresh-token"
            );
            expect(result).toBe("token-removed");
        });
    });

    describe("refresh", () => {
        it("should throw if no refresh token provided", async () => {
            await expect(authService.refresh(null)).rejects.toThrow(
                new ApiError(401, "User is not authorized").message
            );
        });

        it("should throw if token invalid or not found", async () => {
            tokenService.validateRefreshToken.mockReturnValue(null);
            tokenService.findToken.mockResolvedValue(null);

            await expect(authService.refresh("some-token")).rejects.toThrow(
                new ApiError(401, "User is not authorized").message
            );
        });

        it("should return new tokens if refresh token valid", async () => {
            const userData = { id: "user-id" };
            const mockUser = { _id: "user-id", email, isActivated: true };

            tokenService.validateRefreshToken.mockReturnValue(userData);
            tokenService.findToken.mockResolvedValue(true);
            UserModel.findById.mockResolvedValue(mockUser);
            tokenService.generateTokens.mockReturnValue({
                accessToken: "new-access",
                refreshToken: "new-refresh",
            });
            tokenService.saveToken.mockResolvedValue();

            const result = await authService.refresh("valid-refresh-token");

            expect(result.user).toBeInstanceOf(Object);
            expect(result.accessToken).toBe("new-access");
            expect(result.refreshToken).toBe("new-refresh");
        });
    });

    describe("forgotPassword", () => {
        it("should do nothing if user not found", async () => {
            UserModel.findOne.mockResolvedValue(null);

            await authService.forgotPassword(email);

            expect(tokenService.generateResetToken).not.toHaveBeenCalled();
        });

        it("should generate reset token and send reset mail", async () => {
            const mockUser = { _id: "user-id", email };

            UserModel.findOne.mockResolvedValue(mockUser);
            tokenService.generateResetToken.mockReturnValue("reset-token");
            tokenService.saveResetToken.mockResolvedValue();
            mailService.sendPasswordResetMail.mockResolvedValue();

            await authService.forgotPassword(email);

            expect(tokenService.generateResetToken).toHaveBeenCalledWith({
                email,
                id: mockUser._id,
            });
            expect(tokenService.saveResetToken).toHaveBeenCalled();
            expect(mailService.sendPasswordResetMail).toHaveBeenCalled();
        });
    });

    describe("resetPassword", () => {
        it("should throw if reset token invalid", async () => {
            tokenService.validateResetToken.mockReturnValue(null);

            await expect(
                authService.resetPassword("bad-token", "newpass")
            ).rejects.toThrow("Invalid or expired reset token");
        });

        it("should throw if reset token not found in DB", async () => {
            tokenService.validateResetToken.mockReturnValue({ id: "user-id" });
            tokenService.findResetToken.mockResolvedValue(null);

            await expect(
                authService.resetPassword("expired-token", "newpass")
            ).rejects.toThrow("Invalid or expired reset token");
        });

        it("should update password and remove reset token", async () => {
            const mockUser = { password: "old", save: jest.fn() };

            tokenService.validateResetToken.mockReturnValue({ id: "user-id" });
            tokenService.findResetToken.mockResolvedValue(true);
            findUserById.mockResolvedValue(mockUser);
            bcrypt.hash.mockResolvedValue("new-hash");
            tokenService.removeResetToken.mockResolvedValue();

            await authService.resetPassword("valid-token", "newpass");

            expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 5);
            expect(mockUser.password).toBe("new-hash");
            expect(mockUser.save).toHaveBeenCalled();
            expect(tokenService.removeResetToken).toHaveBeenCalledWith(
                "valid-token"
            );
        });

        it("should throw if user not found", async () => {
            findUserById.mockRejectedValue(
                ApiError.BadRequest("User not found")
            );

            await expect(
                authService.resetPassword("valid-token", "newpass")
            ).rejects.toThrow("User not found");
        });
    });
});
