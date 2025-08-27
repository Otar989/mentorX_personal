import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const LearningContextMenu = ({ 
  currentLesson = 1,
  totalLessons = 10,
  lessonTitle = "Introduction to React",
  courseTitle = "React Fundamentals",
  progress = 45,
  onNavigateLesson = () => {},
  onToggleNotes = () => {},
  onToggleTranscript = () => {},
  onToggleAITutor = () => {},
  onBookmark = () => {},
  isNotesOpen = false,
  isTranscriptOpen = false,
  isBookmarked = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handlePreviousLesson = () => {
    if (currentLesson > 1) {
      onNavigateLesson(currentLesson - 1);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson < totalLessons) {
      onNavigateLesson(currentLesson + 1);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  // Auto-hide quick actions after 3 seconds of inactivity
  useEffect(() => {
    if (showQuickActions) {
      const timer = setTimeout(() => {
        setShowQuickActions(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showQuickActions]);

  return (
    <div className={`learning-context-menu ${className}`}>
      {/* Desktop Persistent Panel */}
      <div className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2 z-dropdown">
        <div className="glass-lg rounded-2xl p-4 w-80 space-y-4 shadow-glass-lg">
          {/* Course Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground truncate">
                {courseTitle}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="h-6 w-6"
              >
                <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
              </Button>
            </div>
            
            <h2 className="font-bold text-lg leading-tight">
              {lessonTitle}
            </h2>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Lesson {currentLesson} of {totalLessons}</span>
              <span>•</span>
              <span>{progress}% complete</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="progress-ambient h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousLesson}
              disabled={currentLesson <= 1}
              iconName="ChevronLeft"
              iconPosition="left"
              iconSize={16}
            >
              Previous
            </Button>
            
            <span className="text-sm font-medium">
              {currentLesson}/{totalLessons}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextLesson}
              disabled={currentLesson >= totalLessons}
              iconName="ChevronRight"
              iconPosition="right"
              iconSize={16}
            >
              Next
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isNotesOpen ? "default" : "outline"}
              size="sm"
              onClick={onToggleNotes}
              iconName="FileText"
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              Notes
            </Button>
            
            <Button
              variant={isTranscriptOpen ? "default" : "outline"}
              size="sm"
              onClick={onToggleTranscript}
              iconName="FileType"
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              Transcript
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAITutor}
              iconName="Bot"
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              AI Tutor
            </Button>
            
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={onBookmark}
              iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              Bookmark
            </Button>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 border-t border-white/10 pt-4">
              {/* Lesson List */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Course Outline</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {Array.from({ length: totalLessons }, (_, i) => i + 1)?.map((lessonNum) => (
                    <button
                      key={lessonNum}
                      onClick={() => onNavigateLesson(lessonNum)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-smooth ${
                        lessonNum === currentLesson
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon 
                        name={lessonNum < currentLesson ? "CheckCircle" : lessonNum === currentLesson ? "PlayCircle" : "Circle"} 
                        size={14} 
                      />
                      <span className="truncate">Lesson {lessonNum}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Tools */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Study Tools</h4>
                <div className="grid grid-cols-1 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    iconSize={14}
                    className="justify-start text-xs"
                  >
                    Download Materials
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Share"
                    iconPosition="left"
                    iconSize={14}
                    className="justify-start text-xs"
                  >
                    Share Progress
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageSquare"
                    iconPosition="left"
                    iconSize={14}
                    className="justify-start text-xs"
                  >
                    Discussion Forum
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-dropdown">
        {/* Quick Actions Floating Button */}
        <div className="absolute bottom-20 right-4">
          <Button
            variant="default"
            size="icon"
            onClick={toggleQuickActions}
            className="rounded-full shadow-glass-lg"
          >
            <Icon name="MoreVertical" size={20} />
          </Button>

          {/* Quick Actions Menu */}
          {showQuickActions && (
            <div className="absolute bottom-full right-0 mb-2 glass-lg rounded-xl p-2 space-y-1 shadow-glass-lg">
              <Button
                variant={isNotesOpen ? "default" : "ghost"}
                size="icon"
                onClick={onToggleNotes}
                title="Toggle Notes"
              >
                <Icon name="FileText" size={18} />
              </Button>
              <Button
                variant={isTranscriptOpen ? "default" : "ghost"}
                size="icon"
                onClick={onToggleTranscript}
                title="Toggle Transcript"
              >
                <Icon name="FileType" size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleAITutor}
                title="AI Tutor"
              >
                <Icon name="Bot" size={18} />
              </Button>
              <Button
                variant={isBookmarked ? "default" : "ghost"}
                size="icon"
                onClick={onBookmark}
                title="Bookmark"
              >
                <Icon name={isBookmarked ? "BookmarkCheck" : "Bookmark"} size={18} />
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="glass-lg border-t border-white/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm truncate">{lessonTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {currentLesson}/{totalLessons} • {progress}% complete
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpanded}
              className="h-8 w-8"
            >
              <Icon name={isExpanded ? "ChevronDown" : "ChevronUp"} size={16} />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="progress-ambient h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousLesson}
              disabled={currentLesson <= 1}
              iconName="ChevronLeft"
              iconSize={16}
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Pause"
                iconSize={16}
              />
              <Button
                variant="default"
                size="sm"
                iconName="Play"
                iconSize={16}
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextLesson}
              disabled={currentLesson >= totalLessons}
              iconName="ChevronRight"
              iconSize={16}
            />
          </div>

          {/* Expanded Mobile Content */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/10 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  variant={isNotesOpen ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleNotes}
                  iconName="FileText"
                  iconSize={14}
                >
                  Notes
                </Button>
                <Button
                  variant={isTranscriptOpen ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleTranscript}
                  iconName="FileType"
                  iconSize={14}
                >
                  Transcript
                </Button>
              </div>

              {/* Lesson Navigation */}
              <div className="space-y-1">
                {Array.from({ length: Math.min(5, totalLessons) }, (_, i) => i + 1)?.map((lessonNum) => (
                  <button
                    key={lessonNum}
                    onClick={() => onNavigateLesson(lessonNum)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-smooth ${
                      lessonNum === currentLesson
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon 
                      name={lessonNum < currentLesson ? "CheckCircle" : lessonNum === currentLesson ? "PlayCircle" : "Circle"} 
                      size={16} 
                    />
                    <span>Lesson {lessonNum}</span>
                  </button>
                ))}
                {totalLessons > 5 && (
                  <button className="w-full text-center py-2 text-sm text-muted-foreground">
                    View all {totalLessons} lessons
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningContextMenu;