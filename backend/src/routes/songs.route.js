import { Router } from "express";
import {
  protectedRoutes,
  requireAdmin,
} from "../middleware/auth.middleware.js";
import {
    featuredSongs,
  getAllSongs,
  madeForYouSongs,
  trendingSongs,
} from "../controllers/song.controller.js";
const router = Router();
router.get("/", protectedRoutes, requireAdmin, getAllSongs);
router.get("/featured", featuredSongs);
router.get("/made-for-you", madeForYouSongs);
router.get("/trending", trendingSongs);
export default router;
