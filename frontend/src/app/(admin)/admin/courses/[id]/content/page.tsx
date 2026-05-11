'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Video, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft,
  Loader2,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  content?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
}

export default function CourseContentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลเนื้อหาได้');
      router.push('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      await api.post(`/courses/${id}/modules`, { title: newModuleTitle, order: course?.modules.length || 0 });
      setNewModuleTitle('');
      setAddingModule(false);
      fetchCourse();
      toast.success('เพิ่มหมวดหมู่บทเรียนสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถเพิ่มหมวดหมู่ได้');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? บทเรียนภายในจะถูกลบทั้งหมด')) return;
    try {
      await api.delete(`/courses/modules/${moduleId}`);
      fetchCourse();
      toast.success('ลบหมวดหมู่สำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถลบหมวดหมู่ได้');
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    const title = prompt('ชื่อบทเรียนใหม่:');
    if (!title) return;
    try {
      await api.post(`/courses/modules/${moduleId}/lessons`, { 
        title, 
        order: 0,
        content: '',
        videoUrl: ''
      });
      fetchCourse();
      toast.success('เพิ่มบทเรียนสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถเพิ่มบทเรียนได้');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('ต้องการลบบทเรียนนี้หรือไม่?')) return;
    try {
      await api.delete(`/courses/lessons/${lessonId}`);
      fetchCourse();
      toast.success('ลบบทเรียนสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถลบบทเรียนได้');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses" className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 line-clamp-1">{course?.title}</h1>
            <p className="text-slate-500 text-sm">จัดการหมวดหมู่และบทเรียนทั้งหมดในคอร์สนี้</p>
          </div>
        </div>
        <button 
          onClick={() => setAddingModule(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus className="w-5 h-5" /> เพิ่มหมวดหมู่ใหม่
        </button>
      </div>

      {/* Add Module Inline Form */}
      {addingModule && (
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-xl shadow-blue-50 mb-6 flex gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <input 
            type="text" 
            placeholder="ตั้งชื่อหมวดหมู่บทเรียน เช่น บทนำ, พื้นฐานการเขียนโปรแกรม..."
            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            autoFocus
          />
          <button 
            onClick={handleAddModule}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
          >
            บันทึก
          </button>
          <button 
            onClick={() => setAddingModule(false)}
            className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200"
          >
            ยกเลิก
          </button>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-6">
        {course?.modules.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <BookOpen className="w-10 h-10" />
            </div>
            <p className="text-slate-500 font-medium">ยังไม่มีบทเรียนในคอร์สนี้ เริ่มต้นโดยการเพิ่มหมวดหมู่ใหม่</p>
          </div>
        ) : (
          course?.modules.map((module, mIdx) => (
            <div key={module.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm">
                    {mIdx + 1}
                  </div>
                  <h3 className="font-bold text-slate-800">{module.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAddLesson(module.id)}
                    className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-white border border-blue-100 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> เพิ่มเนื้อหา
                  </button>
                  <button 
                    onClick={() => handleDeleteModule(module.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {module.lessons.map((lesson, lIdx) => (
                  <div key={lesson.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{lesson.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <Video className="w-3 h-3" /> Video
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 text-slate-300 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
