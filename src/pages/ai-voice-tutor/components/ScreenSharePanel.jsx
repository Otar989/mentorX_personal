import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScreenSharePanel = ({ 
  isActive = false, 
  onToggle = () => {},
  onAnnotate = () => {} 
}) => {
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [currentTool, setCurrentTool] = useState('pen');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);

  const annotationTools = [
    { id: 'pen', name: 'Ручка', icon: 'Pen' },
    { id: 'highlighter', name: 'Маркер', icon: 'Highlighter' },
    { id: 'arrow', name: 'Стрелка', icon: 'ArrowRight' },
    { id: 'rectangle', name: 'Прямоугольник', icon: 'Square' },
    { id: 'circle', name: 'Круг', icon: 'Circle' },
    { id: 'text', name: 'Текст', icon: 'Type' }
  ];

  const handleToggleAnnotation = () => {
    setIsAnnotating(!isAnnotating);
  };

  const handleClearAnnotations = () => {
    setAnnotations([]);
    if (canvasRef?.current) {
      const ctx = canvasRef?.current?.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef?.current?.width, canvasRef?.current?.height);
    }
  };

  const handleToolChange = (tool) => {
    setCurrentTool(tool);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isActive) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <Icon name="Monitor" size={64} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Демонстрация экрана</h3>
        <p className="text-muted-foreground mb-6">
          Поделитесь своим экраном для совместного решения задач
        </p>
        <Button
          variant="default"
          onClick={onToggle}
          iconName="Share"
          iconPosition="left"
        >
          Начать демонстрацию
        </Button>
      </div>
    );
  }

  return (
    <div className={`
      ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-full'}
      flex flex-col
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium">Демонстрация экрана</span>
          </div>

          {/* Annotation Tools */}
          {isAnnotating && (
            <div className="flex items-center gap-2 ml-6">
              {annotationTools?.map((tool) => (
                <Button
                  key={tool?.id}
                  variant={currentTool === tool?.id ? "default" : "outline"}
                  size="xs"
                  onClick={() => handleToolChange(tool?.id)}
                  iconName={tool?.icon}
                  iconSize={14}
                  className="text-xs"
                />
              ))}
              
              <div className="w-px h-6 bg-white/20 mx-2" />
              
              <Button
                variant="outline"
                size="xs"
                onClick={handleClearAnnotations}
                iconName="Eraser"
                iconSize={14}
                className="text-xs"
              >
                Очистить
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isAnnotating ? "default" : "outline"}
            size="sm"
            onClick={handleToggleAnnotation}
            iconName="Edit3"
            iconSize={16}
          >
            {isAnnotating ? 'Завершить' : 'Аннотации'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFullscreen}
            iconName={isFullscreen ? "Minimize" : "Maximize"}
            iconSize={16}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            iconName="X"
            iconSize={16}
          />
        </div>
      </div>
      {/* Screen Content */}
      <div className="flex-1 relative bg-gray-900">
        {/* Mock screen content */}
        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-center text-white">
            <Icon name="Monitor" size={96} className="mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-4">Демонстрация экрана</h2>
            <p className="text-lg opacity-80">
              Здесь отображается содержимое вашего экрана
            </p>
            <div className="mt-8 p-6 bg-white/10 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-2">Активные функции:</h3>
              <ul className="text-sm space-y-1 text-left">
                <li>• Аннотации и рисование</li>
                <li>• Полноэкранный режим</li>
                <li>• Совместная работа</li>
                <li>• Сохранение сессии</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Annotation Canvas */}
        {isAnnotating && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair"
            style={{ pointerEvents: isAnnotating ? 'auto' : 'none' }}
          />
        )}

        {/* Annotation Indicator */}
        {isAnnotating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-4 glass-lg rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <Icon name="Edit3" size={16} className="text-primary" />
              <span className="text-sm font-medium">
                Режим аннотаций: {annotationTools?.find(t => t?.id === currentTool)?.name}
              </span>
            </div>
          </motion.div>
        )}

        {/* Participants List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 glass-lg rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={16} className="text-secondary" />
            <span className="text-sm font-medium">Участники (2)</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Вы (ведущий)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>AI Tutor</span>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Footer Controls */}
      <div className="flex items-center justify-center p-4 bg-black/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <Icon name="Clock" size={16} />
            <span>05:23</span>
          </div>
          
          <div className="flex items-center gap-2 text-white text-sm">
            <Icon name="Eye" size={16} />
            <span>2 участника</span>
          </div>
          
          <div className="flex items-center gap-2 text-white text-sm">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>Высокое качество</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenSharePanel;