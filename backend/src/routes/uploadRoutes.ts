import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, authorize(['ADMIN']), upload.single('file'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'กรุณาเลือกไฟล์' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
