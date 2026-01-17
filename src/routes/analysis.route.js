import express from 'express';
import {
    getSummaryView,
    getQuestionView,
    getIndividualView,
    exportApplicationsCSV,
    getDashboardStats,
    getMyOpenings
} from '../controllers/applicatonAnalysis.controller.js';
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
router.get('/stats', authenticate, authorize('ADMIN', 'LEADER'), getDashboardStats);
router.get('/my-openings', authenticate, authorize('ADMIN', 'LEADER'), getMyOpenings);

export default router;
