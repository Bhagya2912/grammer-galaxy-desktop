
import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="main-content animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
