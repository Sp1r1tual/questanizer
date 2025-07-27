import fs from "fs/promises";
import path from "path";

const deleteOldAvatarIfNeeded = async (oldAvatarPath, newAvatarPath) => {
    if (
        oldAvatarPath &&
        newAvatarPath &&
        oldAvatarPath !== newAvatarPath &&
        oldAvatarPath.startsWith("/public/avatars/")
    ) {
        const absoluteOldPath = path.resolve(
            "public",
            "avatars",
            path.basename(oldAvatarPath)
        );

        try {
            await fs.unlink(absoluteOldPath);
            console.log("Old avatar deleted:", absoluteOldPath);
        } catch (err) {
            console.warn("Unable to delete old avatar:", err.message);
        }
    }
};

export { deleteOldAvatarIfNeeded };
