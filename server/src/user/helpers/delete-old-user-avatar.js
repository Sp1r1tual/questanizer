import fs from "fs/promises";
import path from "path";

const deleteOldAvatarIfNeeded = async (oldAvatarPath, newAvatarPath) => {
  if (
    oldAvatarPath &&
    newAvatarPath &&
    oldAvatarPath !== newAvatarPath &&
    oldAvatarPath.startsWith("/public/avatars/")
  ) {
    const absoluteOldPath = path.resolve("public", "avatars", path.basename(oldAvatarPath));

    try {
      await fs.access(absoluteOldPath);
      await fs.unlink(absoluteOldPath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
};

export { deleteOldAvatarIfNeeded };
