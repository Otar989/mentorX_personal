import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import Icon from '../../../components/AppIcon';

const LiveTranscript = ({ 
  messages = [], 
  isProcessing = false, 
  currentLanguage = 'ru' 
}) => {
  const scrollRef = useRef(null);
  const locale = currentLanguage === 'ru' ? ru : enUS;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = scrollRef?.current?.scrollHeight;
    }
  }, [messages, isProcessing]);

  const getSpeakerIcon = (speaker) => {
    switch (speaker) {
      case 'user':
        return 'User';
      case 'ai':
        return 'Bot';
      default:
        return 'MessageCircle';
    }
  };

  const getSpeakerColor = (speaker) => {
    switch (speaker) {
      case 'user':
        return 'text-primary';
      case 'ai':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSpeakerName = (speaker) => {
    switch (speaker) {
      case 'user':
        return currentLanguage === 'ru' ? 'Вы' : 'You';
      case 'ai':
        return 'AI Tutor';
      default:
        return 'System';
    }
  };

  return (
    <div className="glass rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Icon name="FileText" size={18} className="text-primary" />
          <h3 className="font-medium">
            {currentLanguage === 'ru' ? 'Транскрипция разговора' : 'Live Transcript'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language indicator */}
          <span className="text-xs px-2 py-1 bg-muted rounded-full">
            {currentLanguage === 'ru' ? 'РУС' : 'ENG'}
          </span>
          
          {/* Live indicator */}
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-success rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs text-muted-foreground">
              {currentLanguage === 'ru' ? 'В эфире' : 'LIVE'}
            </span>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        <AnimatePresence>
          {messages?.map((message) => (
            <motion.div
              key={message?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-3"
            >
              {/* Speaker Icon */}
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full 
                ${message?.speaker === 'user' ? 'bg-primary/20' : 'bg-secondary/20'}
                flex items-center justify-center
              `}>
                <Icon 
                  name={getSpeakerIcon(message?.speaker)} 
                  size={14} 
                  className={getSpeakerColor(message?.speaker)}
                />
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                {/* Speaker and timestamp */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium text-sm ${getSpeakerColor(message?.speaker)}`}>
                    {getSpeakerName(message?.speaker)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message?.timestamp, { 
                      addSuffix: true, 
                      locale 
                    })}
                  </span>
                  {message?.language && (
                    <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                      {message?.language?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Message text */}
                <p className="text-sm leading-relaxed break-words">
                  {message?.text}
                </p>

                {/* Confidence indicator for speech recognition */}
                {message?.confidence && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {currentLanguage === 'ru' ? 'Точность:' : 'Confidence:'}
                      </span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`
                            h-full rounded-full
                            ${message?.confidence > 0.8 
                              ? 'bg-success' 
                              : message?.confidence > 0.6 
                              ? 'bg-warning' :'bg-error'
                            }
                          `}
                          initial={{ width: 0 }}
                          animate={{ width: `${message?.confidence * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(message?.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Processing indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Icon name="Bot" size={14} className="text-secondary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm text-secondary">AI Tutor</span>
                <span className="text-xs text-muted-foreground">
                  {currentLanguage === 'ru' ? 'печатает...' : 'typing...'}
                </span>
              </div>
              
              <div className="flex gap-1">
                {[0, 1, 2]?.map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-secondary/50 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {messages?.length === 0 && !isProcessing && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">
              {currentLanguage === 'ru' ?'Транскрипция появится здесь' :'Transcript will appear here'
              }
            </h4>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === 'ru' ?'Начните разговор, чтобы увидеть живую транскрипцию' :'Start speaking to see live transcription'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTranscript;