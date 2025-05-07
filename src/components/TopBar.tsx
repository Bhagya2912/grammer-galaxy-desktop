
import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <header className="bg-background shadow-sm border-b border-border h-16 flex items-center px-6">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" onClick={() => navigateTo('/')}>Home</Button>
          <Button variant="ghost" onClick={() => navigateTo('/courses')}>Courses</Button>
          <Button variant="ghost" onClick={() => navigateTo('/live-classes')}>Live Classes</Button>
          <Button variant="ghost" onClick={() => navigateTo('/forum')}>Forum</Button>
          {!user && (
            <>
              <Button variant="ghost" onClick={() => navigateTo('/registration')}>Registration</Button>
              <Button variant="ghost" onClick={() => navigateTo('/auth')}>Login</Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses, lessons, or forums..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-2">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">New course available</p>
                  <p className="text-sm text-muted-foreground">Advanced Grammar Rules is now available</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Live class starting soon</p>
                  <p className="text-sm text-muted-foreground">Join "Common Grammar Mistakes" in 30 minutes</p>
                  <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="justify-center">
                <Button variant="link" className="w-full">View all notifications</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ''} alt={user.name} />
                    <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigateTo('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigateTo('/auth')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
