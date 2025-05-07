
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Users, Video } from 'lucide-react';

// Mock featured courses
const featuredCourses = [
  {
    id: '1',
    title: 'English Grammar Basics',
    description: 'Master the fundamental rules of English grammar with our comprehensive course.',
    level: 'Beginner',
    students: 1245,
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80'
  },
  {
    id: '2',
    title: 'Advanced Punctuation',
    description: 'Learn the nuanced rules of punctuation to enhance your writing skills.',
    level: 'Intermediate',
    students: 892,
    duration: '4 weeks',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80'
  },
  {
    id: '3',
    title: 'Business Communication',
    description: 'Enhance your professional writing skills with our business communication course.',
    level: 'Advanced',
    students: 1056,
    duration: '8 weeks',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80'
  },
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: '1',
    title: 'Common Grammar Mistakes',
    description: 'Live discussion on commonly made grammar mistakes in everyday writing.',
    date: '2025-05-15T18:00:00',
    instructor: 'Professor Johnson',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '2',
    title: 'Grammar for Content Writers',
    description: 'Special workshop focused on grammar rules essential for content creators.',
    date: '2025-05-22T15:30:00',
    instructor: 'Sarah Williams',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative bg-brand-blue text-white rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-teal opacity-90"></div>
        <div className="relative z-10 px-8 py-16 md:px-16 lg:px-20 flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Welcome to Grammer's Gallery</h1>
          <p className="text-xl mb-8 max-w-2xl">A comprehensive platform to master the intricacies of grammar and enhance your communication skills.</p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-white text-brand-blue hover:bg-gray-100"
              onClick={() => navigate('/courses')}
            >
              Explore Courses
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-brand-blue"
              onClick={() => navigate('/auth')}
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif font-bold">Featured Courses</h2>
          <Button variant="outline" onClick={() => navigate('/courses')}>View All Courses</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden card-hover">
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
                    <CardDescription>{course.level}</CardDescription>
                  </div>
                  <span className="bg-brand-teal/20 text-brand-teal px-3 py-1 text-sm rounded-full font-medium">
                    {course.level}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p>{course.description}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users size={16} />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock size={16} />
                    <span>{course.duration}</span>
                  </div>
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
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif font-bold">Upcoming Live Classes</h2>
          <Button variant="outline" onClick={() => navigate('/live-classes')}>View All Classes</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map(event => (
            <Card key={event.id} className="overflow-hidden flex flex-col md:flex-row card-hover">
              <div className="aspect-video md:w-1/3 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>by {event.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{event.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full" variant="outline">Join Class</Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="bg-muted rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-serif font-bold text-center">Learning Paths</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Follow our structured learning paths designed by experts to help you achieve mastery in various aspects of grammar and communication.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center card-hover">
            <CardHeader>
              <div className="mx-auto bg-brand-blue/10 p-4 rounded-full">
                <BookOpen size={32} className="text-brand-blue" />
              </div>
              <CardTitle className="mt-4">Grammar Fundamentals</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Master the basics of grammar, from parts of speech to sentence structure.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Explore Path</Button>
            </CardFooter>
          </Card>
          
          <Card className="text-center card-hover">
            <CardHeader>
              <div className="mx-auto bg-brand-teal/10 p-4 rounded-full">
                <BookOpen size={32} className="text-brand-teal" />
              </div>
              <CardTitle className="mt-4">Professional Writing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Enhance your professional writing skills for business communication.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Explore Path</Button>
            </CardFooter>
          </Card>
          
          <Card className="text-center card-hover">
            <CardHeader>
              <div className="mx-auto bg-brand-orange/10 p-4 rounded-full">
                <BookOpen size={32} className="text-brand-orange" />
              </div>
              <CardTitle className="mt-4">Creative Writing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Learn the grammar rules and techniques essential for creative writing.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Explore Path</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-teal to-brand-blue text-white rounded-xl overflow-hidden">
        <div className="p-8 md:p-12 lg:p-16 space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center">Ready to Master Grammar?</h2>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-auto">
            Join thousands of students who have transformed their communication skills with Grammer's Gallery.
          </p>
          <div className="flex justify-center mt-8">
            <Button 
              size="lg"
              className="bg-white text-brand-blue hover:bg-gray-100"
              onClick={() => navigate('/auth')}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
