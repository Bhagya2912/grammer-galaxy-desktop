
import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <div className="app-container flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="main-content p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
