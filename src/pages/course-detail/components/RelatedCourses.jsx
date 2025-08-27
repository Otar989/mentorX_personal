import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedCourses = ({ courses, onCourseClick }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const scroll = (direction) => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const scrollAmount = 320; // Width of one card plus gap
    const newScrollLeft = container?.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container?.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    setCanScrollLeft(container?.scrollLeft > 0);
    setCanScrollRight(
      container?.scrollLeft < container?.scrollWidth - container?.clientWidth - 10
    );
  };

  React.useEffect(() => {
    const container = scrollContainerRef?.current;
    if (container) {
      container?.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container?.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Похожие курсы</h2>
            <p className="text-muted-foreground">
              Другие курсы, которые могут вас заинтересовать
            </p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="h-10 w-10"
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="h-10 w-10"
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>

        {/* Courses Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {courses?.map((course, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 glass rounded-2xl overflow-hidden hover:shadow-glass-lg transition-all duration-300 cursor-pointer group"
                style={{ scrollSnapAlign: 'start' }}
                onClick={() => onCourseClick(course)}
              >
                {/* Course Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button
                        variant="default"
                        size="sm"
                        fullWidth
                        iconName="Play"
                        iconPosition="left"
                      >
                        Предварительный просмотр
                      </Button>
                    </div>
                  </div>

                  {/* Course Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      {course?.level}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm">
                      {course?.duration}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  {course?.discount && (
                    <div className="absolute bottom-4 right-4">
                      <span className="px-2 py-1 bg-success text-success-foreground text-sm font-bold rounded-full">
                        -{course?.discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course?.description}
                    </p>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={course?.instructor?.avatar}
                      alt={course?.instructor?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">{course?.instructor?.name}</span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={14} />
                      <span>{course?.studentsCount?.toLocaleString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={14} className="text-amber-400 fill-current" />
                      <span>{course?.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      <span>{course?.lessonsCount} уроков</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {course?.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(course?.originalPrice)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(course?.price)}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="ArrowRight"
                      iconPosition="right"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Подробнее
                    </Button>
                  </div>

                  {/* Course Features */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Award" size={12} />
                        <span>Сертификат</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Smartphone" size={12} />
                        <span>Мобильный доступ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Infinity" size={12} />
                        <span>Навсегда</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Indicators */}
          <div className="flex justify-center mt-6 md:hidden">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(courses?.length / 2) })?.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-muted"
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/course-catalog'}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Посмотреть все курсы
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RelatedCourses;