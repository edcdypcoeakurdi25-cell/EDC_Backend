import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { validateLogin } from '../middlewares/validation.js';
import { login, logout, getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
