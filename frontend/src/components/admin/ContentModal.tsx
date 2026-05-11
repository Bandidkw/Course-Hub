'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  Video, 
  X,
  Loader2,
  BookOpen,
  ChevronRight
} from 'lucide-react';

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

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | null;
  courseTitle: string | null;
}

export default function ContentModal({ isOpen, onClose, courseId, courseTitle }: ContentModalProps) {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  useEffect(() => {
    if (isOpen && courseId) {
      fetchContent();
    }
  }, [isOpen, courseId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${courseId}`);
      setModules(response.data.modules || []);
    } catch (error) {
      toast.error('ไม่สามารถโหลดเนื้อหาได้');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      await api.post(`/courses/${courseId}/modules`, { title: newModuleTitle, order: modules.length });
      setNewModuleTitle('');
      setAddingModule(false);
      fetchContent();
      toast.success('เพิ่มหมวดหมู่สำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถเพิ่มหมวดหมู่ได้');
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('ยืนยันการลบหมวดหมู่และบทเรียนทั้งหมดภายใน?')) return;
    try {
      await api.delete(`/courses/modules/${id}`);
      fetchContent();
      toast.success('ลบหมวดหมู่สำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถลบได้');
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    const title = prompt('ชื่อบทเรียนใหม่:');
    if (!title) return;
    try {
      await api.post(`/courses/modules/${moduleId}/lessons`, { title, order: 0 });
      fetchContent();
      toast.success('เพิ่มบทเรียนสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถเพิ่มบทเรียนได้');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('ยืนยันการลบบทเรียน?')) return;
    try {
      await api.delete(`/courses/lessons/${id}`);
      fetchContent();
      toast.success('ลบบทเรียนสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถลบได้');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 line-clamp-1">{courseTitle}</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">จัดการหมวดหมู่และเนื้อหา</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-300">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          ) : (
            <>
              {/* Add Module Button/Form */}
              {!addingModule ? (
                <button 
                  onClick={() => setAddingModule(true)}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-blue-200 hover:text-blue-600 transition-all group"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  เพิ่มหมวดหมู่ใหม่
                </button>
              ) : (
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex flex-col gap-4 animate-in zoom-in duration-200">
                  <input 
                    type="text" 
                    placeholder="ระบุชื่อหมวดหมู่..."
                    className="w-full px-5 py-3 bg-white border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddModule} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700">บันทึก</button>
                    <button onClick={() => setAddingModule(false)} className="px-6 py-2.5 bg-white border border-blue-100 text-slate-500 rounded-xl font-bold hover:bg-slate-50">ยกเลิก</button>
                  </div>
                </div>
              )}

              {/* Modules List */}
              <div className="space-y-4">
                {modules.length === 0 && !addingModule && (
                  <div className="py-20 text-center text-slate-300">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">ยังไม่มีเนื้อหา</p>
                  </div>
                )}
                {modules.map((module, mIdx) => (
                  <div key={module.id} className="bg-slate-50/30 rounded-[32px] border border-slate-100 overflow-hidden group/mod">
                    <div className="p-6 flex items-center justify-between border-b border-slate-50 group-hover/mod:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-300">0{mIdx + 1}</span>
                        <h4 className="font-bold text-slate-800">{module.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAddLesson(module.id)}
                          className="text-[10px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all"
                        >
                          + เพิ่มบทเรียน
                        </button>
                        <button 
                          onClick={() => handleDeleteModule(module.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white p-4 rounded-2xl flex items-center justify-between group/lesson hover:shadow-sm transition-all border border-transparent hover:border-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                              <Video className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">{lesson.title}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1.5 text-slate-200 hover:text-red-500 opacity-0 group-hover/lesson:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
