
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    });
    // Implement search functionality
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const handleNotificationClick = (notification: string) => {
    console.log('Notification clicked:', notification);
    toast({
      title: "Notification",
      description: `You clicked: ${notification}`,
    });
    // Additional notification handling if needed
  };

  const handleViewAllNotifications = () => {
    navigateTo('/notifications');
    console.log('Navigating to all notifications');
  };

  return (
    <header className="bg-background shadow-sm border-b border-border h-16 flex items-center px-6">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo/Brand Name */}
          <Button variant="ghost" className="font-serif font-bold text-lg" onClick={() => navigateTo('/')}>
            Grammer's Gallery
          </Button>

          {/* Main Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Button variant="ghost" onClick={() => navigateTo('/')}>Home</Button>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('/courses')}>
                          <div>
                            <div className="text-sm font-medium">Courses</div>
                            <p className="text-xs text-muted-foreground">Browse all grammar courses</p>
                          </div>
                        </Button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('/live-classes')}>
                          <div>
                            <div className="text-sm font-medium">Live Classes</div>
                            <p className="text-xs text-muted-foreground">Join interactive teaching sessions</p>
                          </div>
                        </Button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('/forum')}>
                          <div>
                            <div className="text-sm font-medium">Forum</div>
                            <p className="text-xs text-muted-foreground">Discuss with community members</p>
                          </div>
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {user ? (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>My Learning</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('/dashboard')}>
                            <div>
                              <div className="text-sm font-medium">Dashboard</div>
                              <p className="text-xs text-muted-foreground">Track your progress</p>
                            </div>
                          </Button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('/profile')}>
                            <div>
                              <div className="text-sm font-medium">Profile</div>
                              <p className="text-xs text-muted-foreground">Manage your account</p>
                            </div>
                          </Button>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Button variant="ghost" onClick={() => navigateTo('/registration')}>Register</Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button variant="ghost" onClick={() => navigateTo('/staff-registration')}>Staff Registration</Button>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
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

          {user && (
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
                <DropdownMenuItem onClick={() => handleNotificationClick("New course available")}>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">New course available</p>
                    <p className="text-sm text-muted-foreground">Advanced Grammar Rules is now available</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNotificationClick("Live class starting soon")}>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Live class starting soon</p>
                    <p className="text-sm text-muted-foreground">Join "Common Grammar Mistakes" in 30 minutes</p>
                    <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="justify-center" onClick={handleViewAllNotifications}>
                  <Button variant="link" className="w-full">View all notifications</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
