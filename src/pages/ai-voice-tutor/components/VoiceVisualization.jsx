import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const VoiceVisualization = ({ 
  isActive = false, 
  voiceLevel = 0, 
  isAIProcessing = false, 
  isMuted = false 
}) => {
  const bars = Array.from({ length: 12 }, (_, i) => i);
  
  const getBarHeight = (index) => {
    if (!isActive) return 20;
    if (isMuted) return 10;
    
    const baseHeight = 20;
    const maxHeight = 80;
    const normalizedLevel = voiceLevel / 100;
    
    // Create wave pattern
    const waveOffset = Math.sin((Date.now() / 100) + index * 0.5) * 0.3;
    const levelHeight = normalizedLevel * maxHeight + waveOffset * 10;
    
    return Math.max(baseHeight, Math.min(maxHeight, baseHeight + levelHeight));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Main Voice Visualization */}
      <div className="relative">
        {/* Central Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            boxShadow: isActive 
              ? `0 0 ${20 + voiceLevel * 0.5}px rgba(37, 99, 235, 0.3)`
              : '0 0 10px rgba(37, 99, 235, 0.1)'
          }}
          className={`
            w-32 h-32 rounded-full glass-lg flex items-center justify-center
            ${isActive ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'}
            transition-all duration-300
          `}
        >
          <Icon 
            name={isMuted ? "MicOff" : "Mic"} 
            size={48} 
            color={isActive ? "white" : "currentColor"} 
          />
        </motion.div>

        {/* Voice Activity Rings */}
        {isActive && !isMuted && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-secondary/30"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5
              }}
            />
          </>
        )}

        {/* AI Processing Indicator */}
        {isAIProcessing && (
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Icon name="Brain" size={16} color="white" />
          </motion.div>
        )}
      </div>
      {/* Voice Level Bars */}
      <div className="flex items-end gap-1 h-20">
        {bars?.map((_, index) => (
          <motion.div
            key={index}
            className={`
              w-3 rounded-full
              ${isActive && !isMuted 
                ? 'bg-gradient-to-t from-primary to-secondary' :'bg-muted'
              }
            `}
            animate={{
              height: getBarHeight(index),
              opacity: isActive ? 1 : 0.5
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-lg font-medium mb-1">
          {!isActive 
            ? 'Нажмите для начала разговора'
            : isMuted 
            ? 'Микрофон отключен'
            : isAIProcessing
            ? 'AI обрабатывает ответ...' :'Говорите или слушайте'
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {isActive ? 'Активная сессия • Высокое качество' : 'Готов к подключению'}
        </p>
      </motion.div>
    </div>
  );
};

export default VoiceVisualization;