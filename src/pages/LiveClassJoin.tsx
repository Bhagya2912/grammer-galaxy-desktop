
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import VideoMeeting from '@/components/VideoMeeting';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Users } from 'lucide-react';

// Mock live classes (should match the data in LiveClasses.tsx)
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

const LiveClassJoin: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  
  useEffect(() => {
    // In a real app, this would fetch class details from an API
    const fetchClassDetails = () => {
      setIsLoading(true);
      
      // Find the class with the matching ID from our mock data
      const foundClass = upcomingClasses.find(c => c.id === classId);
      
      if (foundClass) {
        setCurrentClass(foundClass);
        // Simulate loading participants
        setParticipants([
          foundClass.instructor.name,
          'Student1', 
          'Student2', 
          'Student3', 
          `You (${Math.floor(Math.random() * 1000)})`
        ]);
        toast({
          title: "Joined class successfully",
          description: `You've joined ${foundClass.title} with ${foundClass.instructor.name}`,
        });
      } else {
        toast({
          title: "Class not found",
          description: "This class may have ended or doesn't exist",
          variant: "destructive"
        });
        // Redirect back to live classes page after a short delay
        setTimeout(() => navigate('/live-classes'), 2000);
      }
      
      setIsLoading(false);
    };

    fetchClassDetails();
  }, [classId, navigate, toast]);

  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
    toast({
      title: isMicEnabled ? "Microphone muted" : "Microphone unmuted",
      description: isMicEnabled ? "Others cannot hear you now" : "Others can hear you now",
    });
  };

  const toggleCamera = () => {
    setIsCameraEnabled(!isCameraEnabled);
    toast({
      title: isCameraEnabled ? "Camera turned off" : "Camera turned on",
      description: isCameraEnabled ? "Others cannot see you now" : "Others can see you now",
    });
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const leaveClass = () => {
    toast({
      title: "Left class",
      description: "You have successfully left the class.",
    });
    navigate('/live-classes');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Joining class session...</p>
        </div>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
        <p className="text-muted-foreground mb-6">This class may have ended or doesn't exist</p>
        <Button onClick={() => navigate('/live-classes')}>
          Return to Live Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">{currentClass.title}</h1>
          <p className="text-muted-foreground">
            Live session with {currentClass.instructor.name}
          </p>
        </div>
        <Button variant="destructive" onClick={leaveClass}>
          Leave Class
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <VideoMeeting 
                meetingId={classId || '1'}
                micEnabled={isMicEnabled}
                cameraEnabled={isCameraEnabled}
                isHost={false}
              />
            </CardContent>
            <CardFooter className="flex justify-center gap-2 p-4 bg-muted/30">
              <Button 
                variant="outline" 
                size="icon" 
                title={isMicEnabled ? "Mute microphone" : "Unmute microphone"}
                onClick={toggleMic}
                className={!isMicEnabled ? "bg-red-100" : ""}
              >
                {isMicEnabled ? <span>🎤</span> : <span>🔇</span>}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                title={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
                onClick={toggleCamera}
                className={!isCameraEnabled ? "bg-red-100" : ""}
              >
                {isCameraEnabled ? <span>📹</span> : <span>🚫</span>}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                title={showChat ? "Close chat" : "Open chat"}
                onClick={toggleChat}
                className={showChat ? "bg-green-100" : ""}
              >
                <MessageSquare size={20} />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {showChat ? (
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle>Class Chat</CardTitle>
                <CardDescription>Ask questions and participate</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] overflow-y-auto border-t border-b">
                <div className="space-y-4 pt-4">
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-xs font-medium">{currentClass.instructor.name}</p>
                    <p className="text-sm">Welcome everyone to today's session! Feel free to ask questions.</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-xs font-medium">Student1</p>
                    <p className="text-sm">Is this session being recorded?</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-xs font-medium">{currentClass.instructor.name}</p>
                    <p className="text-sm">Yes, recordings will be available after class ends.</p>
                  </div>
                  {/* More mock chat messages */}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button>Send</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={18} />
                  Participants ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {participants.map((participant, index) => (
                    <li key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {participant[0]}
                      </div>
                      <span className="text-sm font-medium">
                        {participant}
                        {participant === currentClass.instructor.name && 
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-1 rounded">Host</span>
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={currentClass.instructor.avatar} 
                alt={currentClass.instructor.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="font-medium">{currentClass.instructor.name}</p>
              <p className="text-sm text-muted-foreground">{currentClass.instructor.bio}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Duration:</strong> {currentClass.duration}
          </p>
          <p>{currentClass.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveClassJoin;
