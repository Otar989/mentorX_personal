import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import VoiceVisualization from './components/VoiceVisualization';
import LiveTranscript from './components/LiveTranscript';
import ConnectionStatus from './components/ConnectionStatus';
import ChatInterface from './components/ChatInterface';
import ScreenSharePanel from './components/ScreenSharePanel';
import CallControls from './components/CallControls';
import LanguageToggle from './components/LanguageToggle';
import SessionRecording from './components/SessionRecording';
import ContextualHelp from './components/ContextualHelp';
import { aiVoiceTutor, aiAudioService } from '../../services/openaiService';
import { supabase } from '../../lib/supabase';

const AIVoiceTutor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionType = location?.state?.sessionType || 'general';
  
  // Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Voice session state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ru');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [voiceActivityLevel, setVoiceActivityLevel] = useState(0);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Interface state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);
  
  // AI Integration state
  const [transcript, setTranscript] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: Date.now(),
      type: 'ai',
      content: 'Привет! Я ваш AI Voice Tutor. Готов помочь вам в изучении любой темы. О чем хотите поговорить?',
      timestamp: new Date(),
      attachments: []
    }
  ]);
  const [sessionData, setSessionData] = useState({
    startTime: null,
    duration: 0,
    topicsCovered: [],
    questionsAsked: 0
  });

  const currentLesson = location?.state?.lesson || {
    id: null,
    title: 'Общая сессия с AI Tutor',
    progress: 0,
    currentTopic: 'Открытое обучение',
    hints: [
      'Говорите четко и не спеша для лучшего распознавания речи',
      'Задавайте конкретные вопросы для получения детальных ответов',
      'Используйте функцию чата для отправки кода или ссылок'
    ]
  };

  // WebRTC and audio management
  const localStreamRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const sessionIdRef = useRef(null);

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // AI Voice session handlers
  const handleStartCall = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices?.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      localStreamRef.current = stream;
      setIsCallActive(true);
      
      // Initialize AI tutor session
      const courseContext = location?.state?.course || null;
      const lessonContext = location?.state?.lesson || null;
      aiVoiceTutor?.initializeSession(courseContext, lessonContext);
      
      // Start session tracking
      sessionIdRef.current = await startTutorSession();
      
      // Setup voice activity detection
      setupVoiceActivityDetection(stream);
      
      // Start speech recognition
      startSpeechRecognition();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Не удалось получить доступ к микрофону. Проверьте разрешения.');
    }
  };

  const handleEndCall = async () => {
    try {
      // Stop all streams and recognition
      if (localStreamRef?.current) {
        localStreamRef?.current?.getTracks()?.forEach(track => track?.stop());
        localStreamRef.current = null;
      }
      
      if (speechRecognitionRef?.current) {
        speechRecognitionRef?.current?.stop();
        speechRecognitionRef.current = null;
      }
      
      // End tutor session in database
      if (sessionIdRef?.current) {
        await endTutorSession(sessionIdRef?.current);
      }
      
      setIsCallActive(false);
      setIsListening(false);
      setShowEndCallConfirm(false);
      setVoiceActivityLevel(0);
      
      // Navigate back with session summary
      navigate(-1, { 
        state: { 
          sessionSummary: aiVoiceTutor?.getConversationSummary() 
        } 
      });
      
    } catch (error) {
      console.error('Error ending call:', error);
      setIsCallActive(false);
      setShowEndCallConfirm(false);
    }
  };

  // Speech recognition setup
  const startSpeechRecognition = () => {
    try {
      const recognition = aiAudioService?.startSpeechRecognition(
        handleSpeechResult,
        handleSpeechError,
        currentLanguage === 'ru' ? 'ru-RU' : 'en-US'
      );
      
      speechRecognitionRef.current = recognition;
      setIsListening(true);
      
    } catch (error) {
      console.error('Speech recognition not supported:', error);
      // Fallback to manual input mode
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: 'Автоматическое распознавание речи недоступно. Используйте текстовый чат.',
        timestamp: new Date()
      }]);
    }
  };

  // Handle speech recognition results
  const handleSpeechResult = async (result) => {
    if (result?.final && result?.final?.trim()) {
      const userInput = result?.final?.trim();
      
      // Add user input to transcript
      const userTranscript = {
        id: Date.now(),
        speaker: 'user',
        text: userInput,
        timestamp: new Date(),
        language: currentLanguage
      };
      
      setTranscript(prev => [...prev, userTranscript]);
      
      // Process with AI tutor
      try {
        setIsAIProcessing(true);
        const aiResponse = await aiVoiceTutor?.processVoiceInput(userInput, currentLanguage);
        
        // Add AI response to transcript
        const aiTranscript = {
          id: Date.now() + 1,
          speaker: 'ai',
          text: aiResponse?.text,
          timestamp: aiResponse?.timestamp,
          language: currentLanguage
        };
        
        setTranscript(prev => [...prev, aiTranscript]);
        
        // Convert AI response to speech
        if (isSpeakerOn && aiResponse?.text) {
          await aiAudioService?.textToSpeech(
            aiResponse?.text,
            currentLanguage === 'ru' ? 'ru-RU' : 'en-US'
          );
        }
        
        // Update session data
        setSessionData(prev => ({
          ...prev,
          questionsAsked: prev?.questionsAsked + 1,
          topicsCovered: [...new Set([...prev.topicsCovered, ...extractTopics(userInput)])]
        }));
        
      } catch (error) {
        console.error('Error processing AI response:', error);
        const errorTranscript = {
          id: Date.now() + 1,
          speaker: 'system',
          text: 'Извините, произошла ошибка при обработке вашего запроса.',
          timestamp: new Date(),
          language: currentLanguage
        };
        setTranscript(prev => [...prev, errorTranscript]);
      } finally {
        setIsAIProcessing(false);
      }
    }
  };

  // Handle speech recognition errors
  const handleSpeechError = (error) => {
    console.error('Speech recognition error:', error);
    setIsListening(false);
    
    // Try to restart recognition
    setTimeout(() => {
      if (isCallActive && speechRecognitionRef?.current) {
        try {
          speechRecognitionRef?.current?.start();
          setIsListening(true);
        } catch (e) {
          console.error('Failed to restart speech recognition:', e);
        }
      }
    }, 2000);
  };

  // Voice activity detection
  const setupVoiceActivityDetection = (stream) => {
    try {
      const audioContext = new AudioContext();
      const source = audioContext?.createMediaStreamSource(stream);
      const processor = audioContext?.createScriptProcessor(1024, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const input = e?.inputBuffer?.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < input?.length; i++) {
          sum += input?.[i] * input?.[i];
        }
        const volume = Math.sqrt(sum / input?.length);
        setVoiceActivityLevel(Math.min(volume * 50, 100));
      };
      
      source?.connect(processor);
      processor?.connect(audioContext?.destination);
      
    } catch (error) {
      console.error('Error setting up voice activity detection:', error);
    }
  };

  // Database session management
  const startTutorSession = async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return null;

      const { data: session, error } = await supabase?.from('tutor_sessions')?.insert([
          {
            student_id: user?.id,
            course_id: location?.state?.course?.id || null,
            lesson_id: location?.state?.lesson?.id || null,
            session_type: sessionType,
            started_at: new Date(),
            topics_covered: [],
            questions_asked: 0
          }
        ])?.select()?.single();

      if (error) {
        console.error('Error creating tutor session:', error);
        return null;
      }

      setSessionData(prev => ({
        ...prev,
        startTime: new Date(),
      }));

      return session?.id;
    } catch (error) {
      console.error('Error starting tutor session:', error);
      return null;
    }
  };

  const endTutorSession = async (sessionId) => {
    if (!sessionId) return;

    try {
      const summary = aiVoiceTutor?.getConversationSummary();
      
      await supabase?.from('tutor_sessions')?.update({
          ended_at: new Date(),
          duration_minutes: Math.round(summary?.duration / 60000) || 0,
          topics_covered: sessionData?.topicsCovered || [],
          questions_asked: sessionData?.questionsAsked || 0
        })?.eq('id', sessionId);

    } catch (error) {
      console.error('Error ending tutor session:', error);
    }
  };

  // Helper functions
  const extractTopics = (text) => {
    const topics = [];
    const lowerText = text?.toLowerCase() || '';
    
    if (lowerText?.includes('react') || lowerText?.includes('реакт')) topics?.push('React');
    if (lowerText?.includes('javascript') || lowerText?.includes('джаваскрипт')) topics?.push('JavaScript');
    if (lowerText?.includes('python') || lowerText?.includes('питон')) topics?.push('Python');
    if (lowerText?.includes('css') || lowerText?.includes('стили')) topics?.push('CSS');
    if (lowerText?.includes('html')) topics?.push('HTML');
    
    return topics;
  };

  const handleToggleMute = () => {
    if (localStreamRef?.current) {
      const audioTrack = localStreamRef?.current?.getAudioTracks()?.[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack?.enabled;
        setIsMuted(!audioTrack?.enabled);
      }
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    
    // Restart speech recognition with new language
    if (speechRecognitionRef?.current && isListening) {
      speechRecognitionRef?.current?.stop();
      setTimeout(() => {
        startSpeechRecognition();
      }, 500);
    }
  };

  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices?.getDisplayMedia({
          video: true,
          audio: true
        });
        
        setIsScreenSharing(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
        
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      setIsScreenSharing(false);
    }
  };

  // Chat handlers with AI integration
  const handleSendMessage = async (message, attachments = []) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      attachments
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // Process with AI tutor
    try {
      setIsAIProcessing(true);
      const aiResponse = await aiVoiceTutor?.processVoiceInput(message, currentLanguage);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse?.text,
        timestamp: aiResponse?.timestamp,
        attachments: []
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error processing chat message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Извините, произошла ошибка при обработке вашего сообщения.',
        timestamp: new Date(),
        attachments: []
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Help handlers
  const handleRequestHelp = async (topic) => {
    try {
      const helpResponse = await aiVoiceTutor?.getContextualHelp(topic);
      
      const helpMessage = {
        id: Date.now(),
        type: 'help',
        content: helpResponse?.content,
        timestamp: helpResponse?.timestamp,
        topic
      };
      
      setChatMessages(prev => [...prev, helpMessage]);
    } catch (error) {
      console.error('Error getting contextual help:', error);
    }
  };

  // Auto-hide mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Initialize call on mount if needed
  useEffect(() => {
    if (sessionType === 'auto-start') {
      handleStartCall();
    }
  }, [sessionType]);

  // Connection quality monitoring
  useEffect(() => {
    if (isCallActive) {
      let interval = setInterval(() => {
        // Simple connection quality simulation
        const qualities = ['excellent', 'good', 'poor'];
        const weights = [0.7, 0.25, 0.05]; // Mostly excellent
        const random = Math.random();
        let quality = 'excellent';
        
        if (random > weights?.[0] + weights?.[1]) quality = 'poor';
        else if (random > weights?.[0]) quality = 'good';
        
        setConnectionQuality(quality);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isCallActive]);

  // Session duration tracking
  useEffect(() => {
    let interval;
    if (isCallActive && sessionData?.startTime) {
      interval = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          duration: Date.now() - prev?.startTime?.getTime()
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, sessionData?.startTime]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <AdaptiveNavbar
        userRole="student"
        currentPath="/ai-voice-tutor"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      {/* Sidebar */}
      <RoleSidebar
        userRole="student"
        currentPath="/ai-voice-tutor"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      {/* Main Content */}
      <main className={`
        content-offset transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'lg:content-offset-sidebar-collapsed' : 'lg:content-offset-sidebar'}
      `}>
        {/* Glass Modal Overlay */}
        <div className="fixed inset-0 glass-lg z-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center relative"
              >
                <span className="text-white font-bold text-lg">AI</span>
                {isAIProcessing && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </motion.div>
              
              <div>
                <h1 className="text-xl font-bold">AI Voice Tutor</h1>
                <p className="text-muted-foreground text-sm">
                  {currentLesson?.title} • {currentLanguage === 'ru' ? 'Русский' : 'English'}
                  {isCallActive && (
                    <span className="ml-2 text-green-400">
                      • {Math.floor((sessionData?.duration || 0) / 60000)}:{Math.floor(((sessionData?.duration || 0) % 60000) / 1000)?.toString()?.padStart(2, '0')}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Language Toggle and Status */}
            <div className="flex items-center gap-3">
              <LanguageToggle
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
              
              <ConnectionStatus
                quality={connectionQuality}
                isConnected={isCallActive}
                isProcessing={isAIProcessing}
              />
            </div>
          </div>

          {/* Main Interface */}
          <div className="flex-1 flex">
            {/* Left Panel - Voice Visualization and Transcript */}
            <div className="flex-1 flex flex-col p-6">
              {/* Voice Visualization */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <VoiceVisualization
                  isActive={isCallActive}
                  voiceLevel={voiceActivityLevel}
                  isAIProcessing={isAIProcessing}
                  isMuted={isMuted}
                  isListening={isListening}
                />
              </div>

              {/* Live Transcript */}
              <div className="h-64">
                <LiveTranscript
                  messages={transcript}
                  isProcessing={isAIProcessing}
                  currentLanguage={currentLanguage}
                />
              </div>
            </div>

            {/* Right Panel - Chat and Screen Share */}
            <AnimatePresence>
              {(isChatOpen || isScreenSharing) && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 400, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-white/20 flex flex-col"
                >
                  {isScreenSharing && (
                    <div className="flex-1">
                      <ScreenSharePanel
                        isActive={isScreenSharing}
                        onToggle={handleToggleScreenShare}
                      />
                    </div>
                  )}
                  
                  {isChatOpen && (
                    <div className="flex-1">
                      <ChatInterface
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        isProcessing={isAIProcessing}
                        onClose={() => setIsChatOpen(false)}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="p-6 border-t border-white/20">
            <CallControls
              isCallActive={isCallActive}
              isMuted={isMuted}
              isSpeakerOn={isSpeakerOn}
              isRecording={isRecording}
              isChatOpen={isChatOpen}
              isScreenSharing={isScreenSharing}
              isListening={isListening}
              onStartCall={handleStartCall}
              onEndCall={() => setShowEndCallConfirm(true)}
              onToggleMute={handleToggleMute}
              onToggleSpeaker={handleToggleSpeaker}
              onToggleRecording={handleToggleRecording}
              onToggleChat={() => setIsChatOpen(!isChatOpen)}
              onToggleScreenShare={handleToggleScreenShare}
              onOpenHelp={() => setIsHelpOpen(true)}
            />
          </div>
        </div>

        {/* Contextual Help Panel */}
        <AnimatePresence>
          {isHelpOpen && (
            <ContextualHelp
              lesson={currentLesson}
              onClose={() => setIsHelpOpen(false)}
              onRequestHelp={handleRequestHelp}
            />
          )}
        </AnimatePresence>

        {/* Session Recording Panel */}
        <SessionRecording
          isRecording={isRecording}
          isActive={isCallActive}
          onToggle={handleToggleRecording}
          sessionData={sessionData}
        />

        {/* End Call Confirmation Dialog */}
        <AnimatePresence>
          {showEndCallConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-lg rounded-2xl p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold mb-4">Завершить сессию?</h3>
                <p className="text-muted-foreground mb-6">
                  Вы уверены, что хотите завершить сессию с AI Voice Tutor? 
                  Прогресс и статистика будут сохранены.
                </p>
                
                {/* Session Summary */}
                <div className="bg-white/5 rounded-lg p-4 mb-6 text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Длительность:</span>
                    <span>{Math.floor((sessionData?.duration || 0) / 60000)} мин</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Вопросов задано:</span>
                    <span>{sessionData?.questionsAsked || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Тем изучено:</span>
                    <span>{sessionData?.topicsCovered?.length || 0}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEndCallConfirm(false)}
                    className="flex-1 px-4 py-2 bg-muted rounded-lg font-medium transition-colors hover:bg-muted/80"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="flex-1 px-4 py-2 bg-error text-error-foreground rounded-lg font-medium transition-colors hover:bg-error/90"
                  >
                    Завершить
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* Notification Center */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationCenter
          isOpen={isNotificationOpen}
          onToggle={handleNotificationToggle}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </div>
  );
};

export default AIVoiceTutor;