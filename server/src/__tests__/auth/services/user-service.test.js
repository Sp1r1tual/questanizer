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

jest.unstable_mockModule("../../../auth/models/user-model.js", () => ({
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
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
        generateResetToken: jest.fn(),
        saveResetToken: jest.fn(),
        validateResetToken: jest.fn(),
        findResetToken: jest.fn(),
        removeResetToken: jest.fn(),
        validateRefreshToken: jest.fn(),
        findToken: jest.fn(),
    },
}));

const bcrypt = (await import("bcrypt")).default;
const uuid = await import("uuid");
const uuidv4 = uuid.v4;

const UserModel = (await import("../../../auth/models/user-model.js")).default;
const mailService = (await import("../../../auth/services/mail-service.js"))
    .default;
const tokenService = (await import("../../../auth/services/token-service.js"))
    .default;
const userService = (await import("../../../auth/services/user-service.js"))
    .default;

describe("UserService - registration", () => {
    const mockEmail = "test@example.com";
    const mockPassword = "plain_password";
    const mockHashedPassword = "hashed_password";
    const mockActivationLink = "uuid-123";
    const mockUserDoc = {
        _id: "user-id-1",
        email: mockEmail,
        password: mockHashedPassword,
        activationLink: mockActivationLink,
        isActivated: false,
    };
    const mockUserDto = {
        id: "user-id-1",
        email: mockEmail,
        isActivated: false,
    };
    const mockTokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_URL = "http://localhost:5000";
    });

    it("should register user and return tokens and user DTO", async () => {
        UserModel.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue(mockHashedPassword);
        uuidv4.mockReturnValue(mockActivationLink);
        UserModel.create.mockResolvedValue(mockUserDoc);
        mailService.sendActivationMail.mockResolvedValue();
        tokenService.generateTokens.mockReturnValue(mockTokens);
        tokenService.saveToken.mockResolvedValue();

        const result = await userService.registration(mockEmail, mockPassword);

        expect(result).toEqual({
            ...mockTokens,
            user: mockUserDto,
        });
    });

    it("should throw if user already exists", async () => {
        UserModel.findOne.mockResolvedValue({ email: mockEmail });

        await expect(
            userService.registration(mockEmail, mockPassword)
        ).rejects.toThrow(
            `A user with this mailbox: ${mockEmail} is already registered.`
        );
    });

    it("should activate user with valid link", async () => {
        const mockUser = { isActivated: false, save: jest.fn() };

        UserModel.findOne.mockResolvedValue(mockUser);

        await userService.activate("valid-link");

        expect(mockUser.isActivated).toBe(true);
        expect(mockUser.save).toHaveBeenCalled();
    });

    it("should throw if activation link is invalid", async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(userService.activate("bad-link")).rejects.toThrow(
            "Invalid activation link"
        );
    });

    it("should login with valid credentials", async () => {
        const mockUser = {
            _id: "id1",
            email: mockEmail,
            password: mockHashedPassword,
            isActivated: true,
        };

        UserModel.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        tokenService.generateTokens.mockReturnValue(mockTokens);
        tokenService.saveToken.mockResolvedValue();

        const result = await userService.login(mockEmail, mockPassword);

        expect(result).toEqual({
            ...mockTokens,
            user: {
                id: "id1",
                email: mockEmail,
                isActivated: true,
            },
        });
    });

    it("should throw if user not found", async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(
            userService.login(mockEmail, mockPassword)
        ).rejects.toThrow("User with this email address was not found");
    });

    it("should throw if password incorrect", async () => {
        UserModel.findOne.mockResolvedValue({
            password: mockHashedPassword,
            isActivated: true,
        });
        bcrypt.compare.mockResolvedValue(false);

        await expect(
            userService.login(mockEmail, mockPassword)
        ).rejects.toThrow("Incorrect password");
    });

    it("should throw if account not activated", async () => {
        UserModel.findOne.mockResolvedValue({
            password: mockHashedPassword,
            isActivated: false,
        });
        bcrypt.compare.mockResolvedValue(true);

        await expect(
            userService.login(mockEmail, mockPassword)
        ).rejects.toThrow("Please activate your account via email");
    });

    it("should not send reset mail if user not found", async () => {
        UserModel.findOne.mockResolvedValue(null);

        await userService.forgotPassword("notfound@example.com");

        expect(tokenService.generateResetToken).not.toHaveBeenCalled();
        expect(mailService.sendPasswordResetMail).not.toHaveBeenCalled();
    });

    it("should generate reset token and send reset email", async () => {
        const mockUser = { _id: "user-id", email: mockEmail };

        UserModel.findOne.mockResolvedValue(mockUser);

        const resetToken = "reset-token";
        tokenService.generateResetToken.mockReturnValue(resetToken);
        tokenService.saveResetToken.mockResolvedValue();
        mailService.sendPasswordResetMail.mockResolvedValue();

        await userService.forgotPassword(mockEmail);

        expect(tokenService.generateResetToken).toHaveBeenCalledWith({
            email: mockUser.email,
            id: mockUser._id,
        });
        expect(tokenService.saveResetToken).toHaveBeenCalledWith(
            mockUser._id,
            resetToken
        );
        expect(mailService.sendPasswordResetMail).toHaveBeenCalledWith(
            mockEmail,
            resetToken
        );
    });

    it("should throw if reset token is invalid", async () => {
        tokenService.validateResetToken.mockReturnValue(null);

        await expect(
            userService.resetPassword("bad-token", "newpass")
        ).rejects.toThrow("Invalid or expired reset token");
    });

    it("should throw if reset token not found in DB", async () => {
        tokenService.validateResetToken.mockReturnValue({ id: "user-id" });
        tokenService.findResetToken.mockResolvedValue(null);

        await expect(
            userService.resetPassword("expired-token", "newpass")
        ).rejects.toThrow("Invalid or expired reset token");
    });

    it("should throw if user not found", async () => {
        tokenService.validateResetToken.mockReturnValue({ id: "user-id" });
        tokenService.findResetToken.mockResolvedValue(true);
        UserModel.findById.mockResolvedValue(null);

        await expect(
            userService.resetPassword("token", "newpass")
        ).rejects.toThrow("User not found");
    });

    it("should update user password and remove reset token", async () => {
        const mockUser = { password: "old", save: jest.fn() };

        tokenService.validateResetToken.mockReturnValue({ id: "user-id" });
        tokenService.findResetToken.mockResolvedValue(true);
        UserModel.findById.mockResolvedValue(mockUser);
        bcrypt.hash.mockResolvedValue("new-hash");
        tokenService.removeResetToken.mockResolvedValue();

        await userService.resetPassword("valid-token", "newpass");

        expect(mockUser.password).toBe("new-hash");
        expect(mockUser.save).toHaveBeenCalled();
        expect(tokenService.removeResetToken).toHaveBeenCalledWith(
            "valid-token"
        );
    });

    it("should remove token on logout", async () => {
        tokenService.removeToken.mockResolvedValue("some-token");

        const result = await userService.logout("refresh-token");

        expect(tokenService.removeToken).toHaveBeenCalledWith("refresh-token");
        expect(result).toBe("some-token");
    });

    it("should throw if no refresh token provided", async () => {
        await expect(userService.refresh(null)).rejects.toThrow(
            "User is not authorized"
        );
    });

    it("should throw if token is invalid or not found in DB", async () => {
        tokenService.validateRefreshToken.mockReturnValue(null);
        tokenService.findToken.mockResolvedValue(null);

        await expect(userService.refresh("some-token")).rejects.toThrow(
            "User is not authorized"
        );
    });

    it("should return new tokens if refresh token is valid", async () => {
        const userData = { id: "user-id" };
        const mockUser = {
            _id: "user-id",
            email: mockEmail,
            isActivated: true,
        };

        tokenService.validateRefreshToken.mockReturnValue(userData);
        tokenService.findToken.mockResolvedValue(true);
        UserModel.findById.mockResolvedValue(mockUser);
        tokenService.generateTokens.mockReturnValue(mockTokens);
        tokenService.saveToken.mockResolvedValue();

        const result = await userService.refresh("valid-refresh-token");

        expect(result).toEqual({
            ...mockTokens,
            user: {
                id: "user-id",
                email: mockEmail,
                isActivated: true,
            },
        });
    });

    it("should return all users", async () => {
        const users = [{ email: "user1" }, { email: "user2" }];

        UserModel.find.mockResolvedValue(users);

        const result = await userService.getAllUsers();

        expect(result).toEqual(users);
    });
});
