import express from 'express';
import {
    createForm,
    getFormByOpeningId,
    getFormById,
    updateForm,
    deleteForm,
} from '../controllers/form.controller.js';
import { validateCreateForm } from '../middlewares/validation.js';
import { authenticate, authorize, isOwnerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/opening/:openingId', getFormByOpeningId);

// Protected routes
router.post('/', authenticate, authorize('ADMIN', 'LEADER'), validateCreateForm, createForm);
router.get('/:id', authenticate, authorize('ADMIN', 'LEADER'), getFormById);
router.put('/:id', authenticate, authorize('ADMIN', 'LEADER'), isOwnerOrAdmin, updateForm);
router.delete('/:id', authenticate, authorize('ADMIN', 'LEADER'), isOwnerOrAdmin, deleteForm);

export default router;
