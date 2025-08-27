import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import RoleSidebar from '../../components/ui/RoleSidebar';
import LearningContextMenu from '../../components/ui/LearningContextMenu';

// Import lesson interface components
import VideoPlayer from './components/VideoPlayer';
import InteractiveTranscript from './components/InteractiveTranscript';
import AITutorPanel from './components/AITutorPanel';
import AssignmentPanel from './components/AssignmentPanel';
import NotesPanel from './components/NotesPanel';
import LessonNavigation from './components/LessonNavigation';

const LessonInterface = () => {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/lesson-interface');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Video and lesson state
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(3);
  const [totalLessons] = useState(12);
  const [lessonProgress, setLessonProgress] = useState(45);
  
  // Panel visibility states
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Bookmarks state
  const [bookmarks, setBookmarks] = useState([
    { time: 45, title: "useState explanation" },
    { time: 125, title: "useEffect introduction" },
    { time: 240, title: "Custom hooks example" }
  ]);

  // Mock lesson data
  const lessonData = {
    id: 3,
    title: "React Hooks Deep Dive",
    courseTitle: "React Fundamentals",
    description: "Master the fundamentals of React Hooks including useState, useEffect, and custom hooks",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 1800, // 30 minutes
    instructor: "Sarah Johnson",
    difficulty: "Intermediate",
    tags: ["React", "Hooks", "JavaScript", "Frontend"]
  };

  const handleNavigation = (path) => {
    setCurrentPath(path);
    navigate(path);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
    // Update progress based on video time
    const progress = Math.min((time / lessonData?.duration) * 100, 100);
    setLessonProgress(progress);
  };

  const handleSeekTo = (time) => {
    setCurrentTime(time);
    // In a real implementation, this would seek the video player
    console.log('Seeking to:', time);
  };

  const handleBookmark = (time) => {
    const newBookmark = {
      time: time || currentTime,
      title: `Bookmark at ${Math.floor((time || currentTime) / 60)}:${Math.floor((time || currentTime) % 60)?.toString()?.padStart(2, '0')}`
    };
    setBookmarks(prev => [...prev, newBookmark]);
    setIsBookmarked(true);
  };

  const handleLessonNavigation = (lessonId) => {
    setCurrentLesson(lessonId);
    setCurrentTime(0);
    setLessonProgress(0);
    // In a real app, this would load the new lesson data
    console.log('Navigating to lesson:', lessonId);
  };

  const handleAssignmentSubmit = (submissionData) => {
    console.log('Assignment submitted:', submissionData);
    // Handle assignment submission
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle shortcuts when not typing in inputs
      if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA') return;
      
      switch (e?.key) {
        case ' ':
          e?.preventDefault();
          // Toggle play/pause
          break;
        case 'ArrowLeft':
          e?.preventDefault();
          handleSeekTo(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e?.preventDefault();
          handleSeekTo(currentTime + 10);
          break;
        case 'n':
          if (e?.ctrlKey || e?.metaKey) {
            e?.preventDefault();
            setIsNotesOpen(!isNotesOpen);
          }
          break;
        case 't':
          if (e?.ctrlKey || e?.metaKey) {
            e?.preventDefault();
            setIsTranscriptOpen(!isTranscriptOpen);
          }
          break;
        case 'a':
          if (e?.ctrlKey || e?.metaKey) {
            e?.preventDefault();
            setIsAITutorOpen(!isAITutorOpen);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTime, isNotesOpen, isTranscriptOpen, isAITutorOpen]);

  // Auto-save progress
  useEffect(() => {
    const saveProgress = () => {
      localStorage.setItem('lessonProgress', JSON.stringify({
        lessonId: currentLesson,
        currentTime,
        progress: lessonProgress,
        timestamp: new Date()?.toISOString()
      }));
    };

    const interval = setInterval(saveProgress, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [currentLesson, currentTime, lessonProgress]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AdaptiveNavbar
        userRole="student"
        currentPath={currentPath}
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      <RoleSidebar
        userRole="student"
        currentPath={currentPath}
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } pt-16`}>
        
        {/* Breadcrumb */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button 
              onClick={() => handleNavigation('/course-catalog')}
              className="hover:text-foreground transition-smooth"
            >
              Courses
            </button>
            <Icon name="ChevronRight" size={14} />
            <button 
              onClick={() => handleNavigation('/course-detail')}
              className="hover:text-foreground transition-smooth"
            >
              {lessonData?.courseTitle}
            </button>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground font-medium">{lessonData?.title}</span>
          </div>
        </div>

        {/* Lesson Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{lessonData?.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Instructor: {lessonData?.instructor}</span>
                  <span>•</span>
                  <span>{Math.floor(lessonData?.duration / 60)} minutes</span>
                  <span>•</span>
                  <span className="capitalize">{lessonData?.difficulty}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Quick Action Buttons */}
              <Button
                variant={isNotesOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                iconName="FileText"
                iconPosition="left"
                iconSize={16}
                className="hidden lg:flex"
              >
                Notes
              </Button>
              
              <Button
                variant={isTranscriptOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                iconName="FileType"
                iconPosition="left"
                iconSize={16}
                className="hidden lg:flex"
              >
                Transcript
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAssignmentOpen(!isAssignmentOpen)}
                iconName="FileText"
                iconPosition="left"
                iconSize={16}
              >
                Assignment
              </Button>
              
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="icon"
                onClick={() => handleBookmark()}
                title="Bookmark this lesson"
              >
                <Icon name={isBookmarked ? "BookmarkCheck" : "Bookmark"} size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Learning Interface */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            
            {/* Left Panel - Notes (when open) */}
            {isNotesOpen && (
              <div className="col-span-12 lg:col-span-3">
                <NotesPanel
                  isOpen={isNotesOpen}
                  onClose={() => setIsNotesOpen(false)}
                  currentTime={currentTime}
                  lessonId={currentLesson}
                  className="h-full"
                />
              </div>
            )}

            {/* Center Panel - Video and Navigation */}
            <div className={`col-span-12 ${
              isNotesOpen && isTranscriptOpen ? 'lg:col-span-6' : isNotesOpen || isTranscriptOpen ?'lg:col-span-9': 'lg:col-span-8'
            } space-y-6`}>
              
              {/* Video Player */}
              <div className="aspect-video">
                <VideoPlayer
                  videoUrl={lessonData?.videoUrl}
                  title={lessonData?.title}
                  duration={lessonData?.duration}
                  currentTime={currentTime}
                  onTimeUpdate={handleTimeUpdate}
                  onBookmark={handleBookmark}
                  bookmarks={bookmarks}
                  className="w-full h-full"
                />
              </div>

              {/* Lesson Navigation */}
              <LessonNavigation
                currentLesson={currentLesson}
                totalLessons={totalLessons}
                courseTitle={lessonData?.courseTitle}
                onNavigate={handleLessonNavigation}
                progress={lessonProgress}
              />
            </div>

            {/* Right Panel - Transcript (when open) */}
            {isTranscriptOpen && (
              <div className={`col-span-12 ${
                isNotesOpen ? 'lg:col-span-3' : 'lg:col-span-4'
              }`}>
                <InteractiveTranscript
                  currentTime={currentTime}
                  onSeekTo={handleSeekTo}
                  isVisible={isTranscriptOpen}
                  onToggle={() => setIsTranscriptOpen(!isTranscriptOpen)}
                  className="h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Floating Panels */}
      {/* AI Tutor Panel */}
      <AITutorPanel
        isOpen={isAITutorOpen}
        onToggle={() => setIsAITutorOpen(!isAITutorOpen)}
        onClose={() => setIsAITutorOpen(false)}
        currentLessonContext={lessonData?.title}
      />
      {/* Assignment Panel */}
      <AssignmentPanel
        isOpen={isAssignmentOpen}
        onToggle={() => setIsAssignmentOpen(!isAssignmentOpen)}
        onClose={() => setIsAssignmentOpen(false)}
        onSubmit={handleAssignmentSubmit}
      />
      {/* Learning Context Menu (Mobile/Desktop) */}
      <LearningContextMenu
        currentLesson={currentLesson}
        totalLessons={totalLessons}
        lessonTitle={lessonData?.title}
        courseTitle={lessonData?.courseTitle}
        progress={lessonProgress}
        onNavigateLesson={handleLessonNavigation}
        onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
        onToggleTranscript={() => setIsTranscriptOpen(!isTranscriptOpen)}
        onToggleAITutor={() => setIsAITutorOpen(!isAITutorOpen)}
        onBookmark={handleBookmark}
        isNotesOpen={isNotesOpen}
        isTranscriptOpen={isTranscriptOpen}
        isBookmarked={isBookmarked}
      />
      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 z-20 hidden lg:block">
        <div className="glass rounded-lg p-3 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Shortcuts:</div>
          <div>Space: Play/Pause</div>
          <div>← →: Skip 10s</div>
          <div>Ctrl+N: Notes</div>
          <div>Ctrl+T: Transcript</div>
        </div>
      </div>
    </div>
  );
};

export default LessonInterface;