import { Router } from "express";

import { getFaqs } from "../controllers/support-controller.js";

const supportRouter = new Router();

supportRouter.get("/faqs", getFaqs);

export { supportRouter };
