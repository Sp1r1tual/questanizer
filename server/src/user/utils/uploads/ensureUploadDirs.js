import fs from "fs";
import { AVATARS_DIR } from "../../configs/uploadPaths.js";

const ensureUploadDirs = () => {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
};

export { ensureUploadDirs };
