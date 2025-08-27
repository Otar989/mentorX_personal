import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CourseHero = ({ 
  course,
  onEnroll,
  onPreview,
  isEnrolled = false,
  userProgress = 0
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoQuality, setVideoQuality] = useState('720p');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    onPreview();
  };

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Video Preview - Mobile First */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-glass-lg">
              {/* Video Thumbnail */}
              <div className="relative w-full h-full">
                <Image
                  src={course?.previewImage}
                  alt={`${course?.title} preview`}
                  className="w-full h-full object-cover"
                />
                
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  {!isVideoPlaying ? (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleVideoPlay}
                      className="rounded-full w-16 h-16 p-0 shadow-glass-lg"
                    >
                      <Icon name="Play" size={24} color="white" />
                    </Button>
                  ) : (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <div className="text-white text-center">
                        <Icon name="Play" size={48} className="mx-auto mb-4" />
                        <p>Video Preview Playing...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                {isVideoPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleVideoToggle}
                          className="text-white hover:bg-white/20"
                        >
                          <Icon name={isVideoPlaying ? "Pause" : "Play"} size={20} />
                        </Button>
                        <span className="text-sm">2:34 / 5:42</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={videoQuality}
                          onChange={(e) => setVideoQuality(e?.target?.value)}
                          className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/20"
                        >
                          <option value="480p">480p</option>
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                        </select>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleFullscreen}
                          className="text-white hover:bg-white/20"
                        >
                          <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={20} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-1 mt-3">
                      <div className="bg-primary h-1 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                )}

                {/* Course Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    {course?.level}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm">
                    {course?.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Course Info */}
            <div className="mt-6 lg:hidden">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Icon name="Users" size={16} />
                <span>{course?.enrolledCount?.toLocaleString('ru-RU')} студентов</span>
                <span>•</span>
                <Icon name="Clock" size={16} />
                <span>Обновлено {course?.lastUpdated}</span>
              </div>
              
              <h1 className="text-2xl font-bold mb-3">{course?.title}</h1>
              
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {course?.description}
              </p>

              {/* Instructor Info - Mobile */}
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={course?.instructor?.avatar}
                  alt={course?.instructor?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{course?.instructor?.name}</p>
                  <p className="text-sm text-muted-foreground">{course?.instructor?.title}</p>
                </div>
              </div>

              {/* Rating - Mobile */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={16}
                      className={i < Math.floor(course?.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="font-medium">{course?.rating}</span>
                <span className="text-muted-foreground">({course?.reviewCount} отзывов)</span>
              </div>
            </div>
          </div>

          {/* Course Information Sidebar */}
          <div className="lg:col-span-4">
            <div className="glass-lg rounded-2xl p-6 sticky top-24">
              {/* Desktop Course Title */}
              <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Icon name="Users" size={16} />
                  <span>{course?.enrolledCount?.toLocaleString('ru-RU')} студентов</span>
                </div>
                
                <h1 className="text-2xl font-bold mb-3">{course?.title}</h1>
                
                <p className="text-muted-foreground mb-4">
                  {course?.description}
                </p>

                {/* Instructor Info - Desktop */}
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={course?.instructor?.avatar}
                    alt={course?.instructor?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{course?.instructor?.name}</p>
                    <p className="text-sm text-muted-foreground">{course?.instructor?.title}</p>
                  </div>
                </div>

                {/* Rating - Desktop */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={16}
                        className={i < Math.floor(course?.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{course?.rating}</span>
                  <span className="text-muted-foreground">({course?.reviewCount})</span>
                </div>
              </div>

              {/* Progress for Enrolled Users */}
              {isEnrolled && (
                <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Ваш прогресс</span>
                    <span className="text-primary font-bold">{userProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="progress-ambient h-2 rounded-full transition-all duration-500"
                      style={{ width: `${userProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Следующий урок: {course?.nextLesson}
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  {course?.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(course?.originalPrice)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(course?.price)}
                  </span>
                  {course?.discount && (
                    <span className="px-2 py-1 bg-success text-success-foreground text-sm rounded-full">
                      -{course?.discount}%
                    </span>
                  )}
                </div>

                {course?.installmentPrice && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Или {formatPrice(course?.installmentPrice)}/мес в рассрочку
                  </p>
                )}
              </div>

              {/* Enrollment Button */}
              <div className="space-y-3 mb-6">
                {isEnrolled ? (
                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    onClick={() => window.location.href = '/lesson-interface'}
                    iconName="Play"
                    iconPosition="left"
                  >
                    Продолжить обучение
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="default"
                      size="lg"
                      fullWidth
                      onClick={onEnroll}
                      iconName="CreditCard"
                      iconPosition="left"
                    >
                      Записаться на курс
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={onPreview}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      Попробовать бесплатно
                    </Button>
                  </>
                )}
              </div>

              {/* Course Features */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span>{course?.duration} обучения</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="BookOpen" size={16} className="text-muted-foreground" />
                  <span>{course?.lessonsCount} уроков</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <span>{course?.assignmentsCount} практических заданий</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Award" size={16} className="text-muted-foreground" />
                  <span>Сертификат о прохождении</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Infinity" size={16} className="text-muted-foreground" />
                  <span>Пожизненный доступ</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Smartphone" size={16} className="text-muted-foreground" />
                  <span>Доступ с мобильных устройств</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="TrendingUp" size={16} />
                  <span>+{course?.recentEnrollments} записались за последнюю неделю</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;