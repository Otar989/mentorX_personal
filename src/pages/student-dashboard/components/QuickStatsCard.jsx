import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ 
  stats = {},
  className = '' 
}) => {
  const defaultStats = {
    totalHours: 0,
    completedCourses: 0,
    currentStreak: 0,
    totalPoints: 0
  };

  const finalStats = { ...defaultStats, ...stats };

  const statItems = [
    {
      label: 'Study Hours',
      value: finalStats?.totalHours,
      icon: 'Clock',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      suffix: 'h'
    },
    {
      label: 'Completed',
      value: finalStats?.completedCourses,
      icon: 'BookCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      suffix: ' courses'
    },
    {
      label: 'Study Streak',
      value: finalStats?.currentStreak,
      icon: 'Flame',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      suffix: ' days'
    },
    {
      label: 'Total Points',
      value: finalStats?.totalPoints,
      icon: 'Star',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      suffix: ' pts'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`card-glass p-6 ${className}`}
    >
      <h2 className="text-xl font-bold mb-6">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {statItems?.map((stat, index) => (
          <motion.div
            key={stat?.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.1 * index,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="text-center p-4 rounded-xl border border-white/10 hover:border-white/20 transition-smooth"
          >
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + (0.1 * index) }}
              className="space-y-1"
            >
              <p className="text-2xl font-bold">
                {stat?.value}
                <span className="text-sm font-normal text-muted-foreground">
                  {stat?.suffix}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
      {/* Progress Indicators */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Weekly Goal</span>
          <span className="text-sm font-medium">
            {Math.min(finalStats?.totalHours, 10)}/10 hours
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((finalStats?.totalHours / 10) * 100, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10"
      >
        <p className="text-sm text-center">
          {finalStats?.currentStreak > 7 ? 
            `🔥 Amazing! ${finalStats?.currentStreak} day streak!` :
            finalStats?.currentStreak > 3 ?
            `⭐ Great progress! Keep it up!` :
            `🚀 Start your learning journey today!`
          }
        </p>
      </motion.div>
    </motion.div>
  );
};

export default QuickStatsCard;