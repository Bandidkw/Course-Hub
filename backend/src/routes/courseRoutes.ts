import express from 'express';
import { 
  getCourses, 
  createCourse, 
  updateCourse,
  deleteCourse,
  getCourseWithModules,
  createModule,
  createLesson,
  deleteModule,
  deleteLesson
} from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Student routes
router.get('/', getCourses);
router.get('/:id', getCourseWithModules);

// Admin routes
router.post('/', authenticate, authorize(['ADMIN']), createCourse);
router.put('/:id', authenticate, authorize(['ADMIN']), updateCourse);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteCourse);

// Module & Lesson management (Admin only)
router.post('/:courseId/modules', authenticate, authorize(['ADMIN']), createModule);
router.delete('/modules/:id', authenticate, authorize(['ADMIN']), deleteModule);

router.post('/modules/:moduleId/lessons', authenticate, authorize(['ADMIN']), createLesson);
router.delete('/lessons/:id', authenticate, authorize(['ADMIN']), deleteLesson);

export default router;
