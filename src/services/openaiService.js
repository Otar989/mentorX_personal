import OpenAI from 'openai';

/**
 * OpenAI service for MentorX platform
 * Handles AI course generation, chat completion, voice transcription, and real-time voice tutoring
 */

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * AI Course Generation Service
 * Creates complete courses with lessons based on user input
 */
export class AIContentGeneratorService {
  /**
   * Generates a complete course outline based on topic and requirements
   */
  async generateCourseOutline(prompt) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert course creator for MentorX learning platform. Generate comprehensive course outlines with structured lessons. Always respond in JSON format with the exact structure requested.`
          },
          {
            role: 'user',
            content: `Create a detailed course outline for: ${prompt}. 
            Include:
            - Course title, description, level (beginner/intermediate/advanced), duration, tags
            - At least 5-8 lessons with titles, descriptions, types, and estimated durations
            - Learning objectives and prerequisites`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'course_outline_response',
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
                duration_minutes: { type: 'number' },
                tags: { type: 'array', items: { type: 'string' } },
                learning_objectives: { type: 'array', items: { type: 'string' } },
                prerequisites: { type: 'array', items: { type: 'string' } },
                lessons: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      type: { type: 'string', enum: ['video', 'text', 'quiz', 'assignment', 'live_session'] },
                      duration_minutes: { type: 'number' },
                      content_outline: { type: 'string' }
                    },
                    required: ['title', 'description', 'type', 'duration_minutes', 'content_outline']
                  }
                }
              },
              required: ['title', 'description', 'level', 'duration_minutes', 'tags', 'lessons'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.7,
        max_tokens: 2000
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error generating course outline:', error);
      throw new Error('Failed to generate course outline');
    }
  }

  /**
   * Generates detailed lesson content for a specific lesson
   */
  async generateLessonContent(lessonTitle, lessonType, courseContext) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert content creator for MentorX. Create detailed, engaging lesson content that includes practical examples, explanations, and interactive elements.`
          },
          {
            role: 'user',
            content: `Create detailed content for lesson: "${lessonTitle}" 
            Type: ${lessonType}
            Course context: ${courseContext}
            
            Include:
            - Structured content with clear sections
            - Practical examples and code snippets if relevant
            - Key concepts and explanations
            - Interactive elements or questions
            - Summary and next steps`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'lesson_content_response',
            schema: {
              type: 'object',
              properties: {
                content: { type: 'string' },
                key_concepts: { type: 'array', items: { type: 'string' } },
                examples: { type: 'array', items: { type: 'string' } },
                practice_questions: { type: 'array', items: { type: 'string' } },
                summary: { type: 'string' },
                next_steps: { type: 'string' }
              },
              required: ['content', 'key_concepts', 'summary'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.7,
        max_tokens: 1500
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error generating lesson content:', error);
      throw new Error('Failed to generate lesson content');
    }
  }

  /**
   * Generates quiz questions for a lesson
   */
  async generateQuizQuestions(lessonTitle, content, questionCount = 5) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Generate educational quiz questions with multiple choice answers. Make them challenging but fair, testing understanding rather than memorization.'
          },
          {
            role: 'user',
            content: `Create ${questionCount} quiz questions for lesson: "${lessonTitle}"
            Content: ${content?.substring(0, 1000)}...
            
            Each question should have 4 options with one correct answer.`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'quiz_questions_response',
            schema: {
              type: 'object',
              properties: {
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      question: { type: 'string' },
                      options: { type: 'array', items: { type: 'string' } },
                      correct_answer: { type: 'number' },
                      explanation: { type: 'string' }
                    },
                    required: ['question', 'options', 'correct_answer', 'explanation']
                  }
                }
              },
              required: ['questions'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.8,
        max_tokens: 1000
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      throw new Error('Failed to generate quiz questions');
    }
  }
}

/**
 * AI Voice Tutor Service
 * Handles real-time voice tutoring and conversations
 */
export class AIVoiceTutorService {
  constructor() {
    this.conversation = [];
    this.currentCourse = null;
    this.currentLesson = null;
  }

  /**
   * Initialize tutoring session with context
   */
  initializeSession(courseContext, lessonContext = null) {
    this.currentCourse = courseContext;
    this.currentLesson = lessonContext;
    this.conversation = [
      {
        role: 'system',
        content: `You are an expert AI tutor for MentorX platform. You are helping a student with ${courseContext?.title || 'learning'}. 
        ${lessonContext ? `Current lesson: ${lessonContext?.title}` : ''}
        
        Guidelines:
        - Be encouraging and supportive
        - Explain concepts clearly with examples
        - Ask follow-up questions to ensure understanding
        - Provide hints rather than direct answers when appropriate
        - Adapt your teaching style to the student's level
        - Keep responses concise for voice interaction
        - Use simple language that's easy to understand when spoken`
      }
    ];
  }

  /**
   * Process voice input and generate AI tutor response
   */
  async processVoiceInput(userInput, language = 'ru') {
    try {
      this.conversation?.push({
        role: 'user',
        content: userInput
      });

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: this.conversation,
        temperature: 0.7,
        max_tokens: 200, // Keep responses concise for voice
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      });

      const aiResponse = response?.choices?.[0]?.message?.content;
      
      this.conversation?.push({
        role: 'assistant',
        content: aiResponse
      });

      // Keep conversation history manageable
      if (this.conversation?.length > 20) {
        this.conversation = [
          this.conversation?.[0], // Keep system message
          ...this.conversation?.slice(-18) // Keep last 18 messages
        ];
      }

      return {
        text: aiResponse,
        timestamp: new Date(),
        language: language
      };

    } catch (error) {
      console.error('Error processing voice input:', error);
      throw new Error('Failed to process voice input');
    }
  }

  /**
   * Streaming chat completion for real-time responses
   */
  async *streamResponse(userInput, onChunk) {
    try {
      this.conversation?.push({
        role: 'user',
        content: userInput
      });

      const stream = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: this.conversation,
        stream: true,
        temperature: 0.7,
        max_tokens: 200
      });

      let fullResponse = '';
      
      for await (const chunk of stream) {
        const content = chunk?.choices?.[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          if (onChunk) {
            onChunk(content);
          }
          yield content;
        }
      }

      this.conversation?.push({
        role: 'assistant',
        content: fullResponse
      });

    } catch (error) {
      console.error('Error in streaming response:', error);
      throw error;
    }
  }

  /**
   * Get contextual help for current lesson
   */
  async getContextualHelp(topic, difficulty = 'beginner') {
    try {
      const helpPrompt = `The student needs help with: ${topic}
      ${this.currentLesson ? `Current lesson context: ${this.currentLesson?.title}` : ''}
      Difficulty level: ${difficulty}
      
      Provide a helpful explanation with examples.`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful tutor. Provide clear, concise explanations with practical examples.'
          },
          {
            role: 'user',
            content: helpPrompt
          }
        ],
        temperature: 0.6,
        max_tokens: 300
      });

      return {
        content: response?.choices?.[0]?.message?.content,
        topic: topic,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error getting contextual help:', error);
      throw new Error('Failed to get contextual help');
    }
  }

  /**
   * Clear conversation history
   */
  clearConversation() {
    if (this.conversation?.length > 0) {
      this.conversation = [this.conversation?.[0]]; // Keep only system message
    }
  }

  /**
   * Get conversation summary
   */
  getConversationSummary() {
    const userMessages = this.conversation?.filter(msg => msg?.role === 'user');
    const aiMessages = this.conversation?.filter(msg => msg?.role === 'assistant');
    
    return {
      totalMessages: this.conversation?.length - 1, // Exclude system message
      userMessages: userMessages?.length,
      aiMessages: aiMessages?.length,
      topics: this.extractTopics(),
      startTime: this.sessionStartTime,
      duration: this.sessionStartTime ? Date.now() - this.sessionStartTime : 0
    };
  }

  /**
   * Extract topics discussed from conversation
   */
  extractTopics() {
    // Simple topic extraction - could be enhanced with more sophisticated NLP
    const allText = this.conversation?.filter(msg => msg?.role !== 'system')?.map(msg => msg?.content)?.join(' ');
      
    // Extract potential topics (this is a simplified approach)
    const topics = [];
    if (allText?.includes('hook') || allText?.includes('useState') || allText?.includes('useEffect')) {
      topics?.push('React Hooks');
    }
    if (allText?.includes('component') || allText?.includes('JSX')) {
      topics?.push('React Components');
    }
    if (allText?.includes('state') || allText?.includes('props')) {
      topics?.push('State Management');
    }
    
    return topics;
  }
}

/**
 * Audio Processing Service
 * Handles speech-to-text and text-to-speech functionality
 */
export class AIAudioService {
  /**
   * Transcribe audio to text using OpenAI Whisper
   */
  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData?.append('file', audioBlob, 'audio.webm');
      formData?.append('model', 'whisper-1');
      formData?.append('language', 'ru'); // Default to Russian, can be made configurable

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env?.VITE_OPENAI_API_KEY}`,
        },
        body: formData
      });

      const data = await response?.json();
      return data?.text;

    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Convert text to speech (using browser's speech synthesis)
   * Note: OpenAI's TTS API requires backend proxy for security
   */
  async textToSpeech(text, language = 'ru-RU', rate = 1.0, pitch = 1.0) {
    return new Promise((resolve, reject) => {
      try {
        if (!window.speechSynthesis) {
          throw new Error('Speech synthesis not supported');
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error in text to speech:', error);
        reject(error);
      }
    });
  }

  /**
   * Start continuous speech recognition
   */
  startSpeechRecognition(onResult, onError, language = 'ru-RU') {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event?.resultIndex; i < event?.results?.length; i++) {
        const transcript = event?.results?.[i]?.[0]?.transcript;
        if (event?.results?.[i]?.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      onResult({ final: finalTranscript, interim: interimTranscript });
    };

    recognition.onerror = onError;
    
    recognition?.start();
    return recognition;
  }
}

// Export service instances
export const aiContentGenerator = new AIContentGeneratorService();
export const aiVoiceTutor = new AIVoiceTutorService();
export const aiAudioService = new AIAudioService();

// Export OpenAI client for advanced use cases
export { openai };