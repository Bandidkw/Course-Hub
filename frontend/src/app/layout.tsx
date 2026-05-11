import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CourseHub - แพลตฟอร์มเรียนออนไลน์ที่ดีที่สุด",
  description: "เรียนรู้ทักษะใหม่ๆ กับคอร์สเรียนออนไลน์ที่ออกแบบมาเพื่อคุณโดยเฉพาะ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
        <AuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 4000,
              style: {
                padding: '16px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
              },
              success: {
                style: {
                  background: '#F0FDF4',
                  color: '#166534',
                  border: '1px solid #BBF7D0',
                },
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#fff',
                },
              },
              error: {
                style: {
                  background: '#FEF2F2',
                  color: '#991B1B',
                  border: '1px solid #FECACA',
                },
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
