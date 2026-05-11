import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { modules: true, enrollments: true }
        }
      }
    });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// Create a new course (Admin only)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, price, thumbnail, seoTitle, seoDescription } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        thumbnail,
        seoTitle,
        seoDescription
      }
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

// Update course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, seoTitle, seoDescription } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        thumbnail,
        seoTitle,
        seoDescription
      }
    });

    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Failed to update course' });
  }
};

// Delete course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
};
