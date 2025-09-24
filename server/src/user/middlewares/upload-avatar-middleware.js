import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { cloudinary } from "../../shared/configs/cloudinary.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(ApiError.BadRequest("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

const uploadAvatarMiddleware = upload.single("photo");

export { uploadAvatarMiddleware };
