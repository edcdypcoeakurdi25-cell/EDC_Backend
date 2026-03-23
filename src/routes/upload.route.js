import multer from 'multer';
import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { uploadFile, deleteFile } from '../controllers/upload.controller.js';

import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post('/', upload.single('file'), uploadFile);
router.delete('/:fileId', authenticate, authorize('ADMIN'), deleteFile);

export default router;
