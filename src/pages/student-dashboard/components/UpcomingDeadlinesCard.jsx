import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingDeadlinesCard = ({ 
  deadlines = [], 
  onViewDeadline = () => {},
  onViewAll = () => {},
  className = '' 
}) => {
  const formatTimeRemaining = (deadline) => {
    try {
      if (!deadline?.dueDate) return 'N/A';
      
      const now = new Date();
      const dueDate = new Date(deadline.dueDate);
      
      // Check if the date is valid
      if (isNaN(dueDate?.getTime())) return 'Invalid date';
      
      const diff = dueDate - now;
      
      if (diff < 0) return 'Overdue';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h`;
      return 'Due soon';
    } catch (error) {
      console.warn('Error formatting time remaining:', error);
      return 'N/A';
    }
  };

  const formatDueDate = (dueDate) => {
    try {
      if (!dueDate) return 'N/A';
      
      const date = new Date(dueDate);
      
      // Check if the date is valid
      if (isNaN(date?.getTime())) return 'Invalid';
      
      return date?.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit'
      });
    } catch (error) {
      console.warn('Error formatting due date:', error);
      return 'N/A';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      default: return 'CheckCircle';
    }
  };

  // Ensure deadlines is always an array and filter out invalid items
  const safeDeadlines = Array.isArray(deadlines) 
    ? deadlines?.filter(deadline => deadline && typeof deadline === 'object')
    : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`card-glass p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Upcoming Deadlines</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          iconName="Calendar"
          iconPosition="right"
          iconSize={16}
        >
          View All
        </Button>
      </div>
      {safeDeadlines?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Upcoming Deadlines</h3>
          <p className="text-muted-foreground">You're all caught up! Keep up the great work.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {safeDeadlines?.slice(0, 4)?.map((deadline, index) => {
            // Ensure deadline is valid and has required properties
            if (!deadline || typeof deadline !== 'object') {
              return null;
            }

            // Safe conversion of ID to string for React key
            const safeId = deadline?.id ? String(deadline?.id) : `deadline-${index}`;

            return (
              <motion.div
                key={safeId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => onViewDeadline(deadline)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-smooth cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  deadline?.priority === 'high' ? 'bg-error/10' :
                  deadline?.priority === 'medium'? 'bg-warning/10' : 'bg-success/10'
                }`}>
                  <Icon 
                    name={getPriorityIcon(deadline?.priority)} 
                    size={16} 
                    className={getPriorityColor(deadline?.priority)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary transition-smooth">
                    {String(deadline?.title || 'Untitled Assignment')}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {String(deadline?.course || 'No Course')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-medium ${getPriorityColor(deadline?.priority)}`}>
                    {formatTimeRemaining(deadline)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDueDate(deadline?.dueDate)}
                  </p>
                </div>
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-smooth"
                />
              </motion.div>
            );
          })?.filter(Boolean)}

          {safeDeadlines?.length > 4 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewAll}
              className="w-full mt-3"
            >
              View {safeDeadlines?.length - 4} more deadlines
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingDeadlinesCard;