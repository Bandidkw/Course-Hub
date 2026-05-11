'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  X, 
  Save, 
  Image as ImageIcon, 
  Globe, 
  Info,
  DollarSign,
  Loader2,
  AlertCircle
} from 'lucide-react';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseId?: string | null;
}

export default function CourseModal({ isOpen, onClose, onSuccess, courseId }: CourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
    category: '',
    level: 'BEGINNER',
    status: 'DRAFT',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    if (isOpen && courseId) {
      fetchCourse();
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        thumbnail: '',
        category: '',
        level: 'BEGINNER',
        status: 'DRAFT',
        metaTitle: '',
        metaDescription: '',
      });
    }
  }, [isOpen, courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${courseId}`);
      const data = response.data;
      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        thumbnail: data.thumbnail || '',
        category: data.category || '',
        level: data.level || 'BEGINNER',
        status: data.status || 'DRAFT',
        metaTitle: data.seoTitle || '',
        metaDescription: data.seoDescription || '',
      });
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลคอร์สได้');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const toastId = toast.loading('กำลังอัปโหลดรูปภาพ...');
    try {
      const response = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, thumbnail: response.data.url }));
      toast.success('อัปโหลดรูปภาพสำเร็จ!', { id: toastId });
    } catch (error) {
      toast.error('ไม่สามารถอัปโหลดรูปภาพได้', { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (courseId) {
        await api.put(`/courses/${courseId}`, formData);
        toast.success('อัปเดตคอร์สสำเร็จ!');
      } else {
        await api.post('/courses', formData);
        toast.success('สร้างคอร์สใหม่สำเร็จ!');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              {courseId ? <Info className="w-5 h-5" /> : <Loader2 className="w-5 h-5" />}
            </div>
            <h2 className="text-xl font-black text-slate-800">
              {courseId ? 'แก้ไขคอร์สเรียน' : 'สร้างคอร์สเรียนใหม่'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-bold">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <form id="course-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: General & SEO */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                    ข้อมูลทั่วไป
                  </h3>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">ชื่อคอร์ส</label>
                    <input 
                      type="text" 
                      name="title"
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">รายละเอียด</label>
                    <textarea 
                      name="description"
                      rows={4}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                    ข้อมูล SEO
                  </h3>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider italic">Meta Title</label>
                    <input 
                      type="text" 
                      name="metaTitle"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      value={formData.metaTitle}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing, Thumbnail, Status */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">ราคา (บาท)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number" 
                        name="price"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <CustomDropdown 
                    label="สถานะ"
                    options={[
                      { value: 'DRAFT', label: 'Draft' },
                      { value: 'PUBLISHED', label: 'Published' }
                    ]}
                    value={formData.status}
                    onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">รูปปกคอร์ส</label>
                  <div 
                    onClick={() => document.getElementById('modal-thumbnail-input')?.click()}
                    className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center gap-2 text-slate-400 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group"
                  >
                    {formData.thumbnail ? (
                      <img 
                        src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${formData.thumbnail}` : `http://localhost:5001${formData.thumbnail}`} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] font-bold">อัปโหลดรูปภาพ</span>
                      </>
                    )}
                  </div>
                  <input id="modal-thumbnail-input" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-wider">ระดับความยาก</label>
                   <div className="flex gap-2">
                    {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, level: lvl }))}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${formData.level === lvl 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {lvl === 'BEGINNER' ? 'เริ่มต้น' : lvl === 'INTERMEDIATE' ? 'ปานกลาง' : 'สูง'}
                      </button>
                    ))}
                   </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">ยกเลิก</button>
          <button 
            form="course-form"
            type="submit"
            disabled={saving || loading}
            className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            บันทึกข้อมูล
          </button>
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
        .custom-scrollbar {
          scrollbar-gutter: stable;
        }
      `}</style>
    </div>
  );
}
