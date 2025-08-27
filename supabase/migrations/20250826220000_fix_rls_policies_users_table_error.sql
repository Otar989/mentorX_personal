-- Fix RLS policies that are causing "permission denied for table users" error
-- The issue is that some policies are trying to access auth.users directly
-- which requires special permissions. We need to use user_profiles or auth metadata instead.

-- First, drop the problematic policies
DROP POLICY IF EXISTS "admins_manage_categories" ON public.categories;

-- Create a helper function that uses auth metadata instead of querying user_profiles
-- This avoids circular dependencies and permission issues
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Alternative function that queries user_profiles safely 
-- (only for non-user tables to avoid circular dependencies)
CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
)
$$;

-- Fix categories table policies
CREATE POLICY "admins_manage_categories"
ON public.categories
FOR ALL
TO authenticated
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

-- Fix courses table policies if they have similar issues
DROP POLICY IF EXISTS "instructors_manage_own_courses" ON public.courses;

-- Create a safer function for instructor/admin access
CREATE OR REPLACE FUNCTION public.can_manage_course(course_instructor_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND (up.id = course_instructor_id OR up.role IN ('admin', 'instructor'))
    AND up.is_active = true
)
$$;

-- Recreate the courses policy with safer logic
CREATE POLICY "instructors_manage_own_courses"
ON public.courses
FOR ALL
TO authenticated
USING (
    instructor_id = auth.uid() 
    OR public.has_admin_role()
)
WITH CHECK (
    instructor_id = auth.uid() 
    OR public.has_admin_role()
);

-- Ensure user_profiles table has the simplest possible policy (Pattern 1)
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;

CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Grant necessary permissions for the functions
GRANT EXECUTE ON FUNCTION public.is_admin_from_auth() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_course(UUID) TO authenticated;

-- Add comments for clarity
COMMENT ON FUNCTION public.is_admin_from_auth() IS 'Checks if current user is admin using auth metadata - safe for all tables';
COMMENT ON FUNCTION public.has_admin_role() IS 'Checks if current user is admin using user_profiles - only for non-user tables';
COMMENT ON FUNCTION public.can_manage_course(UUID) IS 'Checks if current user can manage a specific course';