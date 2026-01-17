import express from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import formRoutes from './form.route.js';
import uploadRoutes from './upload.route.js';
import openingRoutes from './opening.route.js';
import analysisRoutes from './analysis.route.js';
import formFieldRoutes from './formField.route.js';
import applicationRoutes from './application.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/openings', openingRoutes);
router.use('/forms', formRoutes);
router.use('/form-fields', formFieldRoutes);
router.use('/applications', applicationRoutes);
router.use('/applications/analysis', analysisRoutes);
router.use('/upload', uploadRoutes);

export default router;
