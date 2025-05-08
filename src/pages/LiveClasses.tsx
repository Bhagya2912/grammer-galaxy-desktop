import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import LiveLectureHost from '@/components/LiveLectureHost';
import { useToast } from '@/hooks/use-toast';

// Mock live classes
const upcomingClasses = [
  {
    id: '1',
    title: 'Common Grammar Mistakes',
    description: 'Live discussion on commonly made grammar mistakes in everyday writing.',
    date: '2025-05-15T18:00:00',
    duration: '1 hour',
    instructor: {
      name: 'Professor Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      bio: 'Professor of English with 15+ years of experience teaching grammar.'
    },
    level: 'All Levels',
    capacity: 50,
    enrolled: 32
  },
  {
    id: '2',
    title: 'Grammar for Content Writers',
    description: 'Special workshop focused on grammar rules essential for content creators.',
    date: '2025-05-22T15:30:00',
    duration: '1.5 hours',
    instructor: {
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      bio: 'Content writing expert with a passion for grammatically correct content.'
    },
    level: 'Intermediate',
    capacity: 35,
    enrolled: 21
  },
  {
    id: '3',
    title: 'Business Writing Essentials',
    description: 'Learn the key grammar rules for professional business communication.',
    date: '2025-06-01T10:00:00',
    duration: '2 hours',
    instructor: {
      name: 'Michael Roberts',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      bio: 'Business communication specialist with expertise in professional writing.'
    },
    level: 'Advanced',
    capacity: 30,
    enrolled: 18
  },
  {
    id: '4',
    title: 'Punctuation Masterclass',
    description: 'Deep dive into the rules and nuances of punctuation in English.',
    date: '2025-06-10T14:00:00',
    duration: '1.5 hours',
    instructor: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      bio: 'Author and grammar expert specializing in punctuation.'
    },
    level: 'Intermediate',
    capacity: 40,
    enrolled: 28
  }
];

const pastClasses = [
  {
    id: '5',
    title: 'Verb Tenses Explained',
    description: 'A comprehensive overview of verb tenses in English grammar.',
    date: '2025-05-01T13:00:00',
    duration: '1.5 hours',
    instructor: {
      name: 'Professor Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    },
    recording: 'https://example.com/recordings/verb-tenses'
  },
  {
    id: '6',
    title: 'Academic Writing Skills',
    description: 'Learn the grammar rules essential for academic writing.',
    date: '2025-04-25T15:00:00',
    duration: '2 hours',
    instructor: {
      name: 'Dr. Robert Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    },
    recording: 'https://example.com/recordings/academic-writing'
  }
];

const LiveClasses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hostingTab, setHostingTab] = useState('upcoming');
  const { toast } = useToast();
  
  // Get dates that have classes scheduled
  const classDateObjects = upcomingClasses.map(cls => new Date(cls.date));
  
  // Filter classes for the selected date
  const classesOnSelectedDate = upcomingClasses.filter(
    cls => isSameDay(new Date(cls.date), selectedDate)
  );
  
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
  
  const handleStartHostClass = (classId: string, classTitle: string) => {
    if (isAdminOrStaff) {
      setHostingTab('host');
      toast({
        title: "Starting class session",
        description: `Setting up "${classTitle}" lecture room`,
      });
    } else {
      // For students, navigate to join the class
      navigate(`/live-classes/join/${classId}`);
      toast({
        title: "Joining class",
        description: `Connecting to "${classTitle}"`,
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">Live Classes</h1>
          <p className="text-muted-foreground">
            {isAdminOrStaff 
              ? "Host and manage live interactive sessions for your students" 
              : "Join live interactive sessions with our grammar experts"}
          </p>
        </div>
        
        {isAdminOrStaff && (
          <Button onClick={() => setHostingTab('host')}>
            Host a New Lecture
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs 
            defaultValue="upcoming" 
            value={isAdminOrStaff ? hostingTab : activeTab} 
            onValueChange={isAdminOrStaff ? setHostingTab : setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
              <TabsTrigger value="past">Past Recordings</TabsTrigger>
              {isAdminOrStaff && (
                <TabsTrigger value="host">Host Lecture</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6">
              {upcomingClasses.map(cls => (
                <Card key={cls.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4 h-full">
                    <div className="md:col-span-1 bg-muted p-6 flex flex-col justify-center items-center text-center">
                      <div className="text-4xl font-bold">
                        {format(new Date(cls.date), 'dd')}
                      </div>
                      <div className="text-xl">{format(new Date(cls.date), 'MMM')}</div>
                      <div className="mt-2 text-muted-foreground">{format(new Date(cls.date), 'h:mm a')}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{cls.duration}</div>
                    </div>
                    
                    <div className="md:col-span-3 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{cls.title}</h3>
                          <div className="flex items-center mt-2 mb-4">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={cls.instructor.avatar} />
                              <AvatarFallback>{cls.instructor.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{cls.instructor.name}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{cls.level}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{cls.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {cls.enrolled} enrolled (of {cls.capacity} spots)
                        </div>
                        <Button 
                          onClick={() => handleStartHostClass(cls.id, cls.title)}
                        >
                          {isAdminOrStaff ? "Start/Host Class" : "Join Class"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6">
              {pastClasses.map(cls => (
                <Card key={cls.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4 h-full">
                    <div className="md:col-span-1 bg-muted p-6 flex flex-col justify-center items-center text-center">
                      <div className="text-4xl font-bold">
                        {format(new Date(cls.date), 'dd')}
                      </div>
                      <div className="text-xl">{format(new Date(cls.date), 'MMM')}</div>
                      <div className="mt-2 text-muted-foreground">{format(new Date(cls.date), 'h:mm a')}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{cls.duration}</div>
                    </div>
                    
                    <div className="md:col-span-3 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{cls.title}</h3>
                          <div className="flex items-center mt-2 mb-4">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={cls.instructor.avatar} />
                              <AvatarFallback>{cls.instructor.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{cls.instructor.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{cls.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Recording available
                        </div>
                        {isAdminOrStaff ? (
                          <div className="flex gap-2">
                            <Button variant="outline">Edit Recording</Button>
                            <Button>View Recording</Button>
                          </div>
                        ) : (
                          <Button>
                            Watch Recording
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            {isAdminOrStaff && (
              <TabsContent value="host">
                <LiveLectureHost 
                  onStreamStart={(lectureDetails) => {
                    // In a real app, this would save the lecture to backend
                    console.log("Lecture started:", lectureDetails);
                    toast({
                      title: "Lecture started",
                      description: `Your "${lectureDetails.title}" lecture is now live`,
                    });
                  }}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Class Calendar</CardTitle>
              <CardDescription>Find upcoming classes by date</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                showOutsideDays={true}
                modifiers={{
                  hasClass: classDateObjects
                }}
                modifiersStyles={{
                  hasClass: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    color: 'var(--primary)'
                  }
                }}
              />
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">
                  Classes on {format(selectedDate, 'MMMM d, yyyy')}
                </h4>
                
                {classesOnSelectedDate.length > 0 ? (
                  <ul className="space-y-2">
                    {classesOnSelectedDate.map(cls => (
                      <li key={cls.id} className="text-sm p-2 hover:bg-muted rounded-md">
                        <div className="font-medium">{cls.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(cls.date), 'h:mm a')} • {cls.duration}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No classes scheduled for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {isAdminOrStaff ? (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Lecture Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Schedule New Class
                </Button>
                <Button variant="outline" className="w-full">
                  Manage Recordings
                </Button>
                <Button variant="outline" className="w-full">
                  View Attendance Reports
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Have a Question?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Need help with registration or have questions about our live classes?</p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
