import { supabase } from '../lib/supabase';
import { aiContentGenerator } from './openaiService';

/**
 * Helper function to make API calls to our backend OpenAI endpoint
 */
async function callOpenAIAPI(messages, options = {}) {
  const {
    model = 'gpt-4',
    maxTokens = 4000,
    temperature = 0.7,
    stream = false
  } = options;

  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        maxTokens,
        temperature,
        stream
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

/**
 * AI Course Management Service
 * Integrates OpenAI course generation with Supabase database
 */
export class AICourseService {
  /**
   * Generate and save a complete AI course
   */
  async generateAndSaveCourse(prompt, instructorId, categoryId) {
    try {
      // Generate course outline using OpenAI
      console.log('Generating course outline with AI...');
      const courseOutline = await aiContentGenerator?.generateCourseOutline(prompt);
      
      // Create the course in database
      const { data: course, error: courseError } = await supabase?.from('courses')?.insert([
          {
            title: courseOutline?.title,
            description: courseOutline?.description,
            level: courseOutline?.level,
            duration_minutes: courseOutline?.duration_minutes,
            tags: courseOutline?.tags || [],
            instructor_id: instructorId,
            category_id: categoryId,
            is_published: false, // Keep unpublished until reviewed
          }
        ])?.select()?.single();

      if (courseError) {
        throw new Error(`Failed to create course: ${courseError.message}`);
      }

      console.log('Course created:', course?.id);

      // Generate and save lessons
      const lessons = [];
      for (let i = 0; i < courseOutline?.lessons?.length; i++) {
        const lessonData = courseOutline?.lessons?.[i];
        
        console.log(`Generating lesson ${i + 1}: ${lessonData?.title}`);
        
        // Generate detailed content for each lesson
        const lessonContent = await aiContentGenerator?.generateLessonContent(
          lessonData?.title,
          lessonData?.type,
          `${courseOutline?.title}: ${courseOutline?.description}`
        );

        // Save lesson to database
        const { data: lesson, error: lessonError } = await supabase?.from('lessons')?.insert([
            {
              title: lessonData?.title,
              description: lessonData?.description,
              content: lessonContent?.content,
              type: lessonData?.type,
              duration_minutes: lessonData?.duration_minutes,
              course_id: course?.id,
              sort_order: i + 1,
              is_published: false
            }
          ])?.select()?.single();

        if (lessonError) {
          console.error(`Failed to create lesson ${i + 1}:`, lessonError);
          continue; // Continue with other lessons
        }

        lessons?.push({
          ...lesson,
          ai_content: lessonContent
        });

        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return {
        course: course,
        lessons: lessons,
        outline: courseOutline,
        generatedAt: new Date(),
        totalLessons: lessons?.length
      };

    } catch (error) {
      console.error('Error generating AI course:', error);
      throw new Error(`Failed to generate course: ${error.message}`);
    }
  }

  /**
   * Generate additional lesson content for existing course
   */
  async generateAdditionalLesson(courseId, lessonPrompt, instructorId) {
    try {
      // Get course context
      const { data: course, error: courseError } = await supabase?.from('courses')?.select('*')?.eq('id', courseId)?.eq('instructor_id', instructorId)?.single();

      if (courseError || !course) {
        throw new Error('Course not found or access denied');
      }

      // Get lesson count for sort order
      const { count } = await supabase?.from('lessons')?.select('*', { count: 'exact' })?.eq('course_id', courseId);

      // Generate lesson content
      const lessonContent = await aiContentGenerator?.generateLessonContent(
        lessonPrompt,
        'text', // Default type
        `${course?.title}: ${course?.description}`
      );

      // Create lesson
      const { data: lesson, error: lessonError } = await supabase?.from('lessons')?.insert([
          {
            title: lessonPrompt,
            description: lessonContent?.summary || '',
            content: lessonContent?.content,
            type: 'text',
            duration_minutes: 30, // Default duration
            course_id: courseId,
            sort_order: (count || 0) + 1,
            is_published: false
          }
        ])?.select()?.single();

      if (lessonError) {
        throw new Error(`Failed to create lesson: ${lessonError.message}`);
      }

      return {
        lesson,
        ai_content: lessonContent
      };

    } catch (error) {
      console.error('Error generating additional lesson:', error);
      throw error;
    }
  }

  /**
   * Enhance existing lesson with AI-generated quiz
   */
  async generateLessonQuiz(lessonId, instructorId, questionCount = 5) {
    try {
      // Get lesson and course context
      const { data: lesson, error: lessonError } = await supabase?.from('lessons')?.select(`
          *,
          courses!inner(instructor_id, title)
        `)?.eq('id', lessonId)?.single();

      if (lessonError || !lesson) {
        throw new Error('Lesson not found');
      }

      // Check instructor permission
      if (lesson?.courses?.instructor_id !== instructorId) {
        throw new Error('Access denied');
      }

      // Generate quiz questions
      const quizData = await aiContentGenerator?.generateQuizQuestions(
        lesson?.title,
        lesson?.content || lesson?.description || '',
        questionCount
      );

      // Create assignment for the quiz
      const { data: assignment, error: assignmentError } = await supabase?.from('assignments')?.insert([
          {
            title: `${lesson?.title} - Quiz`,
            description: `AI-generated quiz for lesson: ${lesson?.title}`,
            type: 'quiz',
            course_id: lesson?.course_id,
            lesson_id: lessonId,
            max_score: questionCount * 10, // 10 points per question
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            instructions: JSON.stringify(quizData)
          }
        ])?.select()?.single();

      if (assignmentError) {
        throw new Error(`Failed to create quiz: ${assignmentError.message}`);
      }

      return {
        assignment,
        quiz_data: quizData,
        question_count: quizData?.questions?.length || 0
      };

    } catch (error) {
      console.error('Error generating lesson quiz:', error);
      throw error;
    }
  }

  /**
   * Get user's AI-generated courses
   */
  async getAIGeneratedCourses(instructorId, limit = 10) {
    try {
      const { data: courses, error } = await supabase?.from('courses')?.select(`
          *,
          categories(name),
          lessons(count)
        `)?.eq('instructor_id', instructorId)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) {
        throw new Error(`Failed to fetch courses: ${error.message}`);
      }

      return courses || [];
    } catch (error) {
      console.error('Error fetching AI courses:', error);
      throw error;
    }
  }

  /**
   * Generate course suggestions based on user preferences
   */
  async generateCourseSuggestions(userInterests, skillLevel = 'beginner', count = 5) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a course recommendation expert. Generate engaging, practical course suggestions. Respond with valid JSON containing an array of course suggestions.'
        },
        {
          role: 'user',
          content: `Generate ${count} course suggestions for someone interested in: ${userInterests?.join(', ')}.
          Skill level: ${skillLevel}.
          
          Each suggestion should include a compelling title, description, estimated duration, and key topics.
          
          Respond with JSON in this format:
          {
            "suggestions": [
              {
                "title": "Course Title",
                "description": "Course description",
                "duration_hours": 10,
                "key_topics": ["topic1", "topic2"],
                "difficulty": "beginner|intermediate|advanced",
                "target_audience": "target audience description"
              }
            ]
          }`
        }
      ];

      const response = await callOpenAIAPI(messages, {
        temperature: 0.8,
        maxTokens: 1500
      });

      const data = JSON.parse(response.content);
      return data?.suggestions || [];

    } catch (error) {
      console.error('Error generating course suggestions:', error);
      throw error;
    }
  }

  /**
   * Analyze course performance and generate insights
   */
  async analyzeCoursePerformance(courseId, instructorId) {
    try {
      // Get course data with enrollments and progress
      const { data: courseData, error } = await supabase?.from('courses')?.select(`
          *,
          enrollments(count),
          lesson_progress(
            progress_status,
            completion_rate
          ),
          lessons(
            id,
            title,
            duration_minutes
          )
        `)?.eq('id', courseId)?.eq('instructor_id', instructorId)?.single();

      if (error) {
        throw new Error('Course not found or access denied');
      }

      // Generate AI insights
      const insights = await this.generateCourseInsights(courseData);

      return {
        course: courseData,
        insights: insights,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error analyzing course performance:', error);
      throw error;
    }
  }

  /**
   * Generate AI insights from course data
   */
  async generateCourseInsights(courseData) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an educational analytics expert. Provide actionable insights based on course data.'
        },
        {
          role: 'user',
          content: `Analyze this course data and provide insights:
          
          Course: ${courseData?.title}
          Enrollments: ${courseData?.enrollments?.length || 0}
          Lessons: ${courseData?.lessons?.length || 0}
          Total Duration: ${courseData?.duration_minutes || 0} minutes
          
          Provide insights on:
          - Course performance
          - Student engagement
          - Areas for improvement
          - Recommendations`
        }
      ];

      const response = await callOpenAIAPI(messages, {
        temperature: 0.6,
        maxTokens: 500
      });

      return response.content;
    } catch (error) {
      console.error('Error generating insights:', error);
      return 'Unable to generate insights at this time.';
    }
  }
}

export const aiCourseService = new AICourseService();