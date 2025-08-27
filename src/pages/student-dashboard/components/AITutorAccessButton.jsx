import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AITutorAccessButton = ({ 
  onStartSession = () => {},
  isSessionActive = false,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onStartSession();
  };

  return (
    <motion.div 
      className={`fixed bottom-6 right-6 z-50 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {/* Main AI Tutor Button */}
      <motion.div
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="default"
          size="lg"
          onClick={handleClick}
          className={`
            w-16 h-16 rounded-full shadow-glass-lg
            bg-gradient-to-r from-primary to-secondary
            hover:from-primary/90 hover:to-secondary/90
            transition-all duration-300
            ${isSessionActive ? 'animate-pulse' : ''}
          `}
        >
          <Icon 
            name={isSessionActive ? "MicOff" : "Mic"} 
            size={24} 
            color="white" 
          />
        </Button>

        {/* Animated Ring */}
        {isSessionActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          className={`
            absolute bottom-full right-0 mb-3 px-3 py-2
            glass-lg rounded-lg shadow-glass-lg
            whitespace-nowrap text-sm font-medium
            pointer-events-none
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
        >
          {isSessionActive ? 'End AI Session' : 'Start AI Tutor'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
        </motion.div>
      </motion.div>
      {/* Quick Actions Menu */}
      <motion.div
        className="absolute bottom-full right-0 mb-4 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 20
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStartSession('quick-help')}
          className="glass-lg shadow-glass-lg whitespace-nowrap"
          iconName="HelpCircle"
          iconPosition="left"
          iconSize={16}
        >
          Quick Help
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStartSession('practice-session')}
          className="glass-lg shadow-glass-lg whitespace-nowrap"
          iconName="Target"
          iconPosition="left"
          iconSize={16}
        >
          Practice Session
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStartSession('code-review')}
          className="glass-lg shadow-glass-lg whitespace-nowrap"
          iconName="Code"
          iconPosition="left"
          iconSize={16}
        >
          Code Review
        </Button>
      </motion.div>
      {/* Status Indicator */}
      {isSessionActive && (
        <motion.div
          className="absolute -top-2 -left-2 w-6 h-6 bg-success rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl -z-10"
        animate={{ 
          scale: isHovered ? 1.5 : 1.2,
          opacity: isHovered ? 0.6 : 0.3
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AITutorAccessButton;