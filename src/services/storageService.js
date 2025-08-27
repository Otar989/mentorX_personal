import { supabase } from '../lib/supabase';

// Storage Service for handling file uploads and downloads
export const storageService = {
  // Upload user avatar
  async uploadAvatar(file, userId) {
    try {
      if (!file || !userId) {
        throw new Error('File and user ID are required');
      }

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes?.includes(file?.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
      }

      if (file?.size > 2 * 1024 * 1024) { // 2MB limit
        throw new Error('File size must be less than 2MB');
      }

      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      const { data, error } = await supabase?.storage?.from('user-avatars')?.upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase?.storage?.from('user-avatars')?.getPublicUrl(fileName);

      return { data: { path: data?.path, publicUrl }, error: null };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { data: null, error: error?.message };
    }
  },

  // Upload course thumbnail (instructors only)
  async uploadCourseThumbnail(file, courseId) {
    try {
      if (!file || !courseId) {
        throw new Error('File and course ID are required');
      }

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes?.includes(file?.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
      }

      if (file?.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `courses/${courseId}/thumbnail.${fileExt}`;

      const { data, error } = await supabase?.storage?.from('course-thumbnails')?.upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase?.storage?.from('course-thumbnails')?.getPublicUrl(fileName);

      return { data: { path: data?.path, publicUrl }, error: null };
    } catch (error) {
      console.error('Error uploading course thumbnail:', error);
      return { data: null, error: error?.message };
    }
  },

  // Upload assignment file
  async uploadAssignmentFile(file, assignmentId, studentId) {
    try {
      if (!file || !assignmentId || !studentId) {
        throw new Error('File, assignment ID, and student ID are required');
      }

      // Validate file size (50MB limit for assignments)
      if (file?.size > 50 * 1024 * 1024) {
        throw new Error('File size must be less than 50MB');
      }

      const fileExt = file?.name?.split('.')?.pop();
      const timestamp = Date.now();
      const fileName = `assignments/${assignmentId}/${studentId}/${timestamp}_${file?.name}`;

      const { data, error } = await supabase?.storage?.from('assignments')?.upload(fileName, file, {
          cacheControl: '3600'
        });

      if (error) throw error;

      // Get signed URL for private access
      const { data: urlData, error: urlError } = await supabase?.storage?.from('assignments')?.createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

      if (urlError) throw urlError;

      return { 
        data: { 
          path: data?.path, 
          signedUrl: urlData?.signedUrl,
          fileName: file?.name,
          fileSize: file?.size,
          uploadedAt: new Date()?.toISOString()
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error uploading assignment file:', error);
      return { data: null, error: error?.message };
    }
  },

  // Upload lesson video (instructors only)
  async uploadLessonVideo(file, lessonId) {
    try {
      if (!file || !lessonId) {
        throw new Error('File and lesson ID are required');
      }

      // Validate file type and size
      const allowedTypes = ['video/mp4', 'video/webm'];
      if (!allowedTypes?.includes(file?.type)) {
        throw new Error('Only MP4 and WebM videos are allowed');
      }

      if (file?.size > 500 * 1024 * 1024) { // 500MB limit
        throw new Error('File size must be less than 500MB');
      }

      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `lessons/${lessonId}/video.${fileExt}`;

      const { data, error } = await supabase?.storage?.from('lesson-videos')?.upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      return { data: { path: data?.path }, error: null };
    } catch (error) {
      console.error('Error uploading lesson video:', error);
      return { data: null, error: error?.message };
    }
  },

  // Get signed URL for private content
  async getSignedUrl(bucket, path, expiresIn = 3600) {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.createSignedUrl(path, expiresIn);

      if (error) throw error;
      return { data: data?.signedUrl, error: null };
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return { data: null, error: error?.message };
    }
  },

  // Get public URL for public content
  getPublicUrl(bucket, path) {
    try {
      const { data } = supabase?.storage?.from(bucket)?.getPublicUrl(path);

      return { data: data?.publicUrl, error: null };
    } catch (error) {
      console.error('Error getting public URL:', error);
      return { data: null, error: error?.message };
    }
  },

  // Delete file
  async deleteFile(bucket, path) {
    try {
      const { error } = await supabase?.storage?.from(bucket)?.remove([path]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { error: error?.message };
    }
  },

  // List files in a directory
  async listFiles(bucket, folder = '') {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.list(folder, {
          limit: 100,
          offset: 0
        });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error listing files:', error);
      return { data: [], error: error?.message };
    }
  }
};

export default storageService;