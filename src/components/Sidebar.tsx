
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Users,
  MessageSquare,
  Video,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Define navigation based on user role
  const getNavItems = () => {
    const commonItems = [
      { to: '/', label: 'Home', icon: <Home size={20} /> },
      { to: '/courses', label: 'Courses', icon: <BookOpen size={20} /> },
      { to: '/live-classes', label: 'Live Classes', icon: <Video size={20} /> },
      { to: '/forum', label: 'Forum', icon: <MessageSquare size={20} /> },
    ];

    // Add role-specific items
    if (user?.role === 'admin' || user?.role === 'staff') {
      commonItems.push(
        { to: '/users', label: 'Users', icon: <Users size={20} /> }
      );
    }

    // Add profile and dashboard for all logged in users
    if (user) {
      commonItems.push(
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { to: '/profile', label: 'Profile', icon: <User size={20} /> },
        { to: '/settings', label: 'Settings', icon: <Settings size={20} /> }
      );
    }
    
    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <aside 
      className={cn(
        "sidebar bg-sidebar h-screen transition-all duration-300 flex flex-col border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-sidebar-foreground font-serif font-bold text-xl">
            Grammer's Gallery
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground p-1 rounded-full hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  cn(
                    "nav-link text-sidebar-foreground",
                    isActive ? "active" : "",
                    collapsed ? "justify-center" : ""
                  )
                }
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {user && (
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className={cn(
              "nav-link text-sidebar-foreground w-full",
              collapsed ? "justify-center" : ""
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
