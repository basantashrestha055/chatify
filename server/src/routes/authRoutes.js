import express from 'express';
import {
  login,
  logout,
  signup,
  updateProfile,
} from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import { arcjetProtection } from '../middleware/arcjetMiddleware.js';

const router = express.Router();

router.use(arcjetProtection);

router.get('/test', (req, res) => res.send('test'));
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/check', protectRoute, (req, res) =>
  res.status(200).json(req.user)
);

router.put('/update-profile', protectRoute, updateProfile);

export default router;
