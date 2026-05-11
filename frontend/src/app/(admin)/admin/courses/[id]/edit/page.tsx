'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
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
      router.push('/admin/courses');
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

    const toastId = toast.loading('กำลังอัปโหลดรูปภาพใหม่...');
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
      await api.put(`/courses/${id}`, formData); 
      toast.success('อัปเดตข้อมูลคอร์สสำเร็จ!');
      router.push('/admin/courses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

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
            <h1 className="text-2xl font-black text-slate-800">แก้ไขคอร์สเรียน</h1>
            <p className="text-slate-500 text-sm">ปรับปรุงข้อมูลคอร์สเรียนและข้อมูลสำหรับการทำ SEO</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          บันทึกการเปลี่ยนแปลง
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
                  placeholder="ชื่อคอร์สเรียนของคุณ"
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
                  placeholder="รายละเอียด..."
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
              <h2 className="text-lg font-bold text-slate-800">ข้อมูล SEO</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 italic text-slate-400">Meta Title</label>
                <input 
                  type="text" 
                  name="metaTitle"
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
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none font-medium"
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
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Thumbnail */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <label className="text-sm font-bold text-slate-700">รูปปกคอร์ส</label>
            <div 
              onClick={() => document.getElementById('edit-thumbnail-input')?.click()}
              className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group"
            >
              {formData.thumbnail ? (
                <>
                  <img 
                    src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${formData.thumbnail}` : `http://localhost:5001${formData.thumbnail}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    เปลี่ยนรูปปก
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 opacity-20" />
                  <p className="text-xs">อัปโหลดรูปภาพ</p>
                </>
              )}
            </div>
            <input 
              id="edit-thumbnail-input"
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
          </section>
        </div>
      </form>
    </div>
  );
}
