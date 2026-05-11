'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen,
  Loader2,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import CourseModal from '@/components/admin/CourseModal';
import ContentModal from '@/components/admin/ContentModal';

interface Course {
  id: string;
  title: string;
  price: number;
  thumbnail: string | null;
  _count?: {
    enrollments: number;
    modules: number;
  };
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Fetch courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCourseId(null);
    setIsCourseModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedCourseId(id);
    setIsCourseModalOpen(true);
  };

  const handleManageContent = (id: string, title: string) => {
    setSelectedCourseId(id);
    setSelectedCourseTitle(title);
    setIsContentModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้? ข้อมูลบทเรียนทั้งหมดจะหายไป')) return;
    const toastId = toast.loading('กำลังลบคอร์ส...');
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c.id !== id));
      toast.success('ลบคอร์สสำเร็จ!', { id: toastId });
    } catch (error) {
      toast.error('ไม่สามารถลบคอร์สได้', { id: toastId });
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">จัดการคอร์สเรียน</h1>
          <p className="text-slate-500 mt-1 font-medium">จัดการเนื้อหา ราคา และข้อมูล SEO ทั้งหมดในที่เดียว</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 text-white px-8 py-4 rounded-[24px] font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> สร้างคอร์สใหม่
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-[24px] border border-slate-100 flex items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อคอร์สเรียนของคุณ..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Course List/Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">กำลังโหลดข้อมูล...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <BookOpen className="w-10 h-10" />
            </div>
            <p className="text-slate-400 font-bold">ไม่พบข้อมูลคอร์สเรียน</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">คอร์ส</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">บทเรียน</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">นักเรียน</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">ราคา</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[20px] bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/50 shadow-sm">
                          {course.thumbnail ? (
                            <img 
                              src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${course.thumbnail}` : `http://localhost:5001${course.thumbnail}`} 
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <BookOpen className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <span className="font-bold text-slate-800 text-lg line-clamp-1">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                        {course._count?.modules || 0} Modules
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-slate-500 font-medium">{course._count?.enrollments || 0} Enrollments</span>
                    </td>
                    <td className="px-6 py-6 font-black text-blue-600 text-lg">฿{course.price.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleManageContent(course.id, course.title)}
                          className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                          title="จัดการเนื้อหา"
                        >
                          <BookOpen className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(course.id)}
                          className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                          title="แก้ไขคอร์ส"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                          title="ลบคอร์ส"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CourseModal 
        isOpen={isCourseModalOpen}
        courseId={selectedCourseId}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={fetchCourses}
      />

      <ContentModal 
        isOpen={isContentModalOpen}
        courseId={selectedCourseId}
        courseTitle={selectedCourseTitle}
        onClose={() => setIsContentModalOpen(false)}
      />
    </div>
  );
}
