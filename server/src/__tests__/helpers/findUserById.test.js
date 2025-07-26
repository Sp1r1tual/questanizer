import { jest } from "@jest/globals";

jest.unstable_mockModule("../../user/models/user-model.js", () => ({
    default: {
        findById: jest.fn(),
    },
}));

jest.unstable_mockModule("../../shared/exceptions/api-error.js", () => ({
    default: {
        BadRequest: jest.fn(),
    },
}));

const UserModel = (await import("../../user/models/user-model.js")).default;
const ApiError = (await import("../../shared/exceptions/api-error.js")).default;
const { findUserById } = await import("../../shared/helpers/findUserById.js");

describe("findUserById", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns user when found", async () => {
        const mockUser = { _id: "123", username: "testuser" };

        UserModel.findById.mockResolvedValue(mockUser);

        const result = await findUserById("123");

        expect(UserModel.findById).toHaveBeenCalledWith("123");
        expect(result).toEqual(mockUser);
    });

    it("throws ApiError with default message when user not found", async () => {
        const mockError = new Error("User not found");

        UserModel.findById.mockResolvedValue(null);
        ApiError.BadRequest.mockReturnValue(mockError);

        await expect(findUserById("nonexistent")).rejects.toThrow();

        expect(UserModel.findById).toHaveBeenCalledWith("nonexistent");
        expect(ApiError.BadRequest).toHaveBeenCalledWith("User not found");
    });

    it("throws ApiError with custom message when user not found", async () => {
        const customMessage = "Custom error message";
        const mockError = new Error(customMessage);

        UserModel.findById.mockResolvedValue(null);
        ApiError.BadRequest.mockReturnValue(mockError);

        await expect(
            findUserById("nonexistent", customMessage)
        ).rejects.toThrow();

        expect(ApiError.BadRequest).toHaveBeenCalledWith(customMessage);
    });

    it("handles database errors", async () => {
        const dbError = new Error("Database connection failed");

        UserModel.findById.mockRejectedValue(dbError);

        await expect(findUserById("123")).rejects.toThrow(
            "Database connection failed"
        );
        expect(UserModel.findById).toHaveBeenCalledWith("123");
    });
});
