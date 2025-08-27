import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionRecording = ({ 
  isRecording = false, 
  isActive = false,
  onToggle = () => {} 
}) => {
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  // Update recording duration
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      setShowPrivacyNotice(true);
    } else {
      onToggle();
    }
  };

  const handleConfirmRecording = () => {
    setShowPrivacyNotice(false);
    onToggle();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Recording Status Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-6 z-40"
          >
            <div className="glass-lg rounded-lg p-4 min-w-64">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-3 h-3 bg-red-500 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-medium text-sm">Запись сессии</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={onToggle}
                  iconName="X"
                  iconSize={14}
                />
              </div>

              {/* Recording Duration */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="font-mono text-lg font-bold">
                    {formatDuration(recordingDuration)}
                  </span>
                </div>
              </div>

              {/* Recording Quality */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Mic" size={14} className="text-success" />
                  <span className="text-muted-foreground">Аудио</span>
                </div>
                <span className="text-success font-medium">HD</span>
              </div>

              {/* Storage Info */}
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Размер файла</span>
                  <span>{Math.round(recordingDuration * 0.5)} MB</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Privacy Notice Modal */}
      <AnimatePresence>
        {showPrivacyNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-lg rounded-2xl p-6 max-w-md w-full mx-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Запись сессии</h3>
                  <p className="text-sm text-muted-foreground">Согласие на обработку данных</p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-sm mb-4 leading-relaxed">
                  Вы собираетесь записать голосовую сессию с AI Tutor. 
                  Запись будет включать:
                </p>
                
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Голосовые сообщения и ответы AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Текстовые сообщения в чате</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Демонстрацию экрана (если используется)</span>
                  </li>
                </ul>

                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Icon name="Info" size={16} className="text-primary mt-0.5" />
                    <div className="text-xs">
                      <p className="font-medium mb-1">Конфиденциальность</p>
                      <p className="text-muted-foreground">
                        Записи сохраняются локально и могут быть удалены в любое время. 
                        Данные не передаются третьим лицам.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPrivacyNotice(false)}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleConfirmRecording}
                  iconName="Circle"
                  iconPosition="left"
                >
                  Начать запись
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SessionRecording;