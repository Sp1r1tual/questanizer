import { v2 as cloudinary } from "cloudinary";

const deleteOldAvatarIfNeeded = async (oldAvatarUrl, newAvatarUrl) => {
  if (!oldAvatarUrl || oldAvatarUrl === newAvatarUrl) return;
  if (!oldAvatarUrl.includes("res.cloudinary.com")) return;

  const publicId = extractPublicId(oldAvatarUrl);

  await cloudinary.uploader.destroy(publicId);
};

const extractPublicId = (url) => {
  try {
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/upload/");

    if (parts.length < 2) return null;

    let pathAndFile = parts[1];

    pathAndFile = pathAndFile.replace(/^v\d+\//, "");

    const segments = pathAndFile.split(".");
    segments.pop();

    return segments.join(".");
  } catch {
    return null;
  }
};

export { deleteOldAvatarIfNeeded };
