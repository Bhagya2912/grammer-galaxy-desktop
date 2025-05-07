
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Clock, Search, VideoIcon } from 'lucide-react';
import { format } from 'date-fns';

// Mock live classes data
const liveClassesData = [
  {
    id: '1',
    title: 'Common Grammar Mistakes',
    description: 'Live discussion on commonly made grammar mistakes in everyday writing.',
    date: '2025-05-15T18:00:00',
    duration: '60 minutes',
    instructor: 'Professor Johnson',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    category: 'Grammar',
    capacity: 100,
    enrolled: 78
  },
  {
    id: '2',
    title: 'Grammar for Content Writers',
    description: 'Special workshop focused on grammar rules essential for content creators.',
    date: '2025-05-22T15:30:00',
    duration: '90 minutes',
    instructor: 'Sarah Williams',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    category: 'Content Writing',
    capacity: 75,
    enrolled: 42
  },
  {
    id: '3',
    title: 'Business Email Writing',
    description: 'Learn the proper grammar and formatting for professional business emails.',
    date: '2025-05-28T14:00:00',
    duration: '60 minutes',
    instructor: 'David Chen',
    image: 'https://images.unsplash.com/photo-1573497019414-e44d0392bfb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    category: 'Business Writing',
    capacity: 120,
    enrolled: 95
  },
  {
    id: '4',
    title: 'Grammar for Academic Writing',
    description: 'Understand the specific grammar requirements for academic papers and essays.',
    date: '2025-06-05T16:00:00',
    duration: '120 minutes',
    instructor: 'Dr. Emily Roberts',
    image: 'https://images.unsplash.com/photo-1568992687947-8a4011a11f57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    category: 'Academic',
    capacity: 80,
    enrolled: 35
  },
  {
    id: '5',
    title: 'Creative Writing Grammar',
    description: 'How to use grammar effectively in creative writing and storytelling.',
    date: '2025-06-10T19:00:00',
    duration: '90 minutes',
    instructor: 'Michael Thompson',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    category: 'Creative Writing',
    capacity: 100,
    enrolled: 48
  },
];

const LiveClasses = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter classes by search query and selected date
  const filteredClasses = liveClassesData.filter(liveClass => {
    const matchesSearch = liveClass.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          liveClass.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          liveClass.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !date || format(new Date(liveClass.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    
    return matchesSearch && matchesDate;
  });

  // Sort classes by date
  const sortedClasses = [...filteredClasses].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group classes by month for calendar view
  const classesWithDates = liveClassesData.map(liveClass => new Date(liveClass.date));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Live Classes</h1>
        <p className="text-muted-foreground">Join interactive grammar sessions with expert instructors</p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-3/4">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search classes by title, description, or instructor..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="sm:w-auto"
              onClick={() => {
                setSearchQuery('');
                setDate(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>
          
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="card">Card View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6 space-y-4">
              {sortedClasses.length > 0 ? (
                sortedClasses.map(liveClass => (
                  <Card key={liveClass.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="aspect-video md:w-1/4 overflow-hidden">
                        <img 
                          src={liveClass.image} 
                          alt={liveClass.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{liveClass.title}</CardTitle>
                              <CardDescription>by {liveClass.instructor}</CardDescription>
                            </div>
                            <Badge>{liveClass.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{liveClass.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon size={16} />
                              <span>{format(new Date(liveClass.date), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{format(new Date(liveClass.date), 'p')} ({liveClass.duration})</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="justify-between items-center mt-auto">
                          <div className="text-sm text-muted-foreground">
                            {liveClass.enrolled}/{liveClass.capacity} enrolled
                          </div>
                          <Button>Join Class</Button>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No live classes match your search criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="card" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedClasses.length > 0 ? (
                  sortedClasses.map(liveClass => (
                    <Card key={liveClass.id} className="overflow-hidden card-hover">
                      <div className="aspect-video w-full overflow-hidden relative">
                        <img 
                          src={liveClass.image} 
                          alt={liveClass.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge>{liveClass.category}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{liveClass.title}</CardTitle>
                        <CardDescription>by {liveClass.instructor}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2 mb-4">{liveClass.description}</p>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon size={16} />
                            <span>{format(new Date(liveClass.date), 'PPP')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{format(new Date(liveClass.date), 'p')} ({liveClass.duration})</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <div className="text-sm text-muted-foreground">
                          {liveClass.enrolled}/{liveClass.capacity} enrolled
                        </div>
                        <Button>Join Class</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-muted-foreground">No live classes match your search criteria.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Calendar</CardTitle>
              <CardDescription>Select a date to filter classes</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                highlightedDates={classesWithDates}
              />
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hosting a Class?</CardTitle>
                <CardDescription>Share your grammar expertise</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <VideoIcon className="text-brand-blue" size={20} />
                  <span className="text-sm">Reach students globally</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-brand-blue" size={20} />
                  <span className="text-sm">Flexible scheduling</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply to Teach</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
