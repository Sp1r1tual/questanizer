import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { AVATARS_DIR } from "../configs/uploadPaths.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, AVATARS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        cb(null, uuidv4() + ext);
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

const uploadAvatarMiddleware = (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
        if (!err) return next();

        if (!(err instanceof multer.MulterError)) {
            return next(err);
        }

        if (err.code === "LIMIT_FILE_SIZE") {
            return next(
                ApiError.PayloadTooLarge("File size exceeds 2MB limit")
            );
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return next(ApiError.BadRequest("Unexpected file field"));
        }

        return next(ApiError.BadRequest(`Upload error: ${err.message}`));
    });
};

export { uploadAvatarMiddleware };
