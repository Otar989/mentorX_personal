/**
 * OpenAI service for MentorX platform
 * Handles AI course generation, chat completion, voice transcription, and real-time voice tutoring
 * Uses backend API instead of direct OpenAI client calls for security
 */

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

    if (stream) {
      return response; // Return response for streaming
    }

    return await response.json();
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

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
      const messages = [
        {
          role: 'system',
          content: `You are an expert course creator for MentorX learning platform. Generate comprehensive course outlines with structured lessons. Always respond in JSON format.`
        },
        {
          role: 'user',
          content: `Create a detailed course outline for: ${prompt}. 
          Include:
          - Course title, description, level (beginner/intermediate/advanced), duration, tags
          - At least 5-8 lessons with titles, descriptions, types, and estimated durations
          - Learning objectives and prerequisites
          
          Respond with valid JSON in this format:
          {
            "title": "Course Title",
            "description": "Course description",
            "level": "beginner|intermediate|advanced",
            "duration_minutes": 180,
            "tags": ["tag1", "tag2"],
            "learning_objectives": ["objective1", "objective2"],
            "prerequisites": ["prereq1", "prereq2"],
            "lessons": [
              {
                "title": "Lesson Title",
                "description": "Lesson description",
                "type": "video|text|quiz|assignment",
                "duration_minutes": 30,
                "content_outline": "Brief content outline"
              }
            ]
          }`
        }
      ];

      const response = await callOpenAIAPI(messages);
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error generating course outline:', error);
      throw error;
    }
  }

  /**
   * Generates detailed lesson content for a specific lesson
   */
  async generateLessonContent(lessonTitle, lessonType, courseContext) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert educational content creator. Generate detailed lesson content that is engaging and pedagogically sound.'
        },
        {
          role: 'user',
          content: `Generate detailed content for lesson "${lessonTitle}" of type "${lessonType}" in the context of: ${courseContext}`
        }
      ];

      const response = await callOpenAIAPI(messages);
      return response.content;
    } catch (error) {
      console.error('Error generating lesson content:', error);
      throw error;
    }
  }

  /**
   * Generates quiz questions for a lesson
   */
  async generateQuizQuestions(lessonContent, difficulty = 'intermediate', questionCount = 5) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert educational assessor. Create well-crafted quiz questions based on lesson content.'
        },
        {
          role: 'user',
          content: `Generate ${questionCount} ${difficulty} level quiz questions based on this lesson content: ${lessonContent}`
        }
      ];

      const response = await callOpenAIAPI(messages);
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      throw error;
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
    this.currentContext = null;
  }

  /**
   * Initialize tutoring session with context
   */
  initializeSession(courseContext, lessonContext = null) {
    this.currentContext = {
      course: courseContext,
      lesson: lessonContext,
      startTime: new Date(),
    };

    this.conversation = [
      {
        role: 'system',
        content: `You are an AI tutor for the MentorX platform. You are helping with: ${courseContext?.title || 'General Learning'}. 
        ${lessonContext ? `Current lesson: ${lessonContext.title}` : ''} 
        Be encouraging, patient, and provide clear explanations. Ask clarifying questions when needed.`
      }
    ];

    return this.currentContext;
  }

  /**
   * Process voice input and generate AI tutor response
   */
  async processVoiceInput(userInput, language = 'ru') {
    try {
      this.conversation.push({
        role: 'user',
        content: userInput,
        timestamp: new Date(),
      });

      const response = await callOpenAIAPI(this.conversation);
      
      const tutorMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };

      this.conversation.push(tutorMessage);
      return tutorMessage;
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw error;
    }
  }

  /**
   * Streaming chat completion for real-time responses
   */
  async *streamResponse(userInput, onChunk) {
    try {
      this.conversation.push({
        role: 'user',
        content: userInput,
        timestamp: new Date(),
      });

      const response = await callOpenAIAPI(this.conversation, { stream: true });
      
      if (!response.body) {
        throw new Error('No response body for streaming');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                if (onChunk) onChunk(parsed.content);
                yield parsed.content;
              }
            } catch (e) {
              // Ignore malformed JSON
            }
          }
        }
      }
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
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful AI tutor. Provide clear, concise help on the requested topic.'
        },
        {
          role: 'user',
          content: `Provide ${difficulty} level help on: ${topic}`
        }
      ];

      const response = await callOpenAIAPI(messages);
      return {
        content: response.content,
        timestamp: new Date(),
        topic
      };
    } catch (error) {
      console.error('Error getting contextual help:', error);
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearConversation() {
    this.conversation = this.conversation.filter(msg => msg.role === 'system');
  }

  /**
   * Get conversation summary
   */
  getConversationSummary() {
    const userMessages = this.conversation.filter(msg => msg.role === 'user');
    const assistantMessages = this.conversation.filter(msg => msg.role === 'assistant');

    return {
      totalMessages: this.conversation.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      topics: this.extractTopics(),
      duration: this.currentContext?.startTime 
        ? Math.floor((new Date() - this.currentContext.startTime) / 1000 / 60) 
        : 0
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
  constructor() {
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Start recording audio from microphone
   */
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      return { success: true, message: 'Recording started' };
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording and return audio blob
   */
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.isRecording = false;
        this.audioChunks = [];

        // Stop all tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());

        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Convert speech to text using browser's SpeechRecognition API
   */
  startSpeechRecognition(onResult, onError, language = 'ru-RU') {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError(new Error('Speech recognition not supported'));
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      onResult({ finalTranscript, interimTranscript });
    };

    recognition.onerror = onError;
    
    recognition?.start();
    return recognition;
  }

  /**
   * Convert text to speech using browser's SpeechSynthesis API
   */
  speak(text, options = {}) {
    const {
      lang = 'ru-RU',
      rate = 1.0,
      pitch = 1.0,
      volume = 1.0
    } = options;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      speechSynthesis.speak(utterance);
      return utterance;
    } else {
      console.warn('Speech synthesis not supported');
      return null;
    }
  }
}

// Export service instances
export const aiContentGenerator = new AIContentGeneratorService();
export const aiVoiceTutor = new AIVoiceTutorService();
export const aiAudioService = new AIAudioService();