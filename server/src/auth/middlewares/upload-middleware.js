import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import AVATARS_DIR from "../config/uploadPaths.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, AVATARS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
};

const uploadAvatarMiddleware = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter,
});

export default uploadAvatarMiddleware;
