import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = ({ 
  quality = 'excellent', 
  isConnected = false,
  latency = null,
  bitrate = null 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = () => {
    if (!isConnected) {
      return {
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        icon: 'WifiOff',
        label: 'Не подключено',
        description: 'Подключение не активно'
      };
    }

    switch (quality) {
      case 'excellent':
        return {
          color: 'text-success',
          bgColor: 'bg-success',
          icon: 'Wifi',
          label: 'Отличное',
          description: 'Стабильное соединение высокого качества'
        };
      case 'good':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning',
          icon: 'Wifi',
          label: 'Хорошее',
          description: 'Соединение может периодически прерываться'
        };
      case 'poor':
        return {
          color: 'text-error',
          bgColor: 'bg-error',
          icon: 'Wifi',
          label: 'Плохое',
          description: 'Возможны задержки и потеря качества'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'Wifi',
          label: 'Неизвестно',
          description: 'Проверка качества соединения...'
        };
    }
  };

  const config = getStatusConfig();

  const getSignalBars = () => {
    if (!isConnected) return [false, false, false];
    
    switch (quality) {
      case 'excellent':
        return [true, true, true];
      case 'good':
        return [true, true, false];
      case 'poor':
        return [true, false, false];
      default:
        return [false, false, false];
    }
  };

  const signalBars = getSignalBars();

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
    >
      {/* Main Status Indicator */}
      <motion.div
        className="flex items-center gap-2 px-3 py-2 glass rounded-lg cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Connection Icon */}
        <div className="relative">
          <Icon 
            name={config?.icon} 
            size={16} 
            className={config?.color}
          />
          
          {/* Connection pulse effect for active connections */}
          {isConnected && quality === 'excellent' && (
            <motion.div
              className="absolute inset-0 rounded-full border border-success/30"
              animate={{ 
                scale: [1, 1.5],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
        </div>

        {/* Signal Strength Bars */}
        <div className="flex items-end gap-0.5 h-4">
          {signalBars?.map((isActive, index) => (
            <motion.div
              key={index}
              className={`
                w-1 rounded-sm
                ${isActive ? config?.bgColor : 'bg-muted'}
              `}
              style={{ height: `${(index + 1) * 25}%` }}
              animate={{
                opacity: isActive ? 1 : 0.3,
                scale: isActive && isConnected ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 0.5,
                repeat: isActive && isConnected ? Infinity : 0,
                delay: index * 0.1
              }}
            />
          ))}
        </div>

        <span className={`text-sm font-medium ${config?.color}`}>
          {config?.label}
        </span>
      </motion.div>
      {/* Expanded Details Tooltip */}
      <motion.div
        className={`
          absolute top-full right-0 mt-2 p-4 glass-lg rounded-lg shadow-glass-lg
          whitespace-nowrap z-50 min-w-64
          ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ 
          opacity: isExpanded ? 1 : 0,
          y: isExpanded ? 0 : -10,
          scale: isExpanded ? 1 : 0.95
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Arrow */}
        <div className="absolute bottom-full right-6 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white/20" />
        
        <div className="space-y-3">
          {/* Status Header */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${config?.bgColor}`} />
            <span className="font-medium">Статус соединения</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">
            {config?.description}
          </p>

          {/* Technical Details */}
          {isConnected && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              {latency && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Задержка:</span>
                  <span className={`font-medium ${
                    latency < 50 ? 'text-success' : 
                    latency < 150 ? 'text-warning' : 'text-error'
                  }`}>
                    {latency}ms
                  </span>
                </div>
              )}
              
              {bitrate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Битрейт:</span>
                  <span className="font-medium">
                    {(bitrate / 1000)?.toFixed(1)}kbps
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Протокол:</span>
                <span className="font-medium">WebRTC</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Шифрование:</span>
                <span className="font-medium text-success">DTLS-SRTP</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {isConnected && quality !== 'excellent' && (
            <div className="pt-2 border-t border-white/10">
              <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                Проверить соединение
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConnectionStatus;