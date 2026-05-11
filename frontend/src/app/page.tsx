'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { 
  BookOpen, 
  Search, 
  User, 
  LogOut, 
  PlayCircle, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Award,
  Loader2,
  Book
} from 'lucide-react';

import AuthModal from '@/components/AuthModal';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  _count?: {
    modules: number;
    enrollments: number;
  }
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      // Filter for published courses or just show top 3 for home page
      setCourses(response.data.slice(0, 6)); 
    } catch (error) {
      console.error('Fetch home courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                CourseHub
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">หน้าแรก</Link>
              <Link href="/courses" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">คอร์สทั้งหมด</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">เกี่ยวกับเรา</Link>
            </div>

            <div className="flex items-center space-x-4">
              {!mounted ? (
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shadow-inner">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-bold hidden sm:inline">{user.name}</span>
                  </div>
                  
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="text-sm font-black text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl border-2 border-blue-600 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      จัดการระบบ
                    </Link>
                  )}

                  <button 
                    onClick={logout}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="ออกจากระบบ"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={openLogin}
                    className="text-gray-600 hover:text-blue-600 font-bold px-4 py-2 transition-colors cursor-pointer"
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button 
                    onClick={openRegister}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all cursor-pointer active:scale-95"
                  >
                    สมัครเรียนฟรี
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-in fade-in slide-in-from-left duration-1000">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest mb-6">
                  ✨ LEARN THE SKILLS OF TOMORROW
                </span>
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tight">
                  ยกระดับทักษะ <br/>สู่ <span className="text-blue-600 italic">มืออาชีพ</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl font-medium">
                  เรียนรู้จากผู้เชี่ยวชาญระดับโลก พร้อมลงมือทำจริงกับโปรเจกต์ที่ใช้งานได้จริงในสายงาน เริ่มต้นเส้นทางใหม่ของคุณได้ทันที
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/courses" className="flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95">
                    สำรวจคอร์สเรียน <ArrowRight className="w-6 h-6" />
                  </Link>
                  <div className="flex items-center gap-4 px-6 py-3 border border-slate-100 rounded-[24px] bg-white shadow-sm">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden ring-1 ring-slate-100">
                          <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" />
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <p className="font-black text-slate-900">10,000+</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Students Joined</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative animate-in fade-in slide-in-from-right duration-1000">
                <div className="relative z-10 rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-8 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                    alt="Education"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10 bg-white/20 backdrop-blur-2xl p-8 rounded-3xl border border-white/30 text-white">
                    <div className="flex items-center gap-6">
                      <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-xl mb-1 tracking-tight">บทเรียนคุณภาพ 4K</p>
                        <p className="text-sm text-white/80 font-medium">เข้าถึงได้ตลอดชีพ ทุกที่ทุกเวลา</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 p-8 bg-white rounded-3xl shadow-2xl z-20 hidden lg:block animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-4 text-blue-600 font-black">
                    <Award className="w-10 h-10" />
                    <div className="text-left">
                      <p className="text-lg leading-none">Certificated</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">By CourseHub</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">POPULAR COURSES</span>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">คอร์สเรียนยอดนิยม</h2>
                <p className="text-slate-500 font-medium text-lg">เริ่มต้นเรียนรู้กับคอร์สที่ได้รับการรีวิวสูงสุดจากนักเรียนของเราทั่วประเทศ</p>
              </div>
              <Link href="/courses" className="flex items-center gap-3 text-blue-600 font-black hover:gap-5 transition-all">
                ดูคอร์สทั้งหมด <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-slate-400 font-bold">กำลังโหลดคอร์สเรียน...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white p-20 rounded-[40px] border border-slate-100 text-center">
                <Book className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <p className="text-slate-400 font-bold">ยังไม่มีคอร์สเรียนที่เปิดสอนในขณะนี้</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 group border border-slate-100 hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      {course.thumbnail ? (
                        <img 
                          src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${course.thumbnail}` : `http://localhost:5001${course.thumbnail}`} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                        Course
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-sm font-black text-slate-900">4.9</span>
                        <span className="text-sm text-slate-400 font-bold">({course._count?.enrollments || 0} นักเรียน)</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 min-h-[4rem] group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                        {course.title}
                      </h3>
                      <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ราคาเริ่มต้น</p>
                          <p className="text-3xl font-black text-slate-900">
                            ฿{course.price.toLocaleString()}
                          </p>
                        </div>
                        <Link 
                          href={`/courses/${course.id}`}
                          className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm active:scale-90"
                        >
                          <ArrowRight className="w-6 h-6" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-black text-slate-900 mb-20 tracking-tight">ทำไมต้องเรียนกับ <span className="text-blue-600">CourseHub?</span></h2>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12 shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">เนื้อหาทันสมัย</h3>
                <p className="text-slate-500 font-medium leading-relaxed">อัปเดตบทเรียนให้ทันตามเทคโนโลยีล่าสุดในตลาดงานอยู่เสมอ เพื่อการทำงานจริง</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12 shadow-sm">
                  <PlayCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">เรียนได้ทุกที่</h3>
                <p className="text-slate-500 font-medium leading-relaxed">เข้าถึงวิดีโอการสอนคุณภาพสูงได้จากทุกอุปกรณ์ ตลอด 24 ชั่วโมง ทั่วโลก</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-[32px] flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12 shadow-sm">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">คอมมูนิตี้ช่วยเหลือ</h3>
                <p className="text-slate-500 font-medium leading-relaxed">ปรึกษาผู้เชี่ยวชาญและเพื่อนร่วมคลาสในกลุ่มปิดพิเศษ เพื่อการเรียนรู้ที่มีประสิทธิภาพ</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-8 text-white">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black tracking-tight">CourseHub</span>
              </div>
              <p className="text-sm leading-relaxed font-medium">
                สร้างโอกาสแห่งการเรียนรู้ที่ไร้ขีดจำกัด ยกระดับทักษะของคุณไปอีกขั้นกับทีมงานคุณภาพระดับสากล
              </p>
            </div>
            <div>
              <h4 className="text-white font-black mb-8 uppercase text-xs tracking-[0.2em]">เรียนรู้</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/courses" className="hover:text-white transition-colors">คอร์สทั้งหมด</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">หมวดหมู่</Link></li>
                <li><Link href="/mentors" className="hover:text-white transition-colors">ผู้สอน</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-8 uppercase text-xs tracking-[0.2em]">บริษัท</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/about" className="hover:text-white transition-colors">เกี่ยวกับเรา</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">บล็อก</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">ติดต่อเรา</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-8 uppercase text-xs tracking-[0.2em]">ช่วยเหลือ</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/faq" className="hover:text-white transition-colors">คำถามที่พบบ่อย</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">ฝ่ายสนับสนุน</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">ข้อตกลงการใช้งาน</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase">© 2024 CourseHub. All rights reserved.</p>
            <div className="flex space-x-10 text-[10px] font-black uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-white transition-all hover:-translate-y-1">Facebook</a>
              <a href="#" className="hover:text-white transition-all hover:-translate-y-1">Twitter</a>
              <a href="#" className="hover:text-white transition-all hover:-translate-y-1">YouTube</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
      />
    </div>
  );
}
