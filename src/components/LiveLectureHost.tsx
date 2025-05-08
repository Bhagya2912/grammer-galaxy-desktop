
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Video, VideoOff, Mic, MicOff, Users, Presentation, Share2, MessageSquare, Monitor } from 'lucide-react';
import VideoMeeting from './VideoMeeting';

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
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

  // Toggle functions for controls
  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    toast({
      title: micEnabled ? "Microphone muted" : "Microphone unmuted",
      description: micEnabled ? "Others cannot hear you now" : "Others can hear you now",
    });
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    toast({
      title: cameraEnabled ? "Camera turned off" : "Camera turned on",
      description: cameraEnabled ? "Others cannot see you now" : "Others can see you now",
    });
  };

  const toggleScreenShare = () => {
    setScreenShareEnabled(!screenShareEnabled);
    toast({
      title: screenShareEnabled ? "Screen sharing stopped" : "Screen sharing started",
      description: screenShareEnabled ? "Your screen is no longer shared" : "Your screen is now visible to attendees",
    });
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const shareLectureLink = () => {
    // In a real app, this would generate a shareable link
    const shareableLink = `https://grammers-gallery.com/join/${streamKey}`;
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Link copied",
      description: "Lecture link has been copied to clipboard",
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
      {!isStreaming ? (
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
              <Label htmlFor="streamKey">Meeting ID</Label>
              <div className="flex gap-2">
                <Input 
                  id="streamKey"
                  placeholder="Your unique meeting ID" 
                  value={streamKey} 
                  onChange={(e) => setStreamKey(e.target.value)}
                  disabled={isStreaming}
                />
                <Button 
                  variant="outline" 
                  disabled={isStreaming}
                  onClick={() => {
                    const randomId = `grammar-${Math.random().toString(36).substring(2, 8)}`;
                    setStreamKey(randomId);
                  }}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This is your unique meeting identifier. Share it with students to join.
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
            <Button onClick={startStream} className="w-full">
              <Video className="mr-2 h-4 w-4" /> 
              Start Lecture
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Lecture: {lectureTitle}</CardTitle>
              <CardDescription>
                Currently Broadcasting - {attendees.length} students attending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoMeeting 
                meetingId={streamKey}
                micEnabled={micEnabled}
                cameraEnabled={cameraEnabled}
                screenShareEnabled={screenShareEnabled}
                isHost={true}
              />
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                title={micEnabled ? "Mute microphone" : "Unmute microphone"}
                onClick={toggleMic}
                className={!micEnabled ? "bg-red-100" : ""}
              >
                {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
                onClick={toggleCamera}
                className={!cameraEnabled ? "bg-red-100" : ""}
              >
                {cameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                title={screenShareEnabled ? "Stop sharing screen" : "Share screen"}
                onClick={toggleScreenShare}
                className={screenShareEnabled ? "bg-green-100" : ""}
              >
                <Presentation size={20} />
              </Button>
              <Button variant="outline" size="icon" title="Share lecture link" onClick={shareLectureLink}>
                <Share2 size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                title={chatOpen ? "Close chat" : "Open chat with students"}
                onClick={toggleChat}
                className={chatOpen ? "bg-green-100" : ""}
              >
                <MessageSquare size={20} />
              </Button>
            </CardFooter>
          </Card>
          
          <div className="flex justify-center">
            <Button onClick={stopStream} variant="destructive" className="px-8">
              End Lecture
            </Button>
          </div>
          
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
