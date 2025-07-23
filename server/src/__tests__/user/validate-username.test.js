import { jest } from "@jest/globals";

jest.unstable_mockModule("../../user/models/user-model.js", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    },
}));

const UserModel = (await import("../../user/models/user-model.js")).default;

const validateUsername = (
    await import("../../user/helpers/validate-username.js")
).default;

describe("validateUsername", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should not throw if newUsername is not provided", async () => {
        await expect(
            validateUsername(undefined, "current")
        ).resolves.toBeUndefined();
    });

    it("should not throw if newUsername equals currentUsername", async () => {
        await expect(validateUsername("same", "same")).resolves.toBeUndefined();
    });

    it("should throw if username already exists", async () => {
        UserModel.findOne.mockResolvedValue({ username: "taken" });

        await expect(validateUsername("taken", "current")).rejects.toThrow(
            "This username is already taken"
        );
    });

    it("should resolve if username is unique", async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(
            validateUsername("unique", "current")
        ).resolves.toBeUndefined();
        expect(UserModel.findOne).toHaveBeenCalledWith({ username: "unique" });
    });
});
