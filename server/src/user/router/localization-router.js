import { Router } from "express";

import {
    getUserLanguage,
    changeUserLanguage,
} from "../controllers/localization-controller.js";

import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";
import { validateLanguageMiddleware } from "../middlewares/validate-localization-middleware.js";

const localizationRouter = new Router();

localizationRouter.get("/language", authMiddleware, getUserLanguage);

localizationRouter.post(
    "/language/change",
    authMiddleware,
    validateLanguageMiddleware,
    changeUserLanguage
);

export { localizationRouter };
