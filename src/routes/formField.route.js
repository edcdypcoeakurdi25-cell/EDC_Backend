import express from 'express';
import {
    addFormField,
    updateFormField,
    deleteFormField,
    reorderFormFields,
} from '../controllers/formField.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('ADMIN', 'LEADER'), addFormField);
router.put('/:id', authenticate, authorize('ADMIN', 'LEADER'), updateFormField);
router.delete('/:id', authenticate, authorize('ADMIN', 'LEADER'), deleteFormField);
router.patch('/reorder', authenticate, authorize('ADMIN', 'LEADER'), reorderFormFields);

export default router;
