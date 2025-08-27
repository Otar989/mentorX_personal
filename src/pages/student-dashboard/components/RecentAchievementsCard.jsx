import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentAchievementsCard = ({ 
  achievements = [], 
  onViewAchievement = () => {},
  onViewAll = () => {},
  className = '' 
}) => {
  const getAchievementIcon = (type) => {
    switch (type) {
      case 'certificate': return 'Award';
      case 'badge': return 'Shield';
      case 'milestone': return 'Target';
      case 'streak': return 'Flame';
      default: return 'Star';
    }
  };

  const getAchievementColor = (type) => {
    switch (type) {
      case 'certificate': return 'text-accent';
      case 'badge': return 'text-primary';
      case 'milestone': return 'text-success';
      case 'streak': return 'text-error';
      default: return 'text-secondary';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`card-glass p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Achievements</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          iconName="Trophy"
          iconPosition="right"
          iconSize={16}
        >
          View All
        </Button>
      </div>
      {achievements?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Trophy" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
          <p className="text-muted-foreground mb-4">Complete courses and assignments to earn your first achievement!</p>
          <Button variant="outline" onClick={() => onViewAll('/course-catalog')}>
            Start Learning
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements?.slice(0, 3)?.map((achievement, index) => (
            <motion.div
              key={achievement?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              onClick={() => onViewAchievement(achievement)}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-smooth cursor-pointer group border border-white/10"
            >
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement?.type === 'certificate' ? 'bg-accent/10' :
                  achievement?.type === 'badge' ? 'bg-primary/10' :
                  achievement?.type === 'milestone' ? 'bg-success/10' :
                  achievement?.type === 'streak'? 'bg-error/10' : 'bg-secondary/10'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon 
                  name={getAchievementIcon(achievement?.type)} 
                  size={24} 
                  className={getAchievementColor(achievement?.type)}
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-smooth">
                  {achievement?.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {achievement?.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    Earned {formatDate(achievement?.earnedDate)}
                  </span>
                  {achievement?.isNew && (
                    <motion.span 
                      className="px-2 py-1 bg-success/10 text-success text-xs rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      New!
                    </motion.span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                {achievement?.points && (
                  <span className="text-sm font-bold text-accent">
                    +{achievement?.points}
                  </span>
                )}
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-smooth"
                />
              </div>
            </motion.div>
          ))}

          {achievements?.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewAll}
              className="w-full mt-4"
            >
              View {achievements?.length - 3} more achievements
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default RecentAchievementsCard;