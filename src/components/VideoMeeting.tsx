
import React, { useEffect, useState } from 'react';
import { Video, VideoOff, User, Users, Presentation, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoMeetingProps {
  meetingId: string;
  micEnabled?: boolean;
  cameraEnabled?: boolean;
  screenShareEnabled?: boolean;
  isHost?: boolean;
}

const VideoMeeting: React.FC<VideoMeetingProps> = ({
  meetingId,
  micEnabled = true,
  cameraEnabled = true,
  screenShareEnabled = false,
  isHost = false,
}) => {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<string[]>(['Host', 'Student1', 'Student2']);
  const [activeParticipant, setActiveParticipant] = useState('Host');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // This would integrate with a real video API in a production app
  useEffect(() => {
    // Simulate connection to a video meeting
    const connectToMeeting = async () => {
      try {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsConnected(true);
        toast({
          title: "Connected to meeting",
          description: `Meeting ID: ${meetingId}`,
        });
      } catch (error) {
        if (connectionAttempts < 3) {
          setConnectionAttempts(prev => prev + 1);
          toast({
            title: "Connection failed",
            description: `Attempting to reconnect (${connectionAttempts + 1}/3)...`,
            variant: "destructive"
          });
          // Try again after a delay
          setTimeout(connectToMeeting, 2000);
        } else {
          toast({
            title: "Unable to connect",
            description: "Please check your internet connection and try again.",
            variant: "destructive"
          });
        }
      }
    };

    connectToMeeting();
    
    // Simulate participant changes
    const interval = setInterval(() => {
      // Randomly change active speaker
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      setActiveParticipant(randomParticipant);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [meetingId, toast, participants, connectionAttempts]);

  if (!isConnected) {
    return (
      <div className="aspect-video bg-black relative rounded-md overflow-hidden flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-medium">Connecting to meeting...</p>
          {connectionAttempts > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Attempt {connectionAttempts + 1}/3
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="video-meeting-container">
      {/* Main video display */}
      <div className="aspect-video bg-black relative rounded-md overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          {cameraEnabled ? (
            <div className="text-white text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2 mx-auto">
                <User size={48} className="text-primary" />
              </div>
              <p className="font-medium">{activeParticipant} (Active Speaker)</p>
              <p className="text-xs text-gray-400 mt-2">
                In a real implementation, this would show video from the active participant
              </p>
            </div>
          ) : (
            <div className="text-white text-center">
              <VideoOff size={48} className="mx-auto mb-2" />
              <p>Camera is turned off</p>
            </div>
          )}
        </div>
        
        {/* Screen share overlay if enabled */}
        {screenShareEnabled && (
          <div className="absolute inset-0 bg-blue-900 flex items-center justify-center">
            <div className="text-white text-center">
              <Monitor size={48} className="mx-auto mb-2" />
              <p>Screen is being shared</p>
              <p className="text-xs text-gray-400 mt-2">
                In a real implementation, this would show the shared screen content
              </p>
            </div>
          </div>
        )}
        
        {/* Recording indicator for hosts */}
        {isHost && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 text-xs rounded-md flex items-center">
            <span className="h-2 w-2 bg-white rounded-full mr-1 animate-pulse"></span>
            RECORDING
          </div>
        )}
        
        {/* Connection quality indicator */}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 text-xs rounded-md flex items-center">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
          Good Connection
        </div>
        
        {/* Participants count */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 text-xs rounded-md">
          {participants.length} participants
        </div>
        
        {/* Mic muted indicator */}
        {!micEnabled && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 text-xs rounded-md flex items-center">
            <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
            Mic Off
          </div>
        )}
      </div>
      
      {/* Participant thumbnails */}
      <div className="flex gap-2 overflow-x-auto py-2">
        {participants.map((participant, index) => (
          <div 
            key={index} 
            className={`relative min-w-[120px] h-[90px] rounded-md overflow-hidden 
              ${activeParticipant === participant ? 'ring-2 ring-primary' : 'bg-gray-800'}`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={20} className="text-gray-300" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2 text-xs text-white truncate">
              {participant}
              {index === 0 && !isHost && <span className="ml-1">(Host)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoMeeting;
