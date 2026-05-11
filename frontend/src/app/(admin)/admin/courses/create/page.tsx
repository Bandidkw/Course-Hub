'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Globe, 
  Info,
  DollarSign,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
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
    setLoading(true);

    try {
      await api.post('/courses', formData);
      toast.success('สร้างคอร์สเรียนสำเร็จ!');
      router.push('/admin/courses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ไม่สามารถสร้างคอร์สได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/courses" 
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800">สร้างคอร์สเรียนใหม่</h1>
            <p className="text-slate-500 text-sm">ระบุข้อมูลคอร์สเรียนและข้อมูลสำหรับการทำ SEO</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          บันทึกคอร์ส
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">ข้อมูลทั่วไป</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ชื่อคอร์สเรียน</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="เช่น พื้นฐานการพัฒนาเว็บไซต์ด้วย React"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">รายละเอียดคอร์ส</label>
                <textarea 
                  name="description"
                  rows={6}
                  placeholder="อธิบายรายละเอียดของคอร์สเรียนนี้..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* SEO Section */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">ข้อมูล SEO (Search Engine Optimization)</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 italic text-slate-400">Meta Title</label>
                <input 
                  type="text" 
                  name="metaTitle"
                  placeholder="ความยาวที่แนะนำ 50-60 ตัวอักษร"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={formData.metaTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 italic text-slate-400">Meta Description</label>
                <textarea 
                  name="metaDescription"
                  rows={3}
                  placeholder="ความยาวที่แนะนำ 150-160 ตัวอักษร"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  value={formData.metaDescription}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Status & Pricing */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">สถานะคอร์ส</label>
                <select 
                  name="status"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="DRAFT">ฉบับร่าง (Draft)</option>
                  <option value="PUBLISHED">เผยแพร่ (Published)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ราคา (บาท)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    name="price"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Categories & Level */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
             <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">หมวดหมู่</label>
                <input 
                  type="text" 
                  name="category"
                  placeholder="เช่น Programming, Design"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ระดับความยาก</label>
                <select 
                  name="level"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="BEGINNER">เริ่มต้น (Beginner)</option>
                  <option value="INTERMEDIATE">ปานกลาง (Intermediate)</option>
                  <option value="ADVANCED">ขั้นสูง (Advanced)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Thumbnail Preview */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <label className="text-sm font-bold text-slate-700">รูปปกคอร์ส</label>
            <div 
              onClick={() => document.getElementById('thumbnail-input')?.click()}
              className={`aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group`}
            >
              {formData.thumbnail ? (
                <>
                  <img 
                    src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${formData.thumbnail}` : `http://localhost:5001${formData.thumbnail}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    คลิกเพื่อเปลี่ยนรูป
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 opacity-20" />
                  <p className="text-xs">คลิกเพื่ออัปโหลดรูปภาพ</p>
                </>
              )}
            </div>
            <input 
              id="thumbnail-input"
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
            <p className="text-[10px] text-slate-400 text-center">ขนาดแนะนำ 1280x720 px (16:9)</p>
          </section>
        </div>
      </form>
    </div>
  );
}
