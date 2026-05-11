import { Router } from 'express';
import { 
  getAllCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from '../controllers/courseController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllCourses);

// Admin only routes
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

export default router;
