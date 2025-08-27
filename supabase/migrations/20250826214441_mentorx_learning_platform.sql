-- Location: supabase/migrations/20250826214441_mentorx_learning_platform.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete MentorX Learning Management System
-- Dependencies: None (fresh schema)

-- 1. TYPES AND ENUMS
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin', 'company_admin');
CREATE TYPE public.course_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE public.lesson_type AS ENUM ('video', 'text', 'quiz', 'assignment', 'live_session');
CREATE TYPE public.assignment_status AS ENUM ('pending', 'submitted', 'graded', 'returned');
CREATE TYPE public.progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'cancelled', 'expired');
CREATE TYPE public.achievement_type AS ENUM ('certificate', 'badge', 'streak', 'milestone');

-- 2. CORE USER TABLE (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    avatar_url TEXT,
    bio TEXT,
    company_name TEXT,
    department TEXT,
    current_streak INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    subscription_status public.subscription_status DEFAULT 'trial'::public.subscription_status,
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. LEARNING CONTENT TABLES
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    thumbnail_url TEXT,
    level public.course_level DEFAULT 'beginner'::public.course_level,
    duration_minutes INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_published BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_enrollments INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type public.lesson_type DEFAULT 'video'::public.lesson_type,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. ENROLLMENT AND PROGRESS TABLES
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_accessed_at TIMESTAMPTZ,
    UNIQUE(student_id, course_id)
);

CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    status public.progress_status DEFAULT 'not_started'::public.progress_status,
    watch_time_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, lesson_id)
);

-- 5. ASSIGNMENTS AND SUBMISSIONS
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    max_points INTEGER DEFAULT 100,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT,
    file_urls TEXT[] DEFAULT '{}',
    status public.assignment_status DEFAULT 'pending'::public.assignment_status,
    points_earned INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    UNIQUE(assignment_id, student_id)
);

-- 6. ACHIEVEMENTS SYSTEM
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type public.achievement_type DEFAULT 'badge'::public.achievement_type,
    points INTEGER DEFAULT 0,
    icon_url TEXT,
    earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_new BOOLEAN DEFAULT true
);

-- 7. AI TUTOR SESSIONS
CREATE TABLE public.tutor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    session_type TEXT DEFAULT 'general',
    duration_minutes INTEGER DEFAULT 0,
    questions_asked INTEGER DEFAULT 0,
    topics_covered TEXT[] DEFAULT '{}',
    session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ
);

-- 8. CALENDAR EVENTS
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'lesson',
    event_date TIMESTAMPTZ NOT NULL,
    event_time TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. ESSENTIAL INDEXES
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_company ON public.user_profiles(company_name);
CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_type ON public.lessons(type);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student ON public.submissions(student_id);
CREATE INDEX idx_achievements_student ON public.achievements(student_id);
CREATE INDEX idx_tutor_sessions_student ON public.tutor_sessions(student_id);
CREATE INDEX idx_calendar_events_student ON public.calendar_events(student_id);
CREATE INDEX idx_calendar_events_date ON public.calendar_events(event_date);

-- 10. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('course-thumbnails', 'course-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('lesson-videos', 'lesson-videos', false, 524288000, ARRAY['video/mp4', 'video/webm']),
    ('user-avatars', 'user-avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('assignments', 'assignments', false, 52428800, ARRAY['application/pdf', 'text/plain', 'application/msword']);

-- 11. HELPER FUNCTIONS (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.is_instructor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('instructor', 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_course_instructor(course_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_uuid 
    AND c.instructor_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(course_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.course_id = course_uuid 
    AND e.student_id = auth.uid()
)
$$;

-- 12. AUTOMATIC PROFILE CREATION FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- 13. ENABLE RLS ON ALL TABLES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 14. RLS POLICIES (Pattern 1: Core User Tables)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public Read, Private Write for Categories
CREATE POLICY "public_can_read_categories"
ON public.categories
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "admins_manage_categories"
ON public.categories
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Pattern 4: Public Read, Instructor Write for Courses
CREATE POLICY "public_can_read_published_courses"
ON public.courses
FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "instructors_manage_own_courses"
ON public.courses
FOR ALL
TO authenticated
USING (instructor_id = auth.uid() OR public.is_instructor_or_admin())
WITH CHECK (instructor_id = auth.uid() OR public.is_instructor_or_admin());

-- Lessons - Only course instructors and enrolled students can see lessons
CREATE POLICY "instructors_manage_course_lessons"
ON public.lessons
FOR ALL
TO authenticated
USING (public.is_course_instructor(course_id))
WITH CHECK (public.is_course_instructor(course_id));

CREATE POLICY "enrolled_students_view_lessons"
ON public.lessons
FOR SELECT
TO authenticated
USING (public.is_enrolled_in_course(course_id) AND is_published = true);

-- Pattern 2: Simple User Ownership for Enrollments
CREATE POLICY "users_manage_own_enrollments"
ON public.enrollments
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Pattern 2: Simple User Ownership for Lesson Progress
CREATE POLICY "users_manage_own_lesson_progress"
ON public.lesson_progress
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Assignments - Course instructors manage, students view
CREATE POLICY "instructors_manage_assignments"
ON public.assignments
FOR ALL
TO authenticated
USING (public.is_course_instructor(course_id))
WITH CHECK (public.is_course_instructor(course_id));

CREATE POLICY "enrolled_students_view_assignments"
ON public.assignments
FOR SELECT
TO authenticated
USING (public.is_enrolled_in_course(course_id));

-- Pattern 2: Simple User Ownership for Submissions
CREATE POLICY "users_manage_own_submissions"
ON public.submissions
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Instructors can view submissions for their courses
CREATE POLICY "instructors_view_course_submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.assignments a
        WHERE a.id = assignment_id 
        AND public.is_course_instructor(a.course_id)
    )
);

-- Pattern 2: Simple User Ownership for remaining tables
CREATE POLICY "users_manage_own_achievements"
ON public.achievements
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

CREATE POLICY "users_manage_own_tutor_sessions"
ON public.tutor_sessions
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

CREATE POLICY "users_manage_own_calendar_events"
ON public.calendar_events
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- 15. STORAGE POLICIES

-- Course thumbnails - public read, instructor upload
CREATE POLICY "public_can_view_course_thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-thumbnails');

CREATE POLICY "instructors_upload_course_thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-thumbnails' AND public.is_instructor_or_admin());

-- Lesson videos - private, course-based access
CREATE POLICY "enrolled_students_view_lesson_videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'lesson-videos' 
    AND (
        owner = auth.uid() 
        OR public.is_instructor_or_admin()
    )
);

CREATE POLICY "instructors_manage_lesson_videos"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'lesson-videos' AND owner = auth.uid())
WITH CHECK (bucket_id = 'lesson-videos');

-- User avatars - public read, private upload
CREATE POLICY "public_can_view_avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-avatars');

CREATE POLICY "users_manage_own_avatars"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'user-avatars' AND owner = auth.uid())
WITH CHECK (bucket_id = 'user-avatars');

