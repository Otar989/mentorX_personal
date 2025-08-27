import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CoursePreviewModal = ({ 
  course, 
  isOpen = false, 
  onClose, 
  onEnroll,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Mock preview lessons
  const previewLessons = [
    {
      id: 1,
      title: 'Введение в курс',
      duration: '5:30',
      type: 'video',
      isFree: true,
      description: 'Обзор курса и план обучения'
    },
    {
      id: 2,
      title: 'Основные концепции',
      duration: '12:45',
      type: 'video',
      isFree: true,
      description: 'Изучаем базовые принципы'
    },
    {
      id: 3,
      title: 'Практическое задание',
      duration: '8:20',
      type: 'practice',
      isFree: false,
      description: 'Первое практическое упражнение'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: 'Eye' },
    { id: 'curriculum', label: 'Программа', icon: 'BookOpen' },
    { id: 'instructor', label: 'Преподаватель', icon: 'User' },
    { id: 'reviews', label: 'Отзывы', icon: 'MessageSquare' }
  ];

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const formatPrice = (price) => {
    if (price === 0) return 'Бесплатно';
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} мин`;
    return `${hours} ч`;
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="Star" size={16} className="text-amber-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="StarHalf" size={16} className="text-amber-400 fill-current" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />);
    }
    
    return stars;
  };

  const handleEnrollClick = () => {
    onEnroll(course);
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">О курсе</h3>
              <p className="text-muted-foreground leading-relaxed">
                {course.description || `Этот курс предназначен для изучения ${course.title}. Вы получите практические навыки и знания, необходимые для успешной работы в данной области. Курс включает теоретические материалы, практические задания и проекты.`}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Что вы изучите</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(course.keyFeatures || [
                  'Основные концепции и принципы',
                  'Практические навыки применения',
                  'Работа с реальными проектами',
                  'Лучшие практики индустрии'
                ]).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Требования</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Dot" size={16} />
                  Базовые знания компьютера
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Dot" size={16} />
                  Желание учиться и развиваться
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Dot" size={16} />
                  Доступ к интернету
                </li>
              </ul>
            </div>
          </div>
        );

      case 'curriculum':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Программа курса</h3>
            <div className="space-y-3">
              {previewLessons.map((lesson, index) => (
                <div key={lesson.id} className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon 
                          name={lesson.type === 'video' ? 'Play' : 'FileText'} 
                          size={16} 
                          className="text-primary" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                      {lesson.isFree && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                          Бесплатно
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  + еще {course.lessonCount - previewLessons.length} уроков
                </p>
              </div>
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={24} color="white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{course.instructor}</h3>
                <p className="text-muted-foreground">Senior Developer & Educator</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Icon name="Users" size={14} />
                    1,234 студентов
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="BookOpen" size={14} />
                    12 курсов
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">О преподавателе</h4>
              <p className="text-muted-foreground leading-relaxed">
                Опытный разработчик с более чем 8-летним стажем в индустрии. 
                Специализируется на современных веб-технологиях и имеет богатый опыт 
                преподавания. Автор множества успешных проектов и курсов.
              </p>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{course.rating}</div>
                <div className="flex items-center gap-1 mt-1">
                  {getRatingStars(course.rating)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {course.reviewCount} отзывов
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-4">{stars}</span>
                    <Icon name="Star" size={14} className="text-amber-400" />
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-amber-400 h-2 rounded-full"
                        style={{ width: `${Math.random() * 80 + 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((review) => (
                <div key={review} className="glass rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={14} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Студент {review}</div>
                      <div className="flex items-center gap-1">
                        {getRatingStars(5)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Отличный курс! Материал подается очень доступно и понятно. 
                    Много практических заданий, которые помогают закрепить знания.
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`glass-lg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Icon name="BookOpen" size={20} color="white" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{course.title}</h2>
              <p className="text-muted-foreground">{course.instructor}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Preview Video/Image */}
            <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
              <Image
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  iconName="Play"
                  iconSize={24}
                  className="glass-lg"
                >
                  Смотреть превью
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-smooth ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto max-h-96">
              {renderTabContent()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="space-y-6">
              {/* Price and Enrollment */}
              <div className="space-y-4">
                <div className="text-center">
                  {course.originalPrice && course.originalPrice !== course.price && (
                    <div className="text-lg text-muted-foreground line-through">
                      {formatPrice(course.originalPrice)}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(course.price)}
                  </div>
                  {course.discount && (
                    <div className="text-sm text-success">
                      Скидка {course.discount}%
                    </div>
                  )}
                </div>

                <Button
                  variant="default"
                  size="lg"
                  onClick={handleEnrollClick}
                  iconName="ArrowRight"
                  iconPosition="right"
                  iconSize={16}
                  className="w-full"
                >
                  Записаться на курс
                </Button>

                {course.hasTrial && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    iconName="Play"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Начать пробный урок
                  </Button>
                )}
              </div>

              {/* Course Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Уровень:</span>
                  <span className="font-medium">{course.difficulty}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Продолжительность:</span>
                  <span className="font-medium">{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Уроков:</span>
                  <span className="font-medium">{course.lessonCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Студентов:</span>
                  <span className="font-medium">{course.studentCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Язык:</span>
                  <span className="font-medium">{course.language || 'Русский'}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-medium">Включено в курс:</h4>
                <div className="space-y-2">
                  {[
                    'Пожизненный доступ',
                    'Сертификат об окончании',
                    'Практические задания',
                    'Поддержка преподавателя',
                    'Мобильное приложение'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewModal;