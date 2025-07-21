import { jest } from "@jest/globals";

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: {
        sign: jest.fn(),
        verify: jest.fn(),
    },
}));

jest.unstable_mockModule("../../../auth/models/token-model.js", () => ({
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        deleteOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../../../auth/models/reset-token-model.js", () => ({
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        deleteOne: jest.fn(),
    },
}));

const tokenService = (await import("../../../auth/services/token-service.js"))
    .default;

const jwt = (await import("jsonwebtoken")).default;

const tokenModel = (await import("../../../auth/models/token-model.js"))
    .default;

const resetTokenModel = (
    await import("../../../auth/models/reset-token-model.js")
).default;

describe("TokenService", () => {
    const payload = { id: "user123" };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_ACCESS_SECRET = "access_secret";
        process.env.JWT_REFRESH_SECRET = "refresh_secret";
        process.env.JWT_RESET_SECRET = "reset_secret";
    });

    describe("generateTokens", () => {
        it("should generate access and refresh tokens", () => {
            jwt.sign.mockImplementation(
                (p, secret, options) => `${secret}-${options.expiresIn}`
            );

            const tokens = tokenService.generateTokens(payload);

            expect(tokens).toEqual({
                accessToken: "access_secret-15m",
                refreshToken: "refresh_secret-30d",
            });
        });
    });

    describe("generateResetToken", () => {
        it("should generate reset token", () => {
            jwt.sign.mockReturnValue("reset_token");

            const token = tokenService.generateResetToken(payload);

            expect(token).toBe("reset_token");
        });
    });

    describe("saveToken", () => {
        it("updates existing token", async () => {
            const mockToken = { refreshToken: "", save: jest.fn() };

            tokenModel.findOne.mockResolvedValue(mockToken);

            await tokenService.saveToken("userId", "new_token");

            expect(mockToken.refreshToken).toBe("new_token");
            expect(mockToken.save).toHaveBeenCalled();
        });

        it("creates new token if none exists", async () => {
            tokenModel.findOne.mockResolvedValue(null);
            tokenModel.create.mockResolvedValue({
                user: "userId",
                refreshToken: "new_token",
            });

            const result = await tokenService.saveToken("userId", "new_token");

            expect(tokenModel.create).toHaveBeenCalledWith({
                user: "userId",
                refreshToken: "new_token",
            });
            expect(result).toEqual({
                user: "userId",
                refreshToken: "new_token",
            });
        });
    });

    describe("saveResetToken", () => {
        it("creates reset token", async () => {
            resetTokenModel.create.mockResolvedValue({
                user: "userId",
                resetToken: "token",
            });

            const result = await tokenService.saveResetToken("userId", "token");

            expect(result).toEqual({ user: "userId", resetToken: "token" });
        });
    });

    describe("removeToken / removeResetToken", () => {
        it("removes refresh token", async () => {
            tokenModel.deleteOne.mockResolvedValue({ acknowledged: true });

            const result = await tokenService.removeToken("refresh");

            expect(result).toEqual({ acknowledged: true });
        });

        it("removes reset token", async () => {
            resetTokenModel.deleteOne.mockResolvedValue({ acknowledged: true });

            const result = await tokenService.removeResetToken("reset");

            expect(result).toEqual({ acknowledged: true });
        });
    });

    describe("validate tokens", () => {
        it("validates access token", () => {
            jwt.verify.mockReturnValue(payload);

            const result = tokenService.validateAccessToken("access_token");

            expect(result).toBe(payload);
            expect(jwt.verify).toHaveBeenCalledWith(
                "access_token",
                "access_secret"
            );
        });

        it("returns null if access token invalid", () => {
            jwt.verify.mockImplementation(() => {
                throw new Error();
            });

            const result = tokenService.validateAccessToken("bad_token");

            expect(result).toBeNull();
        });

        it("validates refresh token", () => {
            jwt.verify.mockReturnValue(payload);

            const result = tokenService.validateRefreshToken("refresh_token");

            expect(result).toBe(payload);
            expect(jwt.verify).toHaveBeenCalledWith(
                "refresh_token",
                "refresh_secret"
            );
        });

        it("validates reset token", () => {
            jwt.verify.mockReturnValue(payload);

            const result = tokenService.validateResetToken("reset_token");

            expect(result).toBe(payload);
            expect(jwt.verify).toHaveBeenCalledWith(
                "reset_token",
                "reset_secret"
            );
        });

        it("returns null if refresh token invalid", () => {
            jwt.verify.mockImplementation(() => {
                throw new Error("Invalid refresh");
            });

            const result =
                tokenService.validateRefreshToken("bad_refresh_token");

            expect(result).toBeNull();
        });
    });

    describe("findToken / findResetToken", () => {
        it("finds refresh token", async () => {
            const tokenData = { user: "userId", refreshToken: "t" };

            tokenModel.findOne.mockResolvedValue(tokenData);

            const result = await tokenService.findToken("t");

            expect(result).toBe(tokenData);
        });

        it("finds reset token", async () => {
            const tokenData = { user: "userId", resetToken: "rt" };

            resetTokenModel.findOne.mockResolvedValue(tokenData);

            const result = await tokenService.findResetToken("rt");

            expect(result).toBe(tokenData);
        });

        it("returns null if reset token invalid", () => {
            jwt.verify.mockImplementation(() => {
                throw new Error("Invalid reset");
            });

            const result = tokenService.validateResetToken("bad_reset_token");

            expect(result).toBeNull();
        });
    });
});
