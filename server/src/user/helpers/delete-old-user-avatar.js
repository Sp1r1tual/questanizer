import fs from "fs/promises";
import path from "path";

const deleteOldAvatarIfNeeded = async (oldAvatarPath, newAvatarPath) => {
    try {
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

            await fs.unlink(absoluteOldPath);
        }
    } catch (error) {
        console.warn("Unable to delete old avatar:", error.message);
    }
};

export { deleteOldAvatarIfNeeded };