-- Assignment files - private to course participants
CREATE POLICY "course_participants_manage_assignments"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'assignments' 
    AND (
        owner = auth.uid() 
        OR public.is_instructor_or_admin()
    )
)
WITH CHECK (bucket_id = 'assignments');

-- 16. TRIGGER FOR AUTOMATIC PROFILE CREATION
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. MOCK DATA
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    instructor_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    category1_id UUID := gen_random_uuid();
    category2_id UUID := gen_random_uuid();
    course1_id UUID := gen_random_uuid();
    course2_id UUID := gen_random_uuid();
    lesson1_id UUID := gen_random_uuid();
    lesson2_id UUID := gen_random_uuid();
    assignment1_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@mentorx.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (instructor_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'instructor@mentorx.com', crypt('instructor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Wilson", "role": "instructor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student1@mentorx.com', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student2@mentorx.com', crypt('student456', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jane Smith", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create categories
    INSERT INTO public.categories (id, name, description, icon) VALUES
        (category1_id, 'Web Development', 'Frontend and backend web development courses', 'code'),
        (category2_id, 'Data Science', 'Machine learning, AI, and data analysis courses', 'chart');

    -- Create courses
    INSERT INTO public.courses (id, title, description, category_id, instructor_id, level, duration_minutes, is_published, rating, total_enrollments) VALUES
        (course1_id, 'React Fundamentals', 'Learn the basics of React development including components, hooks, and state management', category1_id, instructor_uuid, 'beginner'::public.course_level, 480, true, 4.8, 125),
        (course2_id, 'Advanced React Patterns', 'Master advanced React concepts including performance optimization and design patterns', category1_id, instructor_uuid, 'advanced'::public.course_level, 720, true, 4.9, 89);

    -- Create lessons
    INSERT INTO public.lessons (id, course_id, title, description, type, duration_minutes, sort_order, is_published) VALUES
        (lesson1_id, course1_id, 'Understanding React Hooks', 'Deep dive into useState, useEffect, and custom hooks', 'video'::public.lesson_type, 45, 1, true),
        (lesson2_id, course1_id, 'Component State Management', 'Learn how to manage state effectively in React components', 'video'::public.lesson_type, 35, 2, true);

    -- Create enrollments
    INSERT INTO public.enrollments (student_id, course_id, progress_percentage, last_accessed_at) VALUES
        (student1_uuid, course1_id, 53.0, now() - INTERVAL '2 hours'),
        (student2_uuid, course1_id, 78.0, now() - INTERVAL '1 day');

    -- Create lesson progress
    INSERT INTO public.lesson_progress (student_id, lesson_id, course_id, status, watch_time_minutes, completed_at) VALUES
        (student1_uuid, lesson1_id, course1_id, 'completed'::public.progress_status, 45, now() - INTERVAL '1 day'),
        (student1_uuid, lesson2_id, course1_id, 'in_progress'::public.progress_status, 18, null);

    -- Create assignments
    INSERT INTO public.assignments (id, course_id, lesson_id, title, description, max_points, due_date) VALUES
        (assignment1_id, course1_id, lesson1_id, 'React Quiz Assignment', 'Complete the React fundamentals quiz', 100, now() + INTERVAL '2 hours');

    -- Create achievements
    INSERT INTO public.achievements (student_id, title, description, type, points, earned_at) VALUES
        (student1_uuid, 'React Master', 'Completed all React fundamentals lessons with 95% score', 'certificate'::public.achievement_type, 500, now() - INTERVAL '1 day'),
        (student1_uuid, '7-Day Streak', 'Maintained consistent learning for 7 consecutive days', 'streak'::public.achievement_type, 100, now() - INTERVAL '2 days');

    -- Create calendar events
    INSERT INTO public.calendar_events (student_id, course_id, lesson_id, assignment_id, title, event_type, event_date, event_time) VALUES
        (student1_uuid, course1_id, null, assignment1_id, 'React Quiz Due', 'deadline', now() + INTERVAL '2 hours', '14:00'),
        (student1_uuid, null, null, null, 'AI Tutor Session', 'session', now() + INTERVAL '1 day', '10:00');

    -- Create tutor sessions
    INSERT INTO public.tutor_sessions (student_id, course_id, session_type, duration_minutes, questions_asked, topics_covered, ended_at) VALUES
        (student1_uuid, course1_id, 'course_help', 25, 3, ARRAY['hooks', 'state management'], now() - INTERVAL '3 days');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;