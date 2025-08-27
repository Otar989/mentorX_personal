import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CallControls = ({
  isCallActive = false,
  isMuted = false,
  isSpeakerOn = true,
  isRecording = false,
  isChatOpen = false,
  isScreenSharing = false,
  onStartCall = () => {},
  onEndCall = () => {},
  onToggleMute = () => {},
  onToggleSpeaker = () => {},
  onToggleRecording = () => {},
  onToggleChat = () => {},
  onToggleScreenShare = () => {},
  onOpenHelp = () => {}
}) => {
  if (!isCallActive) {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="default"
            size="lg"
            onClick={onStartCall}
            className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <div className="flex items-center gap-3">
              <Icon name="Phone" size={24} />
              <span className="text-lg font-semibold">Начать разговор</span>
            </div>
          </Button>
        </motion.div>
      </div>
    );
  }

  const controlButtons = [
    // Microphone
    {
      id: 'microphone',
      icon: isMuted ? 'MicOff' : 'Mic',
      label: isMuted ? 'Включить микрофон' : 'Отключить микрофон',
      isActive: !isMuted,
      onClick: onToggleMute,
      variant: isMuted ? 'destructive' : 'default',
      className: isMuted ? 'bg-error hover:bg-error/90' : ''
    },
    // Speaker
    {
      id: 'speaker',
      icon: isSpeakerOn ? 'Volume2' : 'VolumeX',
      label: isSpeakerOn ? 'Отключить динамик' : 'Включить динамик',
      isActive: isSpeakerOn,
      onClick: onToggleSpeaker,
      variant: 'outline'
    },
    // Chat
    {
      id: 'chat',
      icon: 'MessageSquare',
      label: isChatOpen ? 'Закрыть чат' : 'Открыть чат',
      isActive: isChatOpen,
      onClick: onToggleChat,
      variant: isChatOpen ? 'default' : 'outline',
      badge: '2' // Mock unread messages
    },
    // Screen Share
    {
      id: 'screen-share',
      icon: isScreenSharing ? 'MonitorOff' : 'Monitor',
      label: isScreenSharing ? 'Остановить демонстрацию' : 'Демонстрация экрана',
      isActive: isScreenSharing,
      onClick: onToggleScreenShare,
      variant: isScreenSharing ? 'default' : 'outline'
    },
    // Recording
    {
      id: 'recording',
      icon: 'Circle',
      label: isRecording ? 'Остановить запись' : 'Начать запись',
      isActive: isRecording,
      onClick: onToggleRecording,
      variant: isRecording ? 'destructive' : 'outline',
      className: isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''
    },
    // Help
    {
      id: 'help',
      icon: 'HelpCircle',
      label: 'Помощь по уроку',
      onClick: onOpenHelp,
      variant: 'outline'
    }
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Main Control Buttons */}
      <div className="flex items-center gap-2">
        {controlButtons?.map((button) => (
          <motion.div
            key={button?.id}
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={button?.variant || 'outline'}
              size="lg"
              onClick={button?.onClick}
              className={`
                w-12 h-12 rounded-full
                ${button?.className || ''}
                ${button?.isActive ? 'shadow-lg' : ''}
              `}
              title={button?.label}
            >
              <Icon 
                name={button?.icon} 
                size={20} 
                className={button?.isActive && button?.id === 'recording' ? 'fill-current' : ''}
              />
            </Button>

            {/* Badge for notifications */}
            {button?.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold"
              >
                {button?.badge}
              </motion.div>
            )}

            {/* Active indicator */}
            {button?.isActive && button?.id !== 'recording' && (
              <motion.div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-success rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
      {/* Separator */}
      <div className="w-px h-8 bg-border mx-2" />
      {/* End Call Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="destructive"
          size="lg"
          onClick={onEndCall}
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
          title="Завершить звонок"
        >
          <Icon name="PhoneOff" size={20} />
        </Button>
      </motion.div>
      {/* Call Timer */}
      <div className="ml-4 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 bg-success rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>05:23</span>
        </div>
      </div>
    </div>
  );
};

export default CallControls;