import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import ContinueLearningCard from './components/ContinueLearningCard';
import UpcomingDeadlinesCard from './components/UpcomingDeadlinesCard';
import RecentAchievementsCard from './components/RecentAchievementsCard';
import QuickStatsCard from './components/QuickStatsCard';
import AITutorAccessButton from './components/AITutorAccessButton';
import CourseRecommendationsCard from './components/CourseRecommendationsCard';
import CalendarWidget from './components/CalendarWidget';

// Import services
import { 
  enrollmentService, 
  courseService, 
  achievementService, 
  assignmentService,
  calendarService,
  statsService,
  tutorService
} from '../../services/learningService';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAISessionActive, setIsAISessionActive] = useState(false);

  // Data states
  const [currentCourse, setCurrentCourse] = useState(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [quickStats, setQuickStats] = useState({});
  const [courseRecommendations, setCourseRecommendations] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data in parallel for better performance - with fallback values
      const [
        currentLearning,
        deadlines,
        achievements,
        stats,
        recommendations,
        events
      ] = await Promise.allSettled([
        enrollmentService?.getCurrentLearning?.() || Promise.resolve(null),
        assignmentService?.getUpcomingDeadlines?.(4) || Promise.resolve([]),
        achievementService?.getRecentAchievements?.() || Promise.resolve([]),
        statsService?.getUserStats?.() || Promise.resolve({}),
        courseService?.getCourseRecommendations?.(3) || Promise.resolve([]),
        loadCalendarEvents() || Promise.resolve([])
      ]);

      // Handle results with proper fallbacks
      setCurrentCourse(currentLearning?.status === 'fulfilled' ? currentLearning?.value : null);
      setUpcomingDeadlines(deadlines?.status === 'fulfilled' ? deadlines?.value || [] : []);
      setRecentAchievements(achievements?.status === 'fulfilled' ? achievements?.value || [] : []);
      setQuickStats(stats?.status === 'fulfilled' ? stats?.value || {} : {});
      setCourseRecommendations(recommendations?.status === 'fulfilled' ? recommendations?.value || [] : []);
      setCalendarEvents(events?.status === 'fulfilled' ? events?.value || [] : []);

      // Log any failures for debugging
      [currentLearning, deadlines, achievements, stats, recommendations, events]?.forEach((result, index) => {
        if (result?.status === 'rejected') {
          console.warn(`Failed to load dashboard data ${index}:`, result?.reason);
        }
      });

    } catch (error) {
      console.error('Ошибка загрузки данных дашборда:', error);
      setError('Не удалось загрузить данные дашборда. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarEvents = async () => {
    try {
      const now = new Date();
      const endDate = new Date();
      endDate?.setDate(endDate?.getDate() + 7); // Next 7 days

      const events = await calendarService?.getUserCalendarEvents?.(
        now?.toISOString(),
        endDate?.toISOString()
      );

      return events?.map(event => ({
        id: event?.id,
        title: event?.title,
        date: new Date(event.event_date),
        time: event?.event_time,
        type: event?.event_type,
        course: event?.course?.title,
        isCompleted: event?.is_completed
      })) || [];
    } catch (error) {
      console.warn('Не удалось загрузить события календаря:', error);
      return [];
    }
  };

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

  // Course and learning handlers
  const handleResumeLearning = (courseId) => {
    if (currentCourse?.currentLesson) {
      navigate(`/lesson-interface?course=${courseId}&lesson=${currentCourse?.currentLesson?.id}`);
    } else {
      navigate(`/course-detail/${courseId}`);
    }
  };

  const handleViewDeadline = (deadline) => {
    navigate('/assignment-submission', { state: { assignmentId: deadline?.id } });
  };

  const handleViewAchievement = async (achievement) => {
    // Mark as viewed
    if (achievement?.is_new) {
      try {
        await achievementService?.markAchievementAsViewed?.(achievement?.id);
      } catch (error) {
        console.warn('Не удалось отметить достижение как просмотренное:', error);
      }
    }
    navigate('/achievements', { state: { achievementId: achievement?.id } });
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course-detail/${courseId}`);
  };

  const handleViewEvent = (event) => {
    if (event?.type === 'deadline') {
      navigate('/assignment-submission');
    } else if (event?.type === 'lesson') {
      navigate('/lesson-interface');
    } else if (event?.type === 'session') {
      navigate('/ai-voice-tutor');
    }
  };

  // AI Tutor handlers
  const handleStartAISession = async (sessionType = 'general') => {
    try {
      setIsAISessionActive(!isAISessionActive);
      if (!isAISessionActive) {
        // Start new tutor session
        await tutorService?.startTutorSession?.({ sessionType });
        navigate('/ai-voice-tutor', { state: { sessionType } });
      }
    } catch (error) {
      console.error('Ошибка запуска сессии ИИ-тьютора:', error);
      setError('Не удалось запустить сессию ИИ-тьютора');
    }
  };

  // Generic view all handler
  const handleViewAll = (path) => {
    navigate(path);
  };

  // Auto-hide mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">Загрузка дашборда...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <AdaptiveNavbar
        userRole={userProfile?.role || "student"}
        currentPath="/student-dashboard"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      {/* Sidebar */}
      <RoleSidebar
        userRole={userProfile?.role || "student"}
        currentPath="/student-dashboard"
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
        <div className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Добро пожаловать, {userProfile?.full_name || user?.email?.split('@')?.[0] || 'Студент'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Продолжите свое обучение. У вас {upcomingDeadlines?.length || 0} предстоящих заданий.
            </p>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Continue Learning Card */}
              <ContinueLearningCard
                currentCourse={currentCourse}
                onResume={handleResumeLearning}
                onViewAll={() => handleViewAll('/course-catalog')}
              />

              {/* Course Recommendations */}
              <CourseRecommendationsCard
                recommendations={courseRecommendations}
                onViewCourse={handleViewCourse}
                onViewAll={() => handleViewAll('/course-catalog')}
              />

              {/* Recent Achievements */}
              <RecentAchievementsCard
                achievements={recentAchievements}
                onViewAchievement={handleViewAchievement}
                onViewAll={() => handleViewAll('/achievements')}
              />
            </div>

            {/* Right Column - Sidebar Content */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Stats */}
              <QuickStatsCard stats={quickStats} />

              {/* Upcoming Deadlines */}
              <UpcomingDeadlinesCard
                deadlines={upcomingDeadlines}
                onViewDeadline={handleViewDeadline}
                onViewAll={() => handleViewAll('/assignments')}
              />

              {/* Calendar Widget */}
              <CalendarWidget
                events={calendarEvents}
                onViewEvent={handleViewEvent}
                onViewCalendar={() => handleViewAll('/calendar')}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Floating AI Tutor Button */}
      <AITutorAccessButton
        onStartSession={handleStartAISession}
        isSessionActive={isAISessionActive}
      />
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

export default StudentDashboard;