import { supabase } from '../lib/supabase';

// Course Management
export const courseService = {
  // Get all published courses with categories and instructor info
  async getCourses(filters = {}) {
    try {
      let query = supabase?.from('courses')?.select(`
          *,
          category:categories(id, name, icon),
          instructor:user_profiles(id, full_name, avatar_url)
        `)?.eq('is_published', true)?.order('created_at', { ascending: false });

      if (filters?.category_id) {
        query = query?.eq('category_id', filters?.category_id);
      }
      
      if (filters?.level) {
        query = query?.eq('level', filters?.level);
      }
      
      if (filters?.search) {
        query = query?.or(`title.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get single course with detailed information
  async getCourse(courseId) {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`
          *,
          category:categories(id, name, icon),
          instructor:user_profiles(id, full_name, avatar_url, bio),
          lessons(id, title, description, type, duration_minutes, sort_order, is_published)
        `)?.eq('id', courseId)?.eq('is_published', true)?.single();

      if (error) throw error;
      
      // Sort lessons by sort_order
      if (data?.lessons) {
        data.lessons = data?.lessons?.filter(lesson => lesson?.is_published)?.sort((a, b) => a?.sort_order - b?.sort_order);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Get course recommendations based on user's enrollments
  async getCourseRecommendations(limit = 6) {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`*,category:categories(id, name, icon),instructor:user_profiles(id, full_name, avatar_url)`)?.eq('is_published', true)?.order('rating', { ascending: false })?.order('total_enrollments', { ascending: false })?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching course recommendations:', error);
      throw error;
    }
  }
};

// Enrollment Management
export const enrollmentService = {
  // Enroll user in a course
  async enrollInCourse(courseId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase?.from('enrollments')?.insert({
          student_id: user?.id,
          course_id: courseId,
          enrolled_at: new Date()?.toISOString(),
          last_accessed_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  },

  // Get user's enrollments with course details
  async getUserEnrollments() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return [];

      const { data, error } = await supabase?.from('enrollments')?.select(`*,course:courses(id, title, description, thumbnail_url, level,category:categories(name, icon),instructor:user_profiles(full_name))`)?.eq('student_id', user?.id)?.order('last_accessed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      throw error;
    }
  },

  // Get current learning - most recent course
  async getCurrentLearning() {
    try {
      const enrollments = await this.getUserEnrollments();
      
      if (!enrollments?.length) return null;
      
      // Find the most recently accessed course that's not completed
      const currentCourse = enrollments?.find(enrollment => 
        enrollment?.progress_percentage < 100 && enrollment?.last_accessed_at
      ) || enrollments?.[0];
      
      if (!currentCourse) return null;

      // Get current lesson (next incomplete lesson)
      const { data: lessons } = await supabase?.from('lessons')?.select('*')?.eq('course_id', currentCourse?.course_id)?.eq('is_published', true)?.order('sort_order');

      // Find current lesson based on progress
      let currentLesson = null;
      if (lessons?.length) {
        const { data: progress } = await supabase?.from('lesson_progress')?.select('lesson_id, status')?.eq('course_id', currentCourse?.course_id)?.eq('student_id', currentCourse?.student_id);

        const completedLessons = progress?.filter(p => p?.status === 'completed') || [];
        const nextLessonIndex = completedLessons?.length;
        currentLesson = lessons?.[nextLessonIndex] || lessons?.[0];
      }

      return {
        ...currentCourse?.course,
        enrollment: currentCourse,
        currentLesson,
        totalLessons: lessons?.length || 0
      };
    } catch (error) {
      console.error('Error fetching current learning:', error);
      throw error;
    }
  },

  // Update enrollment progress
  async updateEnrollmentProgress(courseId, progressPercentage) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase?.from('enrollments')?.update({
          progress_percentage: progressPercentage,
          last_accessed_at: new Date()?.toISOString(),
          ...(progressPercentage >= 100 && { completed_at: new Date()?.toISOString() })
        })?.eq('student_id', user?.id)?.eq('course_id', courseId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      throw error;
    }
  }
};

// Lesson Progress Management
export const progressService = {
  // Get lesson progress for a course
  async getCourseProgress(courseId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return [];

      const { data, error } = await supabase?.from('lesson_progress')?.select(`
          *,
          lesson:lessons(id, title, type, duration_minutes, sort_order)
        `)?.eq('course_id', courseId)?.eq('student_id', user?.id)?.order('lesson.sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw error;
    }
  },

  // Update lesson progress
  async updateLessonProgress(lessonId, courseId, status, watchTime = 0) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User must be authenticated');

      const updateData = {
        student_id: user?.id,
        lesson_id: lessonId,
        course_id: courseId,
        status,
        watch_time_minutes: watchTime,
        updated_at: new Date()?.toISOString(),
        ...(status === 'completed' && { completed_at: new Date()?.toISOString() })
      };

      const { data, error } = await supabase?.from('lesson_progress')?.upsert(updateData, {
          onConflict: 'student_id,lesson_id'
        })?.select()?.single();

      if (error) throw error;

      // Update overall course progress
      await this.updateCourseProgress(courseId);
      
      return data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  },

  // Calculate and update overall course progress
  async updateCourseProgress(courseId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return;

      // Get all lessons in the course
      const { data: lessons } = await supabase?.from('lessons')?.select('id')?.eq('course_id', courseId)?.eq('is_published', true);

      if (!lessons?.length) return;

      // Get completed lessons
      const { data: progress } = await supabase?.from('lesson_progress')?.select('status')?.eq('course_id', courseId)?.eq('student_id', user?.id)?.eq('status', 'completed');

      const completedCount = progress?.length || 0;
      const totalCount = lessons?.length;
      const progressPercentage = (completedCount / totalCount) * 100;

      await enrollmentService?.updateEnrollmentProgress(courseId, progressPercentage);
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  }
};

// Assignment Management
export const assignmentService = {
  // Get assignments for a course
  async getCourseAssignments(courseId) {
    try {
      const { data, error } = await supabase?.from('assignments')?.select(`
          *,
          lesson:lessons(id, title),
          submissions:submissions(id, status, points_earned, submitted_at)
        `)?.eq('course_id', courseId)?.order('due_date');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching course assignments:', error);
      throw error;
    }
  },

  // Get upcoming deadlines for user
  async getUpcomingDeadlines(limit = 10) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return [];

      // First get enrolled course IDs
      const { data: enrollments } = await supabase?.from('enrollments')?.select('course_id')?.eq('student_id', user?.id);
      
      if (!enrollments?.length) return [];
      
      const courseIds = enrollments?.map(enrollment => enrollment?.course_id);

      // Get assignments from enrolled courses
      const { data, error } = await supabase?.from('assignments')?.select(`
          id, title, due_date, max_points,
          course:courses(id, title),
          submissions:submissions!left(id, status, submitted_at)
        `)?.gte('due_date', new Date()?.toISOString())?.in('course_id', courseIds)?.order('due_date')?.limit(limit);

      if (error) throw error;

      // Filter out already submitted assignments and add priority
      return (data || [])?.filter(assignment => !assignment?.submissions?.length)?.map(assignment => {
          const dueDate = new Date(assignment?.due_date);
          const now = new Date();
          const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
          
          let priority = 'low';
          if (hoursUntilDue <= 24) priority = 'high';
          else if (hoursUntilDue <= 72) priority = 'medium';

          return {
            ...assignment,
            dueDate,
            priority
          };
        });
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      throw error;
    }
  },

  // Submit assignment
  async submitAssignment(assignmentId, content, fileUrls = []) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase?.from('submissions')?.upsert({
          assignment_id: assignmentId,
          student_id: user?.id,
          content,
          file_urls: fileUrls,
          status: 'submitted',
          submitted_at: new Date()?.toISOString()
        }, {
          onConflict: 'assignment_id,student_id'
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  }
};

// Achievement Management
export const achievementService = {
  // Get user achievements
  async getUserAchievements(limit = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return [];

      let query = supabase?.from('achievements')?.select('*')?.eq('student_id', user?.id)?.order('earned_at', { ascending: false });

      if (limit) {
        query = query?.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  },

  // Get recent achievements (last 7 days)
  async getRecentAchievements() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo?.setDate(sevenDaysAgo?.getDate() - 7);

      const { data, error } = await supabase?.from('achievements')?.select('*')?.eq('student_id', user?.id)?.gte('earned_at', sevenDaysAgo?.toISOString())?.order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent achievements:', error);
      throw error;
    }
  },

  // Mark achievement as viewed
  async markAchievementAsViewed(achievementId) {
    try {
      const { error } = await supabase?.from('achievements')?.update({ is_new: false })?.eq('id', achievementId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking achievement as viewed:', error);
      throw error;
    }
  }
};

// Statistics Service
export const statsService = {
  // Get user learning statistics
  async getUserStats() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return null;

      // Get user profile for basic stats
      const { data: profile } = await supabase?.from('user_profiles')?.select('current_streak, total_points')?.eq('id', user?.id)?.single();

      // Get completed courses count
      const { count: completedCourses } = await supabase?.from('enrollments')?.select('*', { count: 'exact', head: true })?.eq('student_id', user?.id)?.eq('progress_percentage', 100);

      // Calculate total learning hours from lesson progress
      const { data: progressData } = await supabase?.from('lesson_progress')?.select('watch_time_minutes')?.eq('student_id', user?.id);

      const totalHours = Math.floor(
        (progressData?.reduce((sum, p) => sum + (p?.watch_time_minutes || 0), 0) || 0) / 60
      );

      return {
        totalHours,
        completedCourses: completedCourses || 0,
        currentStreak: profile?.current_streak || 0,
        totalPoints: profile?.total_points || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};

// Calendar Service
export const calendarService = {
  // Get calendar events for user
  async getUserCalendarEvents(startDate, endDate) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return [];

      const { data, error } = await supabase?.from('calendar_events')?.select(`
          *,
          course:courses(id, title),
          lesson:lessons(id, title),
          assignment:assignments(id, title, max_points)
        `)?.eq('student_id', user?.id)?.gte('event_date', startDate)?.lte('event_date', endDate)?.order('event_date');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  // Create calendar event
  async createCalendarEvent(eventData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase?.from('calendar_events')?.insert({
          ...eventData,
          student_id: user?.id
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }
};

// AI Tutor Service
export const tutorService = {
  // Start new tutor session
  async startTutorSession(sessionData = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase?.from('tutor_sessions')?.insert({
          student_id: user?.id,
          session_type: sessionData?.sessionType || 'general',
          course_id: sessionData?.courseId || null,
          lesson_id: sessionData?.lessonId || null,
          started_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting tutor session:', error);
      throw error;
    }
  },

  // End tutor session
  async endTutorSession(sessionId, sessionData = {}) {
    try {
      const { data, error } = await supabase?.from('tutor_sessions')?.update({
          ended_at: new Date()?.toISOString(),
          duration_minutes: sessionData?.duration || 0,
          questions_asked: sessionData?.questions || 0,
          topics_covered: sessionData?.topics || [],
          session_rating: sessionData?.rating || null
        })?.eq('id', sessionId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error ending tutor session:', error);
      throw error;
    }
  },

  // Get user's tutor sessions
  async getTutorSessions(limit = 10) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return [];

      const { data, error } = await supabase?.from('tutor_sessions')?.select(`*,course:courses(id, title),lesson:lessons(id, title)`)?.eq('student_id', user?.id)?.order('started_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tutor sessions:', error);
      throw error;
    }
  }
};