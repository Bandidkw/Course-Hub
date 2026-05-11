'use client';

import React from 'react';
import { Settings, Save, Bell, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">ตั้งค่าระบบ</h1>
        <p className="text-slate-500 mt-2">ปรับแต่งการทำงานของเว็บไซต์และข้อมูลพื้นฐานของแอดมิน</p>
      </div>

      <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <Settings className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">กำลังพัฒนาส่วนตั้งค่าระบบ</h3>
        <p className="text-slate-500 max-w-sm mx-auto">ฟีเจอร์นี้กำลังอยู่ในระหว่างการพัฒนา คุณจะสามารถตั้งค่า API และข้อมูลทั่วไปได้ที่นี่ในเร็วๆ นี้</p>
      </div>
    </div>
  );
}
