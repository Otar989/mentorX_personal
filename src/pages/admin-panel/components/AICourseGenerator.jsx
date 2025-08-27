import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, BookOpen, Clock, Tag, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { aiCourseService } from '../../../services/aiCourseService';
import { supabase } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AICourseGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Load initial data
  useEffect(() => {
    loadUserData();
    loadCategories();
    loadRecentGenerations();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase?.auth?.getUser();
    setUser(user);
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase?.from('categories')?.select('*')?.order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadRecentGenerations = async () => {
    if (!user) return;

    try {
      const courses = await aiCourseService?.getAIGeneratedCourses(user?.id, 5);
      setRecentGenerations(courses);
    } catch (error) {
      console.error('Error loading recent generations:', error);
    }
  };

  const handleGenerateCourse = async () => {
    if (!prompt?.trim()) {
      setError('Пожалуйста, введите описание курса');
      return;
    }

    if (!selectedCategory) {
      setError('Пожалуйста, выберите категорию');
      return;
    }

    if (!user) {
      setError('Необходима авторизация');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCourse(null);

    try {
      // Step 1: Generate course outline
      setGenerationStep('Генерация структуры курса...');
      
      // Step 2: Create course and lessons
      setGenerationStep('Создание курса и уроков...');
      
      const result = await aiCourseService?.generateAndSaveCourse(
        prompt,
        user?.id,
        selectedCategory
      );

      setGenerationStep('Завершение...');
      setGeneratedCourse(result);
      
      // Reload recent generations
      await loadRecentGenerations();
      
      // Clear form
      setPrompt('');
      
    } catch (error) {
      console.error('Error generating course:', error);
      setError(error?.message || 'Произошла ошибка при генерации курса');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handlePublishCourse = async (courseId) => {
    try {
      const { error } = await supabase?.from('courses')?.update({ is_published: true })?.eq('id', courseId);

      if (error) throw error;

      // Update local state
      setRecentGenerations(prev => 
        prev?.map(course => 
          course?.id === courseId 
            ? { ...course, is_published: true }
            : course
        )
      );

      // Update generated course if it matches
      if (generatedCourse?.course?.id === courseId) {
        setGeneratedCourse(prev => ({
          ...prev,
          course: { ...prev?.course, is_published: true }
        }));
      }

    } catch (error) {
      console.error('Error publishing course:', error);
      setError('Ошибка при публикации курса');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}ч ${mins > 0 ? `${mins}мин` : ''}`;
    }
    return `${mins}мин`;
  };

  const suggestedPrompts = [
    'Создай курс по основам React для начинающих разработчиков',
    'Курс по Python для анализа данных и машинному обучению',
    'Введение в UI/UX дизайн с практическими проектами',
    'Современный JavaScript: ES6+ и асинхронное программирование',
    'Основы DevOps: Docker, CI/CD и автоматизация развертывания'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI Генератор Курсов</h2>
          <p className="text-muted-foreground">
            Создавайте полные обучающие курсы с помощью искусственного интеллекта
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Generator */}
        <div className="space-y-6">
          <div className="glass-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Генерация нового курса
            </h3>

            <div className="space-y-4">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Описание курса
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e?.target?.value)}
                  placeholder="Например: Создай курс по основам React для начинающих разработчиков с практическими примерами..."
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isGenerating}
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Категория курса
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e?.target?.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isGenerating}
                >
                  <option value="">Выберите категорию</option>
                  {categories?.map(category => (
                    <option key={category?.id} value={category?.id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-error text-sm bg-error/10 rounded-lg p-3"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateCourse}
                disabled={isGenerating || !prompt?.trim() || !selectedCategory}
                className="w-full"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    {generationStep || 'Генерация...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Сгенерировать курс
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div className="glass-sm rounded-2xl p-6">
            <h4 className="font-medium mb-3">Примеры запросов:</h4>
            <div className="space-y-2">
              {suggestedPrompts?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion)}
                  className="w-full text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-white/5 transition-colors"
                  disabled={isGenerating}
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Course Preview */}
        <div className="space-y-6">
          {/* Generated Course Details */}
          <AnimatePresence>
            {generatedCourse && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-sm rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Курс создан успешно!
                  </h3>
                  {!generatedCourse?.course?.is_published && (
                    <Button
                      size="sm"
                      onClick={() => handlePublishCourse(generatedCourse?.course?.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Опубликовать
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{generatedCourse?.course?.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      {generatedCourse?.course?.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(generatedCourse?.course?.duration_minutes || 0)}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {generatedCourse?.totalLessons || 0} уроков
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {generatedCourse?.course?.level}
                    </div>
                  </div>

                  {/* Lessons Preview */}
                  <div>
                    <h5 className="font-medium mb-2">Уроки курса:</h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {generatedCourse?.lessons?.map((lesson, index) => (
                        <div key={lesson?.id} className="flex items-start gap-3 p-2 bg-white/5 rounded-lg">
                          <span className="text-xs bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{lesson?.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {lesson?.type} • {formatDuration(lesson?.duration_minutes || 0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {generatedCourse?.course?.tags?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Теги:</h5>
                      <div className="flex flex-wrap gap-2">
                        {generatedCourse?.course?.tags?.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Generations */}
          <div className="glass-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Недавние курсы
            </h3>

            <div className="space-y-3">
              {recentGenerations?.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Пока нет созданных курсов
                </p>
              ) : (
                recentGenerations?.map(course => (
                  <div key={course?.id} className="flex items-start justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm">{course?.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {course?.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{formatDuration(course?.duration_minutes || 0)}</span>
                        <span>{course?.lessons?.length || 0} уроков</span>
                        <span className={`px-2 py-1 rounded-full ${
                          course?.is_published 
                            ? 'bg-green-500/20 text-green-400' :'bg-orange-500/20 text-orange-400'
                        }`}>
                          {course?.is_published ? 'Опубликован' : 'Черновик'}
                        </span>
                      </div>
                    </div>
                    
                    {!course?.is_published && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublishCourse(course?.id)}
                        className="ml-3 text-xs"
                      >
                        Опубликовать
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICourseGenerator;