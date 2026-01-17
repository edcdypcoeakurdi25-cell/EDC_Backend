import multer from 'multer';
import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { uploadFile, deleteFile } from '../controllers/upload.controller.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', upload.single('file'), uploadFile);
router.delete('/:fileId', authenticate, authorize('ADMIN'), deleteFile);

export default router;
