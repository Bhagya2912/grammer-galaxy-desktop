import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Book, CheckCircle, Clock, BarChart3, Users, BookText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // If no user is logged in, show a message
  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authorization Required</CardTitle>
            <CardDescription>Please log in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.href = '/auth'}>Login Now</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data for student dashboard
  const studentDashboardData = {
    enrolledCourses: [
      { 
        id: '1', 
        title: 'English Grammar Basics',
        progress: 65, 
        nextLesson: 'Using Commas Correctly',
        totalLessons: 24,
        completedLessons: 16,
      },
      { 
        id: '3', 
        title: 'Business Communication',
        progress: 30, 
        nextLesson: 'Email Etiquette',
        totalLessons: 32,
        completedLessons: 10,
      },
    ],
    recentActivity: [
      { type: 'lesson', title: 'Completed "Subject-Verb Agreement"', date: '2025-05-05T14:32:00' },
      { type: 'quiz', title: 'Scored 85% on "Punctuation Quiz"', date: '2025-05-04T10:15:00' },
      { type: 'forum', title: 'Posted in "Common Grammar Mistakes" discussion', date: '2025-05-03T16:48:00' },
    ],
    upcomingClasses: [
      { 
        id: '1', 
        title: 'Common Grammar Mistakes', 
        date: '2025-05-15T18:00:00',
        instructor: 'Professor Johnson'
      },
    ],
    achievements: [
      { title: 'Fast Learner', description: 'Completed 5 lessons in one day', icon: <Clock size={24} /> },
      { title: 'Quiz Master', description: 'Scored 100% on 3 consecutive quizzes', icon: <CheckCircle size={24} /> },
      { title: 'Bookworm', description: 'Enrolled in 5 courses', icon: <BookText size={24} /> },
    ]
  };

  // Mock data for admin/staff dashboard
  const adminDashboardData = {
    statistics: [
      { title: 'Total Students', value: 1542, icon: <Users size={24} />, change: '+12%' },
      { title: 'Active Courses', value: 24, icon: <Book size={24} />, change: '+2' },
      { title: 'Course Completion', value: '78%', icon: <CheckCircle size={24} />, change: '+5%' },
      { title: 'Forum Topics', value: 156, icon: <BookText size={24} />, change: '+8' },
    ],
    popularCourses: [
      { title: 'English Grammar Basics', students: 435, completion: 82 },
      { title: 'Advanced Punctuation', students: 289, completion: 75 },
      { title: 'Business Communication', students: 312, completion: 68 },
    ],
    recentActivity: [
      { user: 'Emily Johnson', action: 'enrolled in "English Grammar Basics"', date: '2025-05-05T14:32:00' },
      { user: 'Michael Smith', action: 'completed "Advanced Punctuation" course', date: '2025-05-04T10:15:00' },
      { user: 'Sarah Williams', action: 'posted in forum "Help with Tenses"', date: '2025-05-03T16:48:00' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        
        {(user.role === 'admin' || user.role === 'staff') && (
          <Button>Create New Course</Button>
        )}
      </div>
      
      {/* Different dashboard views based on user role */}
      {user.role === 'student' ? (
        // Student Dashboard
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Summary */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Courses Enrolled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{studentDashboardData.enrolledCourses.length}</div>
                  <p className="text-muted-foreground">Out of 24 available courses</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">48%</div>
                  <Progress value={48} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Next Live Class</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">{studentDashboardData.upcomingClasses[0].title}</div>
                  <p className="text-muted-foreground">
                    {new Date(studentDashboardData.upcomingClasses[0].date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Current Courses & Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:row-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Current Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {studentDashboardData.enrolledCourses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{course.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                      </div>
                      
                      <Progress value={course.progress} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Next: {course.nextLesson}</span>
                        <Button variant="ghost" size="sm" className="h-8 px-2">Continue</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {studentDashboardData.recentActivity.map((activity, index) => (
                      <li key={index} className="flex gap-3 items-start">
                        <div className="rounded-full p-1.5 bg-muted">
                          {activity.type === 'lesson' ? (
                            <BookOpen size={16} />
                          ) : activity.type === 'quiz' ? (
                            <CheckCircle size={16} />
                          ) : (
                            <BookText size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Upcoming Live Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {studentDashboardData.upcomingClasses.map((classItem, index) => (
                      <li key={index} className="space-y-1">
                        <div className="font-medium">{classItem.title}</div>
                        <div className="text-sm text-muted-foreground">
                          by {classItem.instructor} • {new Date(classItem.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">Join Class</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Courses Tab */}
          <TabsContent value="courses">
            <h2 className="text-xl font-bold mb-4">My Enrolled Courses</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {studentDashboardData.enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>
                        {course.completedLessons} of {course.totalLessons} lessons completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={course.progress} className="h-2" />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Progress: {course.progress}%</span>
                        <span>{course.completedLessons}/{course.totalLessons}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <span className="font-medium">Next Lesson:</span>
                        <span>{course.nextLesson}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1">Continue</Button>
                        <Button variant="outline">View Course</Button>
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
          
          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <h2 className="text-xl font-bold mb-4">Your Achievements</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {studentDashboardData.achievements.map((achievement, index) => (
                <Card key={index} className="text-center p-6">
                  <div className="inline-flex items-center justify-center rounded-full p-3 bg-primary/10 text-primary mb-3">
                    {achievement.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{achievement.title}</h3>
                  <p className="text-muted-foreground">{achievement.description}</p>
                </Card>
              ))}
              
              <Card className="border-dashed bg-muted/50 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center rounded-full p-3 bg-muted mb-3">
                    <BookOpen size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">More to Unlock</h3>
                  <p className="text-muted-foreground">
                    Keep learning to earn more achievements
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // Admin/Staff Dashboard
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {adminDashboardData.statistics.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{stat.title}</CardTitle>
                      <div className="text-primary">{stat.icon}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {stat.change}
                      </span> from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Popular Courses & Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Popular Courses</CardTitle>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-6">
                    {adminDashboardData.popularCourses.map((course, index) => (
                      <li key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{course.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {course.students} students
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Completion rate: {course.completion}%
                          </p>
                          <Progress value={course.completion} className="h-2 w-24" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {adminDashboardData.recentActivity.map((activity, index) => (
                      <li key={index} className="space-y-1">
                        <p>
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Chart Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Student Enrollment</CardTitle>
                  <BarChart3 size={20} />
                </div>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other Admin Tabs (simplified for demo) */}
          <TabsContent value="courses">
            <h2 className="text-xl font-bold mb-4">Course Management</h2>
            <p className="text-muted-foreground mb-6">Manage your courses, lessons, and quizzes</p>
            
            <div className="flex justify-between mb-6">
              <div className="flex gap-2">
                <Button>New Course</Button>
                <Button variant="outline">Import</Button>
              </div>
              <Input className="max-w-xs" placeholder="Search courses..." />
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="border-b py-4 px-6 font-medium flex items-center">
                  <div className="flex-1">Course Name</div>
                  <div className="w-32 text-right">Students</div>
                  <div className="w-32 text-right">Completion</div>
                  <div className="w-24 text-right">Actions</div>
                </div>
                
                {adminDashboardData.popularCourses.map((course, index) => (
                  <div key={index} className="py-4 px-6 flex items-center border-b last:border-0">
                    <div className="flex-1 font-medium">{course.title}</div>
                    <div className="w-32 text-right">{course.students}</div>
                    <div className="w-32 text-right">{course.completion}%</div>
                    <div className="w-24 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students">
            <h2 className="text-xl font-bold mb-4">Student Management</h2>
            <p className="text-muted-foreground mb-6">View and manage student accounts and progress</p>
            
            <Card className="p-6">
              <p className="text-center text-muted-foreground">Student list will be displayed here</p>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Dashboard;
