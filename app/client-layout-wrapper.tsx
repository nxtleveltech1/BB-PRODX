"use client";

import dynamic from 'next/dynamic';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false });

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pb-4 md:pb-0 flex-1">{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
