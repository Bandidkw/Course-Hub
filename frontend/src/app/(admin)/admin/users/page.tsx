'use client';

import React from 'react';
import { Users, Search, MoreVertical, Shield } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">จัดการผู้ใช้</h1>
          <p className="text-slate-500 mt-2">ตรวจสอบและจัดการสิทธิ์ของผู้ใช้งานทั้งหมดในระบบ</p>
        </div>
      </div>

      <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <Users className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">กำลังพัฒนาส่วนจัดการผู้ใช้</h3>
        <p className="text-slate-500 max-w-sm mx-auto">ฟีเจอร์นี้กำลังอยู่ในระหว่างการพัฒนา คุณจะสามารถจัดการรายชื่อนักเรียนและแอดมินได้ในเร็วๆ นี้</p>
      </div>
    </div>
  );
}
