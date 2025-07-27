import { Router } from "express";

import supportController from "../controllers/support-controller.js";

const router = new Router();

router.get("/faqs", supportController.getFaqs);

export default router;
