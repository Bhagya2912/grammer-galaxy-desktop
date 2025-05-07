
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock courses data
const coursesData = [
  {
    id: '1',
    title: 'English Grammar Basics',
    description: 'Master the fundamental rules of English grammar with our comprehensive course.',
    level: 'Beginner',
    category: 'Grammar',
    students: 1245,
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    popular: true,
    price: 'Free'
  },
  {
    id: '2',
    title: 'Advanced Punctuation',
    description: 'Learn the nuanced rules of punctuation to enhance your writing skills.',
    level: 'Intermediate',
    category: 'Punctuation',
    students: 892,
    duration: '4 weeks',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    popular: false,
    price: '$29.99'
  },
  {
    id: '3',
    title: 'Business Communication',
    description: 'Enhance your professional writing skills with our business communication course.',
    level: 'Advanced',
    category: 'Business Writing',
    students: 1056,
    duration: '8 weeks',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    popular: true,
    price: '$49.99'
  },
  {
    id: '4',
    title: 'Creative Writing Essentials',
    description: 'Express yourself effectively through creative writing techniques and practices.',
    level: 'Intermediate',
    category: 'Creative Writing',
    students: 748,
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    popular: false,
    price: '$39.99'
  },
  {
    id: '5',
    title: 'Grammar for Academic Writing',
    description: 'Learn how to write academically with proper grammar and structure.',
    level: 'Advanced',
    category: 'Academic',
    students: 623,
    duration: '10 weeks',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    popular: false,
    price: '$59.99'
  },
  {
    id: '6',
    title: 'English as a Second Language',
    description: 'Build foundational grammar skills for non-native English speakers.',
    level: 'Beginner',
    category: 'ESL',
    students: 1832,
    duration: '12 weeks',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    popular: true,
    price: 'Free'
  },
];

const Courses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level.toLowerCase() === levelFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || course.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(coursesData.map(course => course.category.toLowerCase()))];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Courses</h1>
        <p className="text-muted-foreground">Browse our collection of grammar and writing courses</p>
      </div>
      
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.filter(c => c !== 'all').map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses match your search criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery('');
                  setLevelFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(course => course.popular).map(course => (
              <CourseCard key={course.id} course={course} navigate={navigate} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="free" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(course => course.price === 'Free').map(course => (
              <CourseCard key={course.id} course={course} navigate={navigate} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, navigate }) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.category}</CardDescription>
          </div>
          <Badge variant={course.price === 'Free' ? 'secondary' : 'outline'}>
            {course.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 mb-4">{course.description}</p>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{course.students} students</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
        </div>
        
        <div className="mt-2">
          <Badge variant="outline" className="mr-2">
            {course.level}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/courses/${course.id}`)}
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Courses;
