'use client';

import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'นักเรียนทั้งหมด', value: '1,240', icon: Users, color: 'bg-blue-500' },
    { label: 'คอร์สที่เปิดสอน', value: '12', icon: BookOpen, color: 'bg-green-500' },
    { label: 'ยอดขายเดือนนี้', value: '฿125,400', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'การชำระเงิน', value: '48 รายการ', icon: CreditCard, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">แผงควบคุมหลัก</h1>
        <p className="text-gray-500 mt-2">ยินดีต้อนรับกลับมา! นี่คือภาพรวมของระบบในวันนี้</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-green-500 text-sm font-bold">+12%</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">คอร์สที่มียอดสมัครสูงสุด</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=100`} alt="course" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Next.js 14 Masterclass</p>
                    <p className="text-sm text-gray-500">420 นักเรียนสมัครเรียน</p>
                  </div>
                </div>
                <p className="font-bold text-blue-600">฿54,000</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">กิจกรรมล่าสุด</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">คุณสมาน ใจดี สมัครเรียนคอร์ส UX/UI</p>
                  <p className="text-xs text-gray-400">2 นาทีที่แล้ว</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
