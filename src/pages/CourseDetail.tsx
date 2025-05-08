import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Users, File, PlayCircle, BookOpen, Award } from 'lucide-react';

// Mock courses data (would typically come from an API)
const coursesData = [
  {
    id: '1',
    title: 'English Grammar Basics',
    description: 'Master the fundamental rules of English grammar with our comprehensive course. This course is designed for beginners who want to build a strong foundation in English grammar. You will learn about parts of speech, sentence structure, common grammatical errors, and much more.',
    level: 'Beginner',
    category: 'Grammar',
    students: 1245,
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    popular: true,
    price: 'Free',
    instructor: {
      name: 'Dr. Sarah Johnson',
      bio: 'PhD in English Literature with over 15 years of teaching experience. Expert in grammar and writing.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    modules: [
      {
        title: 'Introduction to Grammar',
        lessons: [
          { title: 'What is Grammar?', duration: '10 mins', type: 'video' },
          { title: 'Why Grammar Matters', duration: '8 mins', type: 'reading' },
          { title: 'Course Overview', duration: '5 mins', type: 'video' },
        ]
      },
      {
        title: 'Parts of Speech',
        lessons: [
          { title: 'Nouns', duration: '15 mins', type: 'video' },
          { title: 'Verbs', duration: '12 mins', type: 'video' },
          { title: 'Adjectives', duration: '10 mins', type: 'video' },
          { title: 'Adverbs', duration: '10 mins', type: 'video' },
          { title: 'Practice Exercise', duration: '20 mins', type: 'quiz' },
        ]
      },
      {
        title: 'Sentence Structure',
        lessons: [
          { title: 'Subject and Predicate', duration: '12 mins', type: 'video' },
          { title: 'Types of Sentences', duration: '15 mins', type: 'video' },
          { title: 'Common Sentence Errors', duration: '18 mins', type: 'video' },
          { title: 'Sentence Structure Quiz', duration: '15 mins', type: 'quiz' },
        ]
      },
    ],
    reviews: [
      { user: 'Michael S.', rating: 5, comment: 'Excellent course! The explanations are clear and concise.' },
      { user: 'Jennifer L.', rating: 4, comment: 'Very helpful for improving my writing skills.' },
      { user: 'Robert K.', rating: 5, comment: 'The practice exercises really helped me understand the concepts.' },
    ]
  },
  {
    id: '2',
    title: 'Advanced English Writing',
    description: 'Take your English writing skills to the next level with our advanced course. Perfect for intermediate to advanced learners who want to refine their writing abilities. This course covers advanced grammar concepts, stylistic techniques, persuasive writing, and professional documentation.',
    level: 'Advanced',
    category: 'Writing',
    students: 876,
    duration: '8 weeks',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    popular: true,
    price: '$49.99',
    instructor: {
      name: 'Prof. Mark Wilson',
      bio: 'Award-winning author and professor with 20+ years of experience teaching advanced writing techniques.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    modules: [
      {
        title: 'Advanced Writing Principles',
        lessons: [
          { title: 'Beyond Basic Grammar', duration: '15 mins', type: 'video' },
          { title: 'Style and Tone', duration: '12 mins', type: 'reading' },
          { title: 'Writing for Different Audiences', duration: '18 mins', type: 'video' },
        ]
      },
      {
        title: 'Persuasive Writing',
        lessons: [
          { title: 'Elements of Persuasion', duration: '20 mins', type: 'video' },
          { title: 'Logical Arguments', duration: '15 mins', type: 'video' },
          { title: 'Emotional Appeals', duration: '12 mins', type: 'video' },
          { title: 'Persuasive Writing Exercise', duration: '30 mins', type: 'quiz' },
        ]
      },
      {
        title: 'Professional Documentation',
        lessons: [
          { title: 'Business Reports', duration: '25 mins', type: 'video' },
          { title: 'Technical Documentation', duration: '22 mins', type: 'video' },
          { title: 'Academic Writing', duration: '20 mins', type: 'video' },
          { title: 'Professional Writing Assessment', duration: '45 mins', type: 'quiz' },
        ]
      },
      {
        title: 'Creative Writing Techniques',
        lessons: [
          { title: 'Narrative Structures', duration: '18 mins', type: 'video' },
          { title: 'Character Development', duration: '20 mins', type: 'video' },
          { title: 'Descriptive Writing', duration: '15 mins', type: 'video' },
          { title: 'Creative Writing Project', duration: '60 mins', type: 'quiz' },
        ]
      },
    ],
    reviews: [
      { user: 'Emily R.', rating: 5, comment: 'This course transformed my writing completely. Highly recommended!' },
      { user: 'David T.', rating: 5, comment: 'Professor Wilson's teaching style is engaging and effective.' },
      { user: 'Sophia K.', rating: 4, comment: 'Challenging but extremely rewarding. Great for serious writers.' },
      { user: 'James L.', rating: 5, comment: 'The professional documentation section was particularly helpful for my career.' },
    ]
  }
  // ... keep existing code (additional courses data if any)
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the course by ID
  const course = coursesData.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Course Not Found</h2>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
        </Card>
      </div>
    );
  }

  // Calculate total lessons and duration
  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalVideos = course.modules.reduce((sum, module) => 
    sum + module.lessons.filter(lesson => lesson.type === 'video').length, 0
  );
  const totalQuizzes = course.modules.reduce((sum, module) => 
    sum + module.lessons.filter(lesson => lesson.type === 'quiz').length, 0
  );
  
  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="relative">
        <div className="h-48 md:h-64 rounded-lg overflow-hidden">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg flex items-end">
          <div className="p-6 space-y-2">
            <Badge variant="secondary" className="mb-2">{course.level}</Badge>
            <h1 className="text-3xl font-serif font-bold">{course.title}</h1>
            <p className="text-lg text-muted-foreground">
              {course.category} • {course.duration}
            </p>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <span>Understand fundamental grammar rules</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <span>Identify and use parts of speech correctly</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <span>Structure sentences properly</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <span>Avoid common grammatical errors</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <span>Apply grammar rules in your writing</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <span>Improve overall communication skills</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Course Content Preview</h2>
                <div className="space-y-4">
                  {course.modules.slice(0, 1).map((module, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4 font-medium">
                        {module.title}
                      </div>
                      <ul className="divide-y">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              {lesson.type === 'video' ? (
                                <PlayCircle size={20} className="text-muted-foreground" />
                              ) : lesson.type === 'quiz' ? (
                                <File size={20} className="text-muted-foreground" />
                              ) : (
                                <BookOpen size={20} className="text-muted-foreground" />
                              )}
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setActiveTab('curriculum')}>
                    View Full Curriculum
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{course.price}</div>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                  
                  <Button className="w-full">Enroll Now</Button>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Course Duration</p>
                        <p className="text-sm text-muted-foreground">{course.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Total Lessons</p>
                        <p className="text-sm text-muted-foreground">{totalLessons} lessons</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <PlayCircle size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Video Lessons</p>
                        <p className="text-sm text-muted-foreground">{totalVideos} videos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <File size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Quizzes</p>
                        <p className="text-sm text-muted-foreground">{totalQuizzes} quizzes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Award size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Certificate</p>
                        <p className="text-sm text-muted-foreground">Upon completion</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-center">
                      <span className="font-medium text-muted-foreground">Not sure yet?</span><br />
                      Try the first module for free
                    </p>
                    <Button variant="link" className="w-full mt-2">Preview Course</Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Users size={20} className="text-muted-foreground" />
                  <span>{course.students} students enrolled</span>
                </div>
                <p className="text-sm text-muted-foreground">Last updated 2 months ago</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Curriculum Tab */}
        <TabsContent value="curriculum">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Course Curriculum</h2>
              <div className="text-sm text-muted-foreground">
                {totalLessons} lessons • Approximately {course.duration}
              </div>
            </div>
            
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 font-medium flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Module {index + 1}:</span>
                      <span>{module.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {module.lessons.length} lessons
                    </div>
                  </div>
                  <ul className="divide-y">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {lesson.type === 'video' ? (
                            <PlayCircle size={20} className="text-muted-foreground" />
                          ) : lesson.type === 'quiz' ? (
                            <File size={20} className="text-muted-foreground" />
                          ) : (
                            <BookOpen size={20} className="text-muted-foreground" />
                          )}
                          <span>{lesson.title}</span>
                          <Badge variant="outline" className="ml-2">{lesson.type}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button size="lg">Enroll Now</Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Instructor Tab */}
        <TabsContent value="instructor">
          <div className="max-w-3xl">
            <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
              <img 
                src={course.instructor.avatar} 
                alt={course.instructor.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold mb-2">{course.instructor.name}</h2>
                <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">View Profile</Button>
                  <Button variant="ghost" size="sm">Contact</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Other Courses by {course.instructor.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex p-4 items-center gap-4">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <BookOpen size={24} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Advanced Grammar Rules</h4>
                    <p className="text-sm text-muted-foreground">Intermediate • 8 weeks</p>
                  </div>
                </Card>
                <Card className="flex p-4 items-center gap-4">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <BookOpen size={24} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Writing for Academic Success</h4>
                    <p className="text-sm text-muted-foreground">Advanced • 10 weeks</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <div className="max-w-3xl space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="text-center">
                <div className="text-5xl font-bold">4.8</div>
                <div className="flex text-yellow-400 my-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Based on {course.reviews.length} reviews</div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-sm">5 stars</div>
                  <Progress value={80} className="flex-1 h-2" />
                  <div className="text-sm text-muted-foreground">80%</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">4 stars</div>
                  <Progress value={15} className="flex-1 h-2" />
                  <div className="text-sm text-muted-foreground">15%</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">3 stars</div>
                  <Progress value={5} className="flex-1 h-2" />
                  <div className="text-sm text-muted-foreground">5%</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">2 stars</div>
                  <Progress value={0} className="flex-1 h-2" />
                  <div className="text-sm text-muted-foreground">0%</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">1 star</div>
                  <Progress value={0} className="flex-1 h-2" />
                  <div className="text-sm text-muted-foreground">0%</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-medium">Student Reviews</h3>
              
              <div className="space-y-6">
                {course.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{review.user}</div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline">Write a Review</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetail;
