import { Router } from 'express';
import { protectedRoutes } from '../middleware/auth.middleware.js';
import { getAllUsers, getMessages } from '../controllers/users.controller.js';
const router = Router();
router.get('/', protectedRoutes, getAllUsers);
router.get('/messages/:userId', protectedRoutes,getMessages)
export default router;