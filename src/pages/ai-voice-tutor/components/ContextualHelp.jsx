import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContextualHelp = ({ 
  lesson = null, 
  onClose = () => {},
  onRequestHelp = () => {} 
}) => {
  const [selectedHint, setSelectedHint] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');

  const helpCategories = [
    {
      id: 'concepts',
      title: 'Объяснение концепций',
      icon: 'BookOpen',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      questions: [
        'Что такое React хуки?',
        'Как работает useState?',
        'В чем разница между функциональными и классовыми компонентами?',
        'Когда использовать useEffect?'
      ]
    },
    {
      id: 'debugging',
      title: 'Отладка кода',
      icon: 'Bug',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      questions: [
        'Почему компонент не обновляется?',
        'Как исправить ошибку состояния?',
        'Что означает эта ошибка в консоли?',
        'Как правильно обработать async операции?'
      ]
    },
    {
      id: 'examples',
      title: 'Примеры кода',
      icon: 'Code',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      questions: [
        'Покажи пример useState',
        'Как создать форму с валидацией?',
        'Пример компонента с API запросом',
        'Как правильно использовать useEffect?'
      ]
    },
    {
      id: 'best-practices',
      title: 'Лучшие практики',
      icon: 'Star',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      questions: [
        'Как структурировать React приложение?',
        'Паттерны для управления состоянием',
        'Оптимизация производительности',
        'Accessibility в React'
      ]
    }
  ];

  const handleQuestionSelect = (question) => {
    onRequestHelp(question);
    onClose();
  };

  const handleCustomQuestion = () => {
    if (customQuestion?.trim()) {
      onRequestHelp(customQuestion?.trim());
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-lg rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Помощь по уроку</h2>
            <p className="text-muted-foreground">
              {lesson?.title || 'Получите помощь по текущему уроку'}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={18}
          />
        </div>

        {/* Current Lesson Info */}
        {lesson && (
          <div className="glass rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{lesson?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Прогресс: {lesson?.progress}% • Тема: {lesson?.currentTopic}
                </p>
              </div>
            </div>

            {/* Quick Hints */}
            {lesson?.hints?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Быстрые подсказки:</h4>
                <div className="space-y-2">
                  {lesson?.hints?.map((hint, index) => (
                    <motion.button
                      key={index}
                      className="w-full text-left p-2 bg-muted/50 rounded text-sm hover:bg-muted transition-colors"
                      onClick={() => handleQuestionSelect(`Объясни: ${hint}`)}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-start gap-2">
                        <Icon name="Lightbulb" size={14} className="text-yellow-500 mt-0.5" />
                        <span>{hint}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {helpCategories?.map((category) => (
            <motion.div
              key={category?.id}
              className="glass rounded-lg p-4 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedHint(selectedHint === category?.id ? null : category?.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 ${category?.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon name={category?.icon} size={16} className={category?.color} />
                </div>
                <h3 className="font-medium">{category?.title}</h3>
              </div>

              <AnimatePresence>
                {selectedHint === category?.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    {category?.questions?.map((question, index) => (
                      <motion.button
                        key={index}
                        className="w-full text-left p-2 bg-muted/30 rounded text-sm hover:bg-muted/50 transition-colors"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleQuestionSelect(question);
                        }}
                        whileHover={{ x: 2 }}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Custom Question Input */}
        <div className="glass rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Icon name="MessageCircle" size={16} className="text-primary" />
            Задать свой вопрос
          </h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e?.target?.value)}
              placeholder="Введите ваш вопрос..."
              className="flex-1 px-3 py-2 bg-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              onKeyPress={(e) => {
                if (e?.key === 'Enter') {
                  handleCustomQuestion();
                }
              }}
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleCustomQuestion}
              disabled={!customQuestion?.trim()}
              iconName="Send"
              iconSize={14}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuestionSelect('Повтори последнее объяснение')}
              iconName="RotateCcw"
              iconSize={14}
            >
              Повторить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuestionSelect('Дай другой пример')}
              iconName="Shuffle"
              iconSize={14}
            >
              Другой пример
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuestionSelect('Проверь мой код')}
              iconName="CheckCircle"
              iconSize={14}
            >
              Проверить код
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContextualHelp;