
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageCircle, Users, Award, MessageSquareText, PlusCircle, ThumbsUp, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

// Mock forum data
const forumData = {
  categories: [
    { id: '1', name: 'Grammar Questions', icon: <MessageCircle />, posts: 156 },
    { id: '2', name: 'Writing Help', icon: <MessageSquareText />, posts: 98 },
    { id: '3', name: 'Course Discussions', icon: <Users />, posts: 124 },
    { id: '4', name: 'Study Resources', icon: <Award />, posts: 65 },
  ],
  topics: [
    {
      id: '1',
      title: 'Help with Subject-Verb Agreement',
      content: 'I struggle with making subjects and verbs agree in my sentences. Can someone explain the basic rules?',
      author: {
        name: 'Emily Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'Student'
      },
      category: 'Grammar Questions',
      date: '2025-05-01T10:15:00',
      replies: 8,
      views: 156,
      lastReply: {
        author: {
          name: 'Professor Williams',
          avatar: '',
          role: 'Staff'
        },
        date: '2025-05-03T14:22:00'
      }
    },
    {
      id: '2',
      title: 'Advanced Punctuation in Academic Writing',
      content: 'When writing academic papers, I\'m unsure about the proper use of semicolons and colons. Any help would be appreciated.',
      author: {
        name: 'Michael Smith',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Student'
      },
      category: 'Writing Help',
      date: '2025-04-28T16:40:00',
      replies: 5,
      views: 98,
      lastReply: {
        author: {
          name: 'Sarah Johnson',
          avatar: '',
          role: 'Student'
        },
        date: '2025-05-02T09:15:00'
      }
    },
    {
      id: '3',
      title: 'Grammar Basics Course - Module 1 Discussion',
      content: 'Let\'s discuss the concepts covered in Module 1 of the Grammar Basics course. I found the parts of speech explanation very helpful.',
      author: {
        name: 'David Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        role: 'Student'
      },
      category: 'Course Discussions',
      date: '2025-05-02T11:30:00',
      replies: 12,
      views: 210,
      lastReply: {
        author: {
          name: 'Professor Johnson',
          avatar: '',
          role: 'Staff'
        },
        date: '2025-05-04T13:45:00'
      }
    },
    {
      id: '4',
      title: 'Recommended Grammar Books',
      content: 'Can anyone recommend good grammar reference books that explain rules in a simple way?',
      author: {
        name: 'Jennifer Lee',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        role: 'Student'
      },
      category: 'Study Resources',
      date: '2025-04-30T09:20:00',
      replies: 7,
      views: 120,
      lastReply: {
        author: {
          name: 'Robert Davis',
          avatar: '',
          role: 'Student'
        },
        date: '2025-05-03T16:10:00'
      }
    },
    {
      id: '5',
      title: 'Difference between \"its\" and \"it\'s\"',
      content: 'I always get confused between \"its\" and \"it\'s\". Can someone explain the difference clearly?',
      author: {
        name: 'Thomas Wright',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        role: 'Student'
      },
      category: 'Grammar Questions',
      date: '2025-05-03T15:45:00',
      replies: 4,
      views: 78,
      lastReply: {
        author: {
          name: 'Professor Williams',
          avatar: '',
          role: 'Staff'
        },
        date: '2025-05-04T10:20:00'
      }
    },
  ],
  popular: [
    {
      id: '6',
      title: 'Common Grammar Mistakes to Avoid',
      content: 'Let\'s compile a list of common grammar mistakes that people often make in their writing.',
      author: {
        name: 'Professor Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        role: 'Staff'
      },
      category: 'Grammar Questions',
      date: '2025-04-25T14:30:00',
      replies: 32,
      views: 456,
      lastReply: {
        author: {
          name: 'Samuel Chen',
          avatar: '',
          role: 'Student'
        },
        date: '2025-05-04T17:45:00'
      }
    },
    {
      id: '7',
      title: 'Tips for Improving Writing Skills',
      content: 'What are your best tips for improving writing skills? I\'d love to hear what works for everyone.',
      author: {
        name: 'Sarah Williams',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        role: 'Staff'
      },
      category: 'Writing Help',
      date: '2025-04-27T10:15:00',
      replies: 28,
      views: 415,
      lastReply: {
        author: {
          name: 'Emily Parker',
          avatar: '',
          role: 'Student'
        },
        date: '2025-05-04T09:30:00'
      }
    },
  ]
};

const Forum = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter topics by search query and category
  const filteredTopics = forumData.topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularTopics = forumData.popular.filter(topic => {
    const matchesSearch = searchQuery === '' || 
                          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Discussion Forum</h1>
          <p className="text-muted-foreground">Join the conversation and get help from the community</p>
        </div>
        
        <Button disabled={!user} onClick={() => console.log('Create new topic')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Topic
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                className={`flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors
                  ${activeCategory === 'all' ? 'bg-muted font-medium' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <MessageSquareText size={18} />
                <span>All Discussions</span>
              </div>
              {forumData.categories.map(category => (
                <div 
                  key={category.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors
                    ${activeCategory === category.name ? 'bg-muted font-medium' : ''}`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-auto">{category.posts}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {!user && (
            <Card>
              <CardHeader>
                <CardTitle>Join the Discussion</CardTitle>
                <CardDescription>Login to participate in forum discussions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => window.location.href = '/auth'}>
                  Login Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search forum topics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">Recent Discussions</TabsTrigger>
              <TabsTrigger value="popular">Popular Topics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="mt-6 space-y-4">
              {filteredTopics.length > 0 ? (
                filteredTopics.map(topic => (
                  <TopicCard key={topic.id} topic={topic} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No discussions match your search criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-6 space-y-4">
              {popularTopics.length > 0 ? (
                popularTopics.map(topic => (
                  <TopicCard key={topic.id} topic={topic} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No popular topics match your search criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Topic Card Component
const TopicCard = ({ topic }) => {
  return (
    <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl hover:text-brand-blue transition-colors">
              {topic.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Badge variant="outline">{topic.category}</Badge>
              <span className="text-xs ml-2">
                Posted {formatDistanceToNow(new Date(topic.date), { addSuffix: true })}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 mb-4">{topic.content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
              <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{topic.author.name}</p>
              <p className="text-xs text-muted-foreground">{topic.author.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span>{topic.replies} replies</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{topic.views} views</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={14} />
            <span>Last reply {formatDistanceToNow(new Date(topic.lastReply.date), { addSuffix: true })}</span>
            <span>by {topic.lastReply.author.name}</span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ThumbsUp size={14} className="mr-1" />
              <span className="text-xs">Like</span>
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle size={14} className="mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Forum;
