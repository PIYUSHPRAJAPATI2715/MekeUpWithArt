import express from 'express';
import { getUsers, getUserById, toggleUserStatus } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/toggle-status', toggleUserStatus);

export default router;
