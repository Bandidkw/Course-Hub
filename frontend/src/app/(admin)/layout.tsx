'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Bell
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // If auth is checked and user is not admin, don't render children (useEffect will handle redirect)
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'แดชบอร์ด', href: '/admin/dashboard' },
    { icon: BookOpen, label: 'จัดการคอร์ส', href: '/admin/courses' },
    { icon: Users, label: 'จัดการผู้ใช้', href: '/admin/users' },
    { icon: Settings, label: 'ตั้งค่าระบบ', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col shrink-0 z-50
        ${isSidebarOpen ? 'w-72' : 'w-20'}`}
      >
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 shrink-0">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className={`font-black text-xl tracking-tight text-slate-800 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>
              Course<span className="text-blue-600">Hub</span>
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'group-hover:text-slate-900'}`} />
                <span className={`font-bold whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'opacity-0 pointer-events-none'}`}>
                  {item.label}
                </span>
                {isActive && isSidebarOpen && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
                {isActive && !isSidebarOpen && (
                  <div className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all w-full group cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
            <span className={`font-bold transition-all duration-300 ${!isSidebarOpen && 'opacity-0'}`}>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden md:block">แดชบอร์ดผู้ดูแลระบบ</h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100 shrink-0">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
