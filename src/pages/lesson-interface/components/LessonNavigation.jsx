import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LessonNavigation = ({ 
  currentLesson = 1,
  totalLessons = 12,
  courseTitle = "React Fundamentals",
  lessons = [],
  onNavigate = () => {},
  progress = 45,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock lessons data
  const mockLessons = lessons?.length > 0 ? lessons : [
    {
      id: 1,
      title: "Introduction to React",
      duration: 900, // 15 minutes
      completed: true,
      type: "video"
    },
    {
      id: 2,
      title: "Understanding JSX",
      duration: 1200, // 20 minutes
      completed: true,
      type: "video"
    },
    {
      id: 3,
      title: "React Hooks Deep Dive",
      duration: 1800, // 30 minutes
      completed: false,
      current: true,
      type: "video"
    },
    {
      id: 4,
      title: "State Management with useState",
      duration: 1500, // 25 minutes
      completed: false,
      type: "video"
    },
    {
      id: 5,
      title: "Side Effects with useEffect",
      duration: 2100, // 35 minutes
      completed: false,
      type: "video"
    },
    {
      id: 6,
      title: "Hands-on: Building a Todo App",
      duration: 3600, // 60 minutes
      completed: false,
      type: "assignment"
    },
    {
      id: 7,
      title: "Context API and useContext",
      duration: 1800, // 30 minutes
      completed: false,
      type: "video"
    },
    {
      id: 8,
      title: "Custom Hooks",
      duration: 2400, // 40 minutes
      completed: false,
      type: "video"
    },
    {
      id: 9,
      title: "Performance Optimization",
      duration: 2700, // 45 minutes
      completed: false,
      type: "video"
    },
    {
      id: 10,
      title: "Testing React Components",
      duration: 3000, // 50 minutes
      completed: false,
      type: "video"
    },
    {
      id: 11,
      title: "Final Project: E-commerce App",
      duration: 7200, // 120 minutes
      completed: false,
      type: "project"
    },
    {
      id: 12,
      title: "Course Assessment",
      duration: 1800, // 30 minutes
      completed: false,
      type: "quiz"
    }
  ];

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTypeIcon = (type) => {
    const icons = {
      video: 'Play',
      assignment: 'FileText',
      project: 'Folder',
      quiz: 'HelpCircle'
    };
    return icons?.[type] || 'Play';
  };

  const getTypeColor = (type) => {
    const colors = {
      video: 'text-primary',
      assignment: 'text-accent',
      project: 'text-secondary',
      quiz: 'text-warning'
    };
    return colors?.[type] || 'text-primary';
  };

  const handlePrevious = () => {
    if (currentLesson > 1) {
      onNavigate(currentLesson - 1);
    }
  };

  const handleNext = () => {
    if (currentLesson < totalLessons) {
      onNavigate(currentLesson + 1);
    }
  };

  const currentLessonData = mockLessons?.find(lesson => lesson?.id === currentLesson);
  const completedLessons = mockLessons?.filter(lesson => lesson?.completed)?.length;

  return (
    <div className={`glass-lg rounded-xl border border-white/20 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{courseTitle}</h3>
            <p className="text-sm text-muted-foreground">
              Lesson {currentLesson} of {totalLessons}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="font-medium">{Math.round((completedLessons / totalLessons) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="progress-ambient h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {/* Current Lesson Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            currentLessonData?.type === 'video' ? 'bg-primary/10' :
            currentLessonData?.type === 'assignment' ? 'bg-accent/10' :
            currentLessonData?.type === 'project'? 'bg-secondary/10' : 'bg-warning/10'
          }`}>
            <Icon 
              name={getTypeIcon(currentLessonData?.type)} 
              size={16} 
              className={getTypeColor(currentLessonData?.type)}
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{currentLessonData?.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{formatDuration(currentLessonData?.duration || 0)}</span>
              <span>•</span>
              <span className="capitalize">{currentLessonData?.type}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Controls */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentLesson <= 1}
            iconName="ChevronLeft"
            iconPosition="left"
            iconSize={16}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {currentLesson} / {totalLessons}
            </span>
          </div>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentLesson >= totalLessons}
            iconName="ChevronRight"
            iconPosition="right"
            iconSize={16}
          >
            Next
          </Button>
        </div>
      </div>
      {/* Expanded Lesson List */}
      {isExpanded && (
        <div className="max-h-80 overflow-y-auto">
          <div className="p-2 space-y-1">
            {mockLessons?.map((lesson) => (
              <button
                key={lesson?.id}
                onClick={() => onNavigate(lesson?.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-smooth ${
                  lesson?.id === currentLesson
                    ? 'bg-primary text-primary-foreground'
                    : lesson?.completed
                    ? 'hover:bg-success/10 text-success' :'hover:bg-white/5 text-muted-foreground'
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {lesson?.completed ? (
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  ) : lesson?.id === currentLesson ? (
                    <Icon name="PlayCircle" size={16} className="text-primary-foreground" />
                  ) : (
                    <Icon name="Circle" size={16} className="text-muted-foreground" />
                  )}
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      Lesson {lesson?.id}
                    </span>
                    <Icon 
                      name={getTypeIcon(lesson?.type)} 
                      size={12} 
                      className={lesson?.id === currentLesson ? 'text-primary-foreground' : getTypeColor(lesson?.type)}
                    />
                  </div>
                  <h5 className={`text-sm font-medium truncate ${
                    lesson?.id === currentLesson ? 'text-primary-foreground' : ''
                  }`}>
                    {lesson?.title}
                  </h5>
                  <p className={`text-xs mt-1 ${
                    lesson?.id === currentLesson ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {formatDuration(lesson?.duration)}
                  </p>
                </div>

                {/* Lock Icon for Future Lessons */}
                {!lesson?.completed && lesson?.id > currentLesson && (
                  <Icon name="Lock" size={14} className="text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{completedLessons} of {totalLessons} completed</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs">
              <Icon name="Download" size={12} className="mr-1" />
              Materials
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Icon name="MessageSquare" size={12} className="mr-1" />
              Discuss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonNavigation;