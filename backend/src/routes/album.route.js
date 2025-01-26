import { Router } from 'express';
import { getAllAlbums, getAlbumById } from "../controllers/album.controller.js";
const router = Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);

export default router;