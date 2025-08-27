import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInterface = ({ 
  messages = [], 
  onSendMessage = () => {},
  isProcessing = false,
  onClose = () => {}
}) => {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef?.current?.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue?.trim() || attachments?.length > 0) {
      onSendMessage(inputValue?.trim(), attachments);
      setInputValue('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (files) => {
    const newAttachments = Array.from(files)?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file?.name,
      size: file?.size,
      type: file?.type
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev?.filter(att => att?.id !== attachmentId));
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileUpload(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'user': return 'User';
      case 'ai': return 'Bot';
      case 'code': return 'Code';
      case 'help': return 'HelpCircle';
      default: return 'MessageCircle';
    }
  };

  const renderMessage = (message) => {
    const isUser = message?.type === 'user';
    
    return (
      <motion.div
        key={message?.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-primary/20' : 'bg-secondary/20'}
        `}>
          <Icon 
            name={getMessageIcon(message?.type)} 
            size={16} 
            className={isUser ? 'text-primary' : 'text-secondary'}
          />
        </div>
        {/* Message Content */}
        <div className={`
          flex-1 max-w-[80%] 
          ${isUser ? 'items-end' : 'items-start'}
        `}>
          {/* Message Bubble */}
          <div className={`
            p-3 rounded-2xl
            ${isUser 
              ? 'bg-primary text-primary-foreground rounded-br-sm' 
              : 'glass rounded-bl-sm'
            }
            ${message?.type === 'code' ? 'font-mono text-sm' : ''}
          `}>
            {message?.type === 'code' ? (
              <pre className="whitespace-pre-wrap overflow-x-auto">
                <code>{message?.content}</code>
              </pre>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message?.content}
              </p>
            )}

            {/* Attachments */}
            {message?.attachments?.length > 0 && (
              <div className="mt-2 space-y-2">
                {message?.attachments?.map((attachment) => (
                  <div key={attachment?.id} className="flex items-center gap-2 text-xs opacity-80">
                    <Icon name="Paperclip" size={12} />
                    <span>{attachment?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className={`
            flex items-center gap-2 mt-1 px-3
            ${isUser ? 'justify-end' : 'justify-start'}
          `}>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message?.timestamp, { addSuffix: true, locale: ru })}
            </span>
            {isUser && (
              <Icon name="Check" size={12} className="text-success" />
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Icon name="MessageSquare" size={18} className="text-primary" />
          <h3 className="font-medium">Чат с AI Tutor</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          iconName="X"
          iconSize={16}
        />
      </div>
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages?.map(renderMessage)}
        
        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Icon name="Bot" size={16} className="text-secondary" />
            </div>
            <div className="glass p-3 rounded-2xl rounded-bl-sm">
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
        
        <div ref={messagesEndRef} />
      </div>
      {/* Input Area */}
      <div 
        className={`
          p-4 border-t border-white/20 
          ${isDragOver ? 'bg-primary/10' : ''}
          transition-colors duration-200
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e?.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments?.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-3 space-y-2"
            >
              {attachments?.map((attachment) => (
                <div key={attachment?.id} className="flex items-center gap-2 p-2 glass rounded-lg">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{attachment?.name}</div>
                    <div className="text-xs text-muted-foreground">{formatFileSize(attachment?.size)}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment?.id)}
                    iconName="X"
                    iconSize={14}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Row */}
        <div className="flex gap-2">
          {/* File Upload */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef?.current?.click()}
            iconName="Paperclip"
            iconSize={16}
            className="flex-shrink-0"
          />
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e?.target?.files)}
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e?.target?.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение или вопрос..."
              className="
                w-full px-3 py-2 glass rounded-lg resize-none
                focus:outline-none focus:ring-2 focus:ring-primary
                max-h-32 text-sm
              "
              rows={1}
            />
          </div>

          {/* Send Button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleSend}
            disabled={!inputValue?.trim() && attachments?.length === 0}
            iconName="Send"
            iconSize={16}
            className="flex-shrink-0"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setInputValue('Объясни этот код:')}
            iconName="Code"
            iconSize={12}
          >
            Объясни код
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setInputValue('Помоги с ошибкой:')}
            iconName="AlertCircle"
            iconSize={12}
          >
            Помощь с ошибкой
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setInputValue('Дай пример:')}
            iconName="BookOpen"
            iconSize={12}
          >
            Пример
          </Button>
        </div>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <Icon name="Upload" size={32} className="text-primary mx-auto mb-2" />
                <p className="text-primary font-medium">Перетащите файлы сюда</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatInterface;