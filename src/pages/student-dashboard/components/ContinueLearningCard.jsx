import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ContinueLearningCard = ({ 
  currentCourse, 
  onResume = () => {},
  onViewAll = () => {},
  className = '' 
}) => {
  if (!currentCourse) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card-glass p-6 ${className}`}
      >
        <div className="text-center py-8">
          <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Начните свое обучение</h3>
          <p className="text-muted-foreground mb-4">Просмотрите каталог курсов, чтобы начать обучение</p>
          <Button variant="default" onClick={() => onViewAll('/course-catalog')}>
            Изучить курсы
          </Button>
        </div>
      </motion.div>
    );
  }

  // Safely extract values from the currentCourse object
  const courseTitle = currentCourse?.title || 'Курс не найден';
  const courseThumbnail = currentCourse?.thumbnail_url || currentCourse?.thumbnail;
  const courseProgress = currentCourse?.enrollment?.progress_percentage || 0;
  const currentLessonNumber = currentCourse?.currentLesson ? 
    (currentCourse?.enrollment?.current_lesson_index || 1) : 1;
  const totalLessons = currentCourse?.totalLessons || 0;
  const currentLessonTitle = currentCourse?.currentLesson?.title || 'Урок не найден';
  const studyStreak = currentCourse?.enrollment?.study_streak || 0;
  const courseId = currentCourse?.id;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-glass p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Продолжить обучение</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
        >
          Показать все
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <Image 
              src={courseThumbnail}
              alt={courseTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-1 right-1">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Play" size={12} color="white" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 truncate">{courseTitle}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Урок {currentLessonNumber} из {totalLessons}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {currentLessonTitle}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-medium">{Math.round(courseProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div 
              className="progress-ambient h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${courseProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="default" 
            onClick={() => onResume(courseId)}
            iconName="Play"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Продолжить обучение
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onViewAll(`/course-detail/${courseId}`)}
          >
            <Icon name="ExternalLink" size={16} />
          </Button>
        </div>

        {/* Study Streak */}
        {studyStreak > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <Icon name="Flame" size={16} className="text-accent" />
            <span className="text-sm font-medium">
              {studyStreak} дней подряд обучения!
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContinueLearningCard;