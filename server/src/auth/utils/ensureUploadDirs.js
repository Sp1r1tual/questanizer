import fs from "fs";
import AVATARS_DIR from "../config/uploadPaths.js";

const ensureUploadDirs = () => {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
};

export default ensureUploadDirs;
