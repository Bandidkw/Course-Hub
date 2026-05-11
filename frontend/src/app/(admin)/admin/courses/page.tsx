'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Loader2
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  price: number;
  _count?: {
    enrollments: number;
    modules: number;
  };
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      alert('ไม่สามารถลบคอร์สได้');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการคอร์สเรียน</h1>
          <p className="text-gray-500 mt-1">จัดการเนื้อหา ราคา และข้อมูล SEO ของคุณ</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer">
          <Plus className="w-5 h-5" /> สร้างคอร์สใหม่
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อคอร์ส..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลคอร์ส...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-20 text-center text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>ไม่พบข้อมูลคอร์สเรียน</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-sm font-bold text-gray-900">คอร์ส</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-900">บทเรียน</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-900">นักเรียน</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-900">ราคา</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-900 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-bold text-gray-900 line-clamp-1">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600">{course._count?.modules || 0} บท</td>
                    <td className="px-6 py-5 text-gray-600">{course._count?.enrollments || 0} คน</td>
                    <td className="px-6 py-5 font-bold text-blue-600">฿{course.price.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
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
    </div>
  );
}
