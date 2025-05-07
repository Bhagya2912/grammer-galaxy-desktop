
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, BookOpen, CheckCircle, Clock, Edit, Lock, MessageSquare, User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'I am a passionate learner interested in improving my grammar and writing skills.',
    location: 'New York, USA',
    website: 'https://example.com',
  });
  
  // Mock enrolled courses
  const enrolledCourses = [
    { 
      id: '1', 
      title: 'English Grammar Basics',
      progress: 65,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
      category: 'Grammar'
    },
    { 
      id: '3', 
      title: 'Business Communication',
      progress: 30,
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
      category: 'Business Writing'
    },
  ];
  
  // Mock certificates
  const certificates = [
    { 
      id: '1', 
      title: 'English Grammar Fundamentals',
      issueDate: '2025-03-15',
      instructor: 'Dr. Sarah Johnson'
    },
    { 
      id: '2', 
      title: 'Effective Business Writing',
      issueDate: '2025-02-20',
      instructor: 'Prof. Michael Smith'
    },
  ];
  
  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    courseAnnouncements: true,
    forumReplies: true,
    newCourses: false,
    promotions: false,
  });
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification setting changes
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile:', formData);
    setIsEditing(false);
    // In a real app, you would save changes to backend here
  };
  
  // If no user is logged in, show a message
  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.href = '/auth'}>Login Now</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-serif font-bold">{user.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <Badge variant="outline" className="capitalize">{user.role}</Badge>
              <span className="mx-2">•</span>
              <span>Member since January 2025</span>
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          <Edit size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User size={16} className="mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen size={16} className="mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <CheckCircle size={16} className="mr-2" />
            Certificates
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </div>
                <Lock size={20} className="text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="flex flex-col">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{course.title}</CardTitle>
                      <Badge>{course.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-blue rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => window.location.href = `/courses/${course.id}`}>
                        View Course
                      </Button>
                      <Button>Continue Learning</Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
            
            <Card className="border-dashed bg-muted/50 flex items-center justify-center h-64">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Discover More Courses</h3>
                <p className="text-muted-foreground mb-4">Explore our catalog and enhance your skills</p>
                <Button variant="outline" onClick={() => window.location.href = '/courses'}>Browse Courses</Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(certificate => (
              <Card key={certificate.id} className="overflow-hidden">
                <div className="p-6 border-b bg-muted/50">
                  <div className="flex justify-center mb-4">
                    <CheckCircle size={48} className="text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-center">{certificate.title}</h3>
                  <p className="text-center text-muted-foreground mt-2">Certificate of Completion</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issued to</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Instructor</p>
                      <p className="font-medium">{certificate.instructor}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Certificate ID</p>
                      <p className="font-medium">{certificate.id}-{user.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button variant="outline">View Certificate</Button>
                    <Button variant="ghost">Download PDF</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {certificates.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You haven't earned any certificates yet.</p>
                <p className="mb-4">Complete courses to earn certificates.</p>
                <Button variant="outline" onClick={() => window.location.href = '/courses'}>Browse Courses</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailUpdates">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important account and platform updates
                    </p>
                  </div>
                  <Switch
                    id="emailUpdates"
                    checked={notificationSettings.emailUpdates}
                    onCheckedChange={() => handleNotificationChange('emailUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="courseAnnouncements">Course Announcements</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about courses you're enrolled in
                    </p>
                  </div>
                  <Switch
                    id="courseAnnouncements"
                    checked={notificationSettings.courseAnnouncements}
                    onCheckedChange={() => handleNotificationChange('courseAnnouncements')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="forumReplies">Forum Replies</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone replies to your forum posts
                    </p>
                  </div>
                  <Switch
                    id="forumReplies"
                    checked={notificationSettings.forumReplies}
                    onCheckedChange={() => handleNotificationChange('forumReplies')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newCourses">New Course Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Be the first to know when new courses are added
                    </p>
                  </div>
                  <Switch
                    id="newCourses"
                    checked={notificationSettings.newCourses}
                    onCheckedChange={() => handleNotificationChange('newCourses')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive special offers and promotional content
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={notificationSettings.promotions}
                    onCheckedChange={() => handleNotificationChange('promotions')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start pb-4 border-b">
                  <div className="rounded-full p-2 bg-muted">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="font-medium">New lesson available</p>
                    <p className="text-sm text-muted-foreground">
                      "Advanced Punctuation" has a new lesson available.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start pb-4 border-b">
                  <div className="rounded-full p-2 bg-muted">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="font-medium">New reply to your post</p>
                    <p className="text-sm text-muted-foreground">
                      Professor Williams replied to your question about subject-verb agreement.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="rounded-full p-2 bg-muted">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Live class reminder</p>
                    <p className="text-sm text-muted-foreground">
                      "Common Grammar Mistakes" class starts in 1 hour.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="link">View All Notifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
