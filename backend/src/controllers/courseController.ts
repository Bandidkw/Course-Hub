import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

// --- Course Management ---

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { modules: true, enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, price, thumbnail, metaTitle, metaDescription } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        thumbnail,
        seoTitle: metaTitle,
        seoDescription: metaDescription
      },
    });
    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, metaTitle, metaDescription } = req.body;
    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price,
        thumbnail,
        seoTitle: metaTitle,
        seoDescription: metaDescription
      },
    });
    res.json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// --- Module & Lesson Management ---

export const getCourseWithModules = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' }
        }
      }
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching course details', error: error.message });
  }
};

export const createModule = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { title, order } = req.body;
    const module = await prisma.module.create({
      data: { title, order: order || 0, courseId }
    });
    res.status(201).json(module);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating module', error: error.message });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { title, content, videoUrl, order } = req.body;
    const lesson = await prisma.lesson.create({
      data: { title, content, videoUrl, order: order || 0, moduleId }
    });
    res.status(201).json(lesson);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.module.delete({ where: { id } });
    res.json({ message: 'Module deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting module', error: error.message });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lesson.delete({ where: { id } });
    res.json({ message: 'Lesson deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
};
