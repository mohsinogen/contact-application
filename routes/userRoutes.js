import express from 'express';
import { registerUser, loginUser, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).put(protect, updateUserProfile);
router.route('/login').post(loginUser);

export default router;