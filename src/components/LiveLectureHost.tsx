
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Video, Users, Presentation, Share2, MessageSquare } from 'lucide-react';

interface LiveLectureHostProps {
  onStreamStart?: (lectureDetails: any) => void;
  existingLecture?: any;
}

const LiveLectureHost: React.FC<LiveLectureHostProps> = ({ 
  onStreamStart,
  existingLecture
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lectureTitle, setLectureTitle] = useState(existingLecture?.title || '');
  const [lectureDescription, setLectureDescription] = useState(existingLecture?.description || '');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState('grammar-gallery-live');
  const [allowChat, setAllowChat] = useState(true);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [streamUrl, setStreamUrl] = useState('');

  // Mock function to start a stream
  const startStream = () => {
    if (!lectureTitle) {
      toast({
        title: "Missing information",
        description: "Please provide a lecture title before starting the stream.",
        variant: "destructive"
      });
      return;
    }

    // In a real application, this would connect to a streaming service API
    setIsStreaming(true);
    setStreamUrl(`https://stream.example.com/live/${streamKey}`);
    
    // Generate mock attendee list
    setAttendees(['Student1@email.com', 'Student2@email.com', 'Student3@email.com']);
    
    toast({
      title: "Stream started",
      description: "Your live lecture is now streaming. Students can join.",
    });

    if (onStreamStart) {
      onStreamStart({
        title: lectureTitle,
        description: lectureDescription,
        streamUrl,
        startedAt: new Date(),
        host: {
          name: user?.name,
          id: user?.id
        }
      });
    }
  };

  const stopStream = () => {
    setIsStreaming(false);
    setAttendees([]);
    toast({
      title: "Stream ended",
      description: "Your live lecture has ended. A recording will be available soon.",
    });
  };

  // Simulate new student joining every few seconds (for demo purposes)
  useEffect(() => {
    if (!isStreaming) return;
    
    const interval = setInterval(() => {
      const randomStudent = `Student${Math.floor(Math.random() * 100) + 4}@email.com`;
      if (!attendees.includes(randomStudent)) {
        setAttendees(prev => [...prev, randomStudent]);
        
        toast({
          title: "New attendee",
          description: `${randomStudent} has joined your lecture.`,
        });
      }
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, [isStreaming, attendees, toast]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized Access</CardTitle>
          <CardDescription>
            You must be an admin or staff member to host live lectures.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Host a Live Lecture</CardTitle>
          <CardDescription>
            Set up and manage your live lecture for students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lectureTitle">Lecture Title</Label>
            <Input 
              id="lectureTitle"
              placeholder="Introduction to Grammar Rules" 
              value={lectureTitle} 
              onChange={(e) => setLectureTitle(e.target.value)} 
              disabled={isStreaming}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lectureDescription">Description</Label>
            <Textarea 
              id="lectureDescription"
              placeholder="Provide a brief description of your lecture..." 
              value={lectureDescription} 
              onChange={(e) => setLectureDescription(e.target.value)}
              disabled={isStreaming}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="streamKey">Stream Key</Label>
            <div className="flex gap-2">
              <Input 
                id="streamKey"
                placeholder="Your unique stream key" 
                value={streamKey} 
                onChange={(e) => setStreamKey(e.target.value)}
                disabled={isStreaming}
              />
              <Button variant="outline" disabled={isStreaming}>
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is your unique stream identifier. Keep it private.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="allowChat"
              checked={allowChat}
              onCheckedChange={setAllowChat}
              disabled={isStreaming}
            />
            <Label htmlFor="allowChat">Enable student chat</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isStreaming ? (
            <Button onClick={startStream} className="w-full">
              <Video className="mr-2 h-4 w-4" /> 
              Start Streaming
            </Button>
          ) : (
            <Button onClick={stopStream} variant="destructive" className="w-full">
              <Video className="mr-2 h-4 w-4" /> 
              End Stream
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {isStreaming && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Stream</CardTitle>
              <CardDescription>
                {lectureTitle} - Currently Broadcasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for the video stream */}
              <div className="aspect-video bg-black relative rounded-md overflow-hidden flex items-center justify-center">
                <div className="text-white text-center">
                  <Video size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Your camera feed would appear here</p>
                  <p className="text-xs text-gray-400 mt-2">
                    In a real implementation, this would show your webcam feed
                  </p>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 text-xs rounded-md flex items-center">
                  <span className="h-2 w-2 bg-white rounded-full mr-1 animate-pulse"></span>
                  LIVE
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 text-xs rounded-md">
                  {attendees.length} viewers
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              <Button variant="outline" size="icon" title="Toggle microphone">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </Button>
              <Button variant="outline" size="icon" title="Toggle camera">
                <Video size={20} />
              </Button>
              <Button variant="outline" size="icon" title="Share screen">
                <Presentation size={20} />
              </Button>
              <Button variant="outline" size="icon" title="Share lecture link">
                <Share2 size={20} />
              </Button>
              <Button variant="outline" size="icon" title="Chat with students">
                <MessageSquare size={20} />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
              <CardDescription>
                {attendees.length} students currently watching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {attendees.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/40 rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <Users size={14} />
                      </div>
                      <span>{student}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {index < 2 ? '10m ago' : index < 5 ? '5m ago' : '1m ago'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LiveLectureHost;
