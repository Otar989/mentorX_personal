import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CoursePreview = ({ 
  isOpen, 
  onClose, 
  course,
  onEnroll 
}) => {
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!isOpen) return null;

  const previewLessons = course?.modules?.flatMap(module => module.lessons)?.filter(lesson => lesson?.isPreview);

  const currentLesson = previewLessons?.[currentPreviewIndex];

  const handleNext = () => {
    if (currentPreviewIndex < previewLessons?.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1);
      setIsVideoPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex(currentPreviewIndex - 1);
      setIsVideoPlaying(false);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-lg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold">Предварительный просмотр курса</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {course?.title} • {previewLessons?.length} бесплатных уроков
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(90vh-120px)]">
          {/* Video Player */}
          <div className="lg:col-span-2 bg-black flex flex-col">
            {/* Video Area */}
            <div className="flex-1 relative flex items-center justify-center">
              {!isVideoPlaying ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon name="Play" size={32} color="white" />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {currentLesson?.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    Продолжительность: {currentLesson?.duration}
                  </p>
                  <Button
                    variant="default"
                    onClick={handleVideoPlay}
                    iconName="Play"
                    iconPosition="left"
                  >
                    Воспроизвести урок
                  </Button>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icon name="Play" size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Воспроизведение урока...</p>
                    <p className="text-sm opacity-70 mt-2">{currentLesson?.title}</p>
                  </div>
                </div>
              )}

              {/* Video Controls */}
              {isVideoPlaying && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsVideoPlaying(false)}
                        className="text-white hover:bg-white/20"
                      >
                        <Icon name="Pause" size={20} />
                      </Button>
                      <span className="text-sm">1:23 / {currentLesson?.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                      >
                        <Icon name="Settings" size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                      >
                        <Icon name="Maximize" size={20} />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div className="bg-primary h-1 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="bg-gray-900 p-4 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentPreviewIndex === 0}
                iconName="ChevronLeft"
                iconPosition="left"
                className="text-white hover:bg-white/10"
              >
                Предыдущий
              </Button>
              
              <div className="text-white text-sm">
                {currentPreviewIndex + 1} из {previewLessons?.length}
              </div>
              
              <Button
                variant="ghost"
                onClick={handleNext}
                disabled={currentPreviewIndex === previewLessons?.length - 1}
                iconName="ChevronRight"
                iconPosition="right"
                className="text-white hover:bg-white/10"
              >
                Следующий
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-background border-l border-white/10 flex flex-col">
            {/* Course Info */}
            <div className="p-6 border-b border-white/10">
              <h3 className="font-bold mb-2">{course?.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Icon name="User" size={14} />
                <span>{course?.instructor?.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={14} className="text-amber-400 fill-current" />
                  <span>{course?.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Users" size={14} />
                  <span>{course?.enrolledCount?.toLocaleString('ru-RU')}</span>
                </div>
              </div>
            </div>

            {/* Preview Lessons List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h4 className="font-semibold mb-3">Бесплатные уроки</h4>
                <div className="space-y-2">
                  {previewLessons?.map((lesson, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPreviewIndex(index);
                        setIsVideoPlaying(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-smooth ${
                        index === currentPreviewIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === currentPreviewIndex
                            ? 'bg-primary-foreground/20'
                            : 'bg-muted'
                        }`}>
                          <Icon
                            name="Play"
                            size={14}
                            className={index === currentPreviewIndex ? 'text-primary-foreground' : 'text-muted-foreground'}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson?.title}</p>
                          <p className={`text-xs ${
                            index === currentPreviewIndex
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}>
                            {lesson?.duration}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enrollment CTA */}
            <div className="p-6 border-t border-white/10">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Понравился курс?
                </p>
                <div className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0
                  })?.format(course?.price)}
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="default"
                  fullWidth
                  onClick={onEnroll}
                  iconName="CreditCard"
                  iconPosition="left"
                >
                  Записаться на курс
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={onClose}
                >
                  Продолжить просмотр
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground text-center">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <Icon name="Award" size={12} />
                    <span>Сертификат</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Infinity" size={12} />
                    <span>Навсегда</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;