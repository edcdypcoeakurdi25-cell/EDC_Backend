import express from 'express';
import {
    getSummaryView,
    getQuestionView,
    getIndividualView,
    exportApplicationsCSV,
} from '../controllers/applicationAnalysis.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:openingId/summary', authenticate, authorize('ADMIN', 'LEADER'), getSummaryView);
router.get('/:openingId/questions', authenticate, authorize('ADMIN', 'LEADER'), getQuestionView);
router.get(
    '/:openingId/individual/:applicationId',
    authenticate,
    authorize('ADMIN', 'LEADER'),
    getIndividualView
);
router.get('/:openingId/export', authenticate, authorize('ADMIN', 'LEADER'), exportApplicationsCSV);

export default router;
