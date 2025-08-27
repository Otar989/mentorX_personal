import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CourseCard = ({ 
  course, 
  onEnroll, 
  onPreview, 
  onWishlist, 
  isWishlisted = false,
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      stars.push(<Icon key={i} name="Star" size={14} className="text-amber-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="StarHalf" size={14} className="text-amber-400 fill-current" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />);
    }
    
    return stars;
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onWishlist(course.id);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview(course);
  };

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    onEnroll(course);
  };

  return (
    <div 
      className={`group relative glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-lg hover:scale-[1.02] cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Icon name="BookOpen" size={32} className="text-muted-foreground" />
          </div>
        )}

        {/* Promotional Badge */}
        {course.discount && (
          <div className="absolute top-3 left-3 bg-error text-error-foreground px-2 py-1 rounded-lg text-xs font-semibold">
            -{course.discount}%
          </div>
        )}

        {/* Free Trial Badge */}
        {course.hasTrial && (
          <div className="absolute top-3 right-3 bg-success text-success-foreground px-2 py-1 rounded-lg text-xs font-semibold">
            Пробный урок
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Icon 
            name={isWishlisted ? "Heart" : "Heart"} 
            size={16} 
            className={isWishlisted ? "text-error fill-current" : "text-white"} 
          />
        </button>

        {/* Quick Preview Button */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="default"
            size="sm"
            onClick={handlePreviewClick}
            iconName="Play"
            iconPosition="left"
            iconSize={16}
            className="glass-lg"
          >
            Предварительный просмотр
          </Button>
        </div>

        {/* Difficulty Level */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.difficulty === 'Начинающий' ? 'bg-success/20 text-success' :
            course.difficulty === 'Средний' ? 'bg-warning/20 text-warning' :
            'bg-error/20 text-error'
          }`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-medium">{course.category}</span>
          {course.language && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{course.language}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={12} color="white" />
          </div>
          <span className="text-sm text-muted-foreground">{course.instructor}</span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {getRatingStars(course.rating)}
          </div>
          <span className="text-sm font-medium">{course.rating}</span>
          <span className="text-sm text-muted-foreground">({course.reviewCount})</span>
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={14} />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="BookOpen" size={14} />
            <span>{course.lessonCount} уроков</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Users" size={14} />
            <span>{course.studentCount}</span>
          </div>
        </div>

        {/* Price and Enrollment */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="space-y-1">
            {course.originalPrice && course.originalPrice !== course.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(course.originalPrice)}
              </span>
            )}
            <div className="text-xl font-bold text-primary">
              {formatPrice(course.price)}
            </div>
          </div>
          
          <Button
            variant={course.isEnrolled ? "outline" : "default"}
            size="sm"
            onClick={handleEnrollClick}
            iconName={course.isEnrolled ? "CheckCircle" : "Plus"}
            iconPosition="left"
            iconSize={16}
          >
            {course.isEnrolled ? 'Записан' : 'Записаться'}
          </Button>
        </div>

        {/* Progress Bar for Enrolled Courses */}
        {course.isEnrolled && course.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Прогресс</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="progress-ambient h-2 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hover Overlay with Additional Info */}
      <div className={`absolute inset-0 glass-lg p-4 transition-all duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">{course.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {course.description}
            </p>
            
            {/* Key Features */}
            <div className="space-y-1">
              <h5 className="text-sm font-medium">Что вы изучите:</h5>
              <ul className="text-xs text-muted-foreground space-y-1">
                {course.keyFeatures?.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Icon name="Check" size={12} className="text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewClick}
              iconName="Eye"
              iconSize={16}
              className="flex-1"
            >
              Просмотр
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleEnrollClick}
              iconName="ArrowRight"
              iconSize={16}
              className="flex-1"
            >
              Подробнее
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;