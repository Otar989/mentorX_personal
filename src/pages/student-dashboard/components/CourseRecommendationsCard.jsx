import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CourseRecommendationsCard = ({ 
  recommendations = [], 
  onViewCourse = () => {},
  onViewAll = () => {},
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= recommendations.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? recommendations.length - 1 : prev - 1
    );
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-success';
      case 'intermediate': return 'text-warning';
      case 'advanced': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (recommendations.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`card-glass p-6 ${className}`}
      >
        <div className="text-center py-8">
          <Icon name="Lightbulb" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-muted-foreground mb-4">Complete more courses to get personalized recommendations</p>
          <Button variant="outline" onClick={() => onViewAll('/course-catalog')}>
            Browse All Courses
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`card-glass p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recommended for You</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
        >
          View All
        </Button>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        {recommendations.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 glass-lg"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 glass-lg"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </>
        )}

        {/* Course Cards Container */}
        <div className="overflow-hidden mx-8">
          <motion.div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {recommendations.map((course, index) => (
              <motion.div
                key={course.id}
                className="w-full flex-shrink-0 px-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <div 
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-smooth cursor-pointer group"
                  onClick={() => onViewCourse(course.id)}
                >
                  {/* Course Thumbnail */}
                  <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4">
                    <Image 
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.difficulty === 'beginner' ? 'bg-success/20 text-success' :
                        course.difficulty === 'intermediate'? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                      }`}>
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Icon name="Clock" size={12} />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base group-hover:text-primary transition-smooth line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    
                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Users" size={12} />
                        <span>{course.enrolledCount} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={12} className="text-accent" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {course.tags?.slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCourse(course.id);
                      }}
                      className="w-full mt-3"
                      iconName="ArrowRight"
                      iconPosition="right"
                      iconSize={14}
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dots Indicator */}
        {recommendations.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-smooth ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseRecommendationsCard;