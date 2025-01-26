import { Router } from "express";
import { getAllStats } from "../controllers/stats.controller.js";
import {
  protectedRoutes,
  requireAdmin,
} from "../middleware/auth.middleware.js";
const router = Router();
router.get("/", protectedRoutes, requireAdmin, getAllStats);
export default router;
