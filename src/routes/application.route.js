import express from 'express';
import {
    submitApplication,
    getAllApplications,
    getApplicationById,
    getApplicationsByOpening,
    deleteApplication,
} from '../controllers/application.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateSubmitApplication } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.post('/', validateSubmitApplication, submitApplication);

// Protected routes
router.get('/', authenticate, authorize('ADMIN', 'LEADER'), getAllApplications);
router.get('/:id', authenticate, authorize('ADMIN', 'LEADER'), getApplicationById);
router.get(
    '/opening/:openingId',
    authenticate,
    authorize('ADMIN', 'LEADER'),
    getApplicationsByOpening
);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteApplication);

export default router;
