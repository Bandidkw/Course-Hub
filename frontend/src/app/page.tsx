'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  Award
} from 'lucide-react';

import AuthModal from '@/components/AuthModal';

export default function HomePage() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const featuredCourses = [
    {
      id: '1',
      title: 'Full-stack Web Development with Next.js 14',
      instructor: 'Dr. Sarah Chen',
      price: 2900,
      rating: 4.9,
      students: 1240,
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: '2',
      title: 'Advanced UI/UX Design Principles',
      instructor: 'James Wilson',
      price: 1500,
      rating: 4.8,
      students: 850,
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: '3',
      title: 'Data Science & Machine Learning Bootcamp',
      instructor: 'Alex Rivera',
      price: 3200,
      rating: 5.0,
      students: 2100,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    }
  ];

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
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                CourseHub
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">หน้าแรก</Link>
              <Link href="/courses" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">คอร์สทั้งหมด</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">เกี่ยวกับเรา</Link>
            </div>

            <div className="flex items-center space-x-4">
              {!mounted ? (
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium hidden sm:inline">{user.name}</span>
                  </div>
                  
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all cursor-pointer"
                    >
                      จัดการระบบ
                    </Link>
                  )}

                  <button 
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                    title="ออกจากระบบ"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={openLogin}
                    className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors cursor-pointer"
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button 
                    onClick={openRegister}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer"
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
              <div>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
                  ✨ เรียนรู้ทักษะใหม่แห่งอนาคตได้แล้ววันนี้
                </span>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
                  ยกระดับทักษะของคุณสู่ <span className="text-blue-600 italic">มืออาชีพ</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                  เรียนรู้จากผู้เชี่ยวชาญระดับโลก พร้อมลงมือทำจริงกับโปรเจกต์ที่ใช้งานได้จริงในสายงาน เริ่มต้นเส้นทางใหม่ของคุณได้ทันที
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/courses" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1">
                    เริ่มสำรวจคอร์สเลย <ArrowRight className="w-5 h-5" />
                  </Link>
                  <div className="flex items-center gap-4 px-4 py-2 border border-gray-100 rounded-2xl bg-white shadow-sm">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">10,000+</p>
                      <p className="text-gray-500 text-xs">นักเรียนไว้วางใจเรา</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                    alt="Education"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-xl p-6 rounded-2xl border border-white/30 text-white">
                    <div className="flex items-center gap-4">
                      <PlayCircle className="w-12 h-12 text-blue-400" />
                      <div>
                        <p className="font-bold text-lg">บทเรียนคุณภาพระดับ 4K</p>
                        <p className="text-sm text-gray-100">เข้าถึงได้ตลอดชีพ ทุกที่ทุกเวลา</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400/20 rounded-full -z-10 animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 p-6 bg-white rounded-2xl shadow-xl z-20 hidden md:block">
                  <div className="flex items-center gap-4 text-green-600 font-bold">
                    <Award className="w-8 h-8" />
                    <span>ใบประกาศนียบัตรรับรอง</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">คอร์สยอดนิยม</h2>
                <p className="text-gray-600">เริ่มต้นเรียนรู้กับคอร์สที่ได้รับการรีวิวสูงสุดจากนักเรียนของเรา</p>
              </div>
              <Link href="/courses" className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:underline">
                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                      แนะนำ
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                      <span className="text-sm text-gray-400">({course.students} นักเรียน)</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" /> โดย {course.instructor}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <p className="text-2xl font-extrabold text-blue-600">
                        ฿{course.price.toLocaleString()}
                      </p>
                      <button className="p-2 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all cursor-pointer">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-16">ทำไมต้องเรียนกับเรา?</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">เนื้อหาทันสมัย</h3>
                <p className="text-gray-600">อัปเดตบทเรียนให้ทันตามเทคโนโลยีล่าสุดในตลาดงานอยู่เสมอ</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">เรียนได้ทุกที่</h3>
                <p className="text-gray-600">เข้าถึงวิดีโอการสอนคุณภาพสูงได้จากทุกอุปกรณ์ ตลอด 24 ชั่วโมง</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">คอมมูนิตี้ช่วยเหลือ</h3>
                <p className="text-gray-600">ปรึกษาผู้เชี่ยวชาญและเพื่อนร่วมคลาสในกลุ่มปิดพิเศษ</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6 text-white">
                <BookOpen className="w-6 h-6" />
                <span className="text-xl font-bold uppercase tracking-wider">CourseHub</span>
              </div>
              <p className="text-sm leading-relaxed">
                สร้างโอกาสแห่งการเรียนรู้ที่ไร้ขีดจำกัด ยกระดับทักษะของคุณไปอีกขั้นกับทีมงานคุณภาพ
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">เรียนรู้</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/courses" className="hover:text-white transition-colors">คอร์สทั้งหมด</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">หมวดหมู่</Link></li>
                <li><Link href="/mentors" className="hover:text-white transition-colors">ผู้สอน</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">บริษัท</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">เกี่ยวกับเรา</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">บล็อก</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">ติดต่อเรา</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">ช่วยเหลือ</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">คำถามที่พบบ่อย</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">ฝ่ายสนับสนุน</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">ข้อตกลงการใช้งาน</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs tracking-widest uppercase">© 2024 CourseHub. All rights reserved.</p>
            <div className="flex space-x-6 text-xs uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
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
