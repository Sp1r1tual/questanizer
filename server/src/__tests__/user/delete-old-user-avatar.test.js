import { jest } from "@jest/globals";
import path from "path";

jest.unstable_mockModule("fs/promises", () => ({
    __esModule: true,
    default: {
        unlink: jest.fn(),
    },
}));

const fs = (await import("fs/promises")).default;
const deleteOldAvatarIfNeeded = (
    await import("../../user/helpers/delete-old-user-avatar.js")
).default;

describe("deleteOldAvatarIfNeeded", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete old avatar if path is valid and different", async () => {
        const oldPath = "/public/avatars/old.png";
        const newPath = "/public/avatars/new.png";
        const expectedPath = path.resolve("public", "avatars", "old.png");

        await deleteOldAvatarIfNeeded(oldPath, newPath);

        expect(fs.unlink).toHaveBeenCalledWith(expectedPath);
    });

    it("should not delete if old and new paths are the same", async () => {
        const pathStr = "/public/avatars/same.png";

        await deleteOldAvatarIfNeeded(pathStr, pathStr);

        expect(fs.unlink).not.toHaveBeenCalled();
    });

    it("should not delete if old path is missing", async () => {
        await deleteOldAvatarIfNeeded(null, "/public/avatars/new.png");

        expect(fs.unlink).not.toHaveBeenCalled();
    });

    it("should not delete if old path is outside avatars directory", async () => {
        const oldPath = "/uploads/somewhere.png";
        const newPath = "/public/avatars/next.png";

        await deleteOldAvatarIfNeeded(oldPath, newPath);

        expect(fs.unlink).not.toHaveBeenCalled();
    });

    it("should handle unlink errors gracefully", async () => {
        const oldPath = "/public/avatars/missing.png";
        const newPath = "/public/avatars/other.png";

        fs.unlink.mockRejectedValue(new Error("File not found"));

        await deleteOldAvatarIfNeeded(oldPath, newPath);

        expect(fs.unlink).toHaveBeenCalled();
    });
});
