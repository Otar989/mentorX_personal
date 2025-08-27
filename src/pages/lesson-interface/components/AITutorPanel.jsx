import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AITutorPanel = ({ 
  isOpen = false,
  onToggle = () => {},
  onClose = () => {},
  currentLessonContext = "",
  className = ""
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [liveCaption, setLiveCaption] = useState("");
  const [connectionQuality, setConnectionQuality] = useState("excellent");
  const [micLevel, setMicLevel] = useState(0);
  const conversationRef = useRef(null);

  // Mock conversation data
  const mockConversation = [
    {
      id: 1,
      type: 'ai',
      message: "Hello! I'm your AI tutor. I can see you're learning about React Hooks. What specific aspect would you like to discuss?",
      timestamp: new Date(Date.now() - 300000),
      audioUrl: null
    },
    {
      id: 2,
      type: 'user',
      message: "I'm confused about the difference between useState and useReducer. When should I use each one?",
      timestamp: new Date(Date.now() - 240000),
      audioUrl: null
    },
    {
      id: 3,
      type: 'ai',
      message: "Great question! useState is perfect for simple state management, while useReducer shines with complex state logic. Let me explain with examples...",
      timestamp: new Date(Date.now() - 180000),
      audioUrl: null
    }
  ];

  const [messages, setMessages] = useState(mockConversation);

  const connectionQualities = {
    excellent: { color: 'text-success', icon: 'Wifi', bars: 4 },
    good: { color: 'text-warning', icon: 'Wifi', bars: 3 },
    poor: { color: 'text-error', icon: 'WifiOff', bars: 1 }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate WebRTC connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      addSystemMessage("Connected to AI Tutor. You can start speaking now!");
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    setLiveCaption("");
    addSystemMessage("Disconnected from AI Tutor.");
  };

  const addSystemMessage = (message) => {
    const systemMessage = {
      id: Date.now(),
      type: 'system',
      message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const startListening = () => {
    if (!isConnected) return;
    setIsListening(true);
    setLiveCaption("Listening...");
    
    // Simulate live caption
    setTimeout(() => {
      setLiveCaption("I have a question about useEffect dependencies...");
    }, 1000);
  };

  const stopListening = () => {
    setIsListening(false);
    setLiveCaption("");
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: "I have a question about useEffect dependencies. How do I know what to include?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      setIsSpeaking(true);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: "Excellent question! The dependency array in useEffect should include all values from component scope that are used inside the effect. Let me break this down for you...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Simulate microphone level
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setMicLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setMicLevel(0);
    }
  }, [isListening]);

  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef?.current) {
      conversationRef.current.scrollTop = conversationRef?.current?.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        variant="default"
        size="icon"
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-glass-lg"
      >
        <Icon name="Bot" size={24} />
      </Button>
    );
  }

  return (
    <div className={`fixed inset-y-0 right-0 w-96 glass-lg border-l border-white/20 z-40 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-success animate-pulse' : 'bg-muted'
          }`} />
          <div>
            <h3 className="font-semibold">AI Tutor</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="flex items-center gap-1">
              <Icon 
                name={connectionQualities?.[connectionQuality]?.icon} 
                size={16} 
                className={connectionQualities?.[connectionQuality]?.color}
              />
              <span className="text-xs text-muted-foreground">
                {connectionQuality}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
      {/* Connection Status */}
      {!isConnected && (
        <div className="p-4 border-b border-white/10">
          <div className="text-center space-y-3">
            <Icon name="Bot" size={48} className="mx-auto text-primary" />
            <div>
              <h4 className="font-medium">AI Voice Tutor</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Get instant help with your lesson content through voice conversation
              </p>
            </div>
            <Button
              variant="default"
              onClick={handleConnect}
              disabled={isConnecting}
              loading={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Start Voice Session'}
            </Button>
          </div>
        </div>
      )}
      {/* Voice Controls */}
      {isConnected && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-center gap-4">
            {/* Microphone Button */}
            <div className="relative">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="icon"
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className="w-12 h-12 rounded-full"
              >
                <Icon name={isListening ? "MicOff" : "Mic"} size={20} />
              </Button>
              
              {/* Microphone Level Indicator */}
              {isListening && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-100"
                      style={{ width: `${micLevel}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Speaker Indicator */}
            <div className={`w-3 h-3 rounded-full ${
              isSpeaking ? 'bg-primary animate-pulse' : 'bg-muted'
            }`} />

            {/* Disconnect Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleDisconnect}
              className="w-10 h-10"
            >
              <Icon name="PhoneOff" size={16} />
            </Button>
          </div>

          {/* Live Caption */}
          {liveCaption && (
            <div className="mt-3 p-2 bg-primary/10 rounded-lg">
              <p className="text-sm text-center">{liveCaption}</p>
            </div>
          )}

          {/* Instructions */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            Hold to speak • Release to send
          </p>
        </div>
      )}
      {/* Conversation History */}
      {isConnected && (
        <div 
          ref={conversationRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages?.map((message) => (
            <div
              key={message?.id}
              className={`flex ${
                message?.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`max-w-[80%] ${
                message?.type === 'system' ? 'w-full' : ''
              }`}>
                {message?.type === 'system' ? (
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {message?.message}
                    </span>
                  </div>
                ) : (
                  <div className={`p-3 rounded-lg ${
                    message?.type === 'user' ?'bg-primary text-primary-foreground ml-4' :'bg-muted mr-4'
                  }`}>
                    <div className="flex items-start gap-2">
                      {message?.type === 'ai' && (
                        <Icon name="Bot" size={16} className="flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message?.message}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {formatTime(message?.timestamp)}
                        </span>
                      </div>
                      {message?.type === 'ai' && isSpeaking && message?.id === messages?.[messages?.length - 1]?.id && (
                        <Icon name="Volume2" size={16} className="flex-shrink-0 mt-0.5 animate-pulse" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Footer */}
      {isConnected && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Session: {formatTime(new Date())}</span>
            <div className="flex items-center gap-2">
              <span>Quality: {connectionQuality}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                <Icon name="Download" size={12} className="mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITutorPanel;