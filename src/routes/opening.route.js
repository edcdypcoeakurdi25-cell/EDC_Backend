import express from 'express';
import {
    createOpening,
    getAllOpenings,
    getOpeningById,
    getOpeningDetails,
    updateOpening,
    deleteOpening,
    toggleOpeningStatus,
    getOpeningStats,
} from '../controllers/opening.controller.js';

import { validateCreateOpening } from '../middlewares/validation.js';
import { authenticate, authorize, isOwnerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public routes

router.get('/', getAllOpenings);

// Protected routes for ADMIN and LEADER

router.get('/:id/details', authenticate, authorize('ADMIN', 'LEADER'), getOpeningDetails);
router.get('/:id/stats', authenticate, authorize('ADMIN', 'LEADER'), getOpeningStats);

// Public route (students)
router.get('/:id', getOpeningById);

// Protected routes
router.post('/', authenticate, authorize('ADMIN', 'LEADER'), validateCreateOpening, createOpening);

router.put('/:id', authenticate, authorize('ADMIN', 'LEADER'), isOwnerOrAdmin, updateOpening);

router.delete('/:id', authenticate, authorize('ADMIN', 'LEADER'), isOwnerOrAdmin, deleteOpening);

router.patch(
    '/:id/toggle-status',
    authenticate,
    authorize('ADMIN', 'LEADER'),
    isOwnerOrAdmin,
    toggleOpeningStatus
);

export default router;
