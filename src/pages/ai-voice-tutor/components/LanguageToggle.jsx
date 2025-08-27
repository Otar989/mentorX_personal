import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LanguageToggle = ({ 
  currentLanguage = 'ru', 
  onLanguageChange = () => {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { 
      code: 'ru', 
      name: 'Русский', 
      flag: '🇷🇺',
      nativeName: 'Русский'
    },
    { 
      code: 'en', 
      name: 'English', 
      flag: '🇺🇸',
      nativeName: 'English'
    }
  ];

  const currentLang = languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        className="flex items-center gap-2 px-3 py-2 glass rounded-lg hover:bg-white/90 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.code?.toUpperCase()}</span>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 glass-lg rounded-lg shadow-glass-lg overflow-hidden z-50 min-w-48"
          >
            {/* Header */}
            <div className="p-3 border-b border-white/20">
              <div className="flex items-center gap-2">
                <Icon name="Globe" size={16} className="text-primary" />
                <span className="text-sm font-medium">Язык разговора</span>
              </div>
            </div>

            {/* Language Options */}
            <div className="py-2">
              {languages?.map((language) => (
                <motion.button
                  key={language?.code}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors
                    ${currentLanguage === language?.code ? 'bg-primary/10 text-primary' : ''}
                  `}
                  onClick={() => handleLanguageSelect(language?.code)}
                  whileHover={{ x: 2 }}
                >
                  <span className="text-xl">{language?.flag}</span>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{language?.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{language?.name}</div>
                  </div>

                  {currentLanguage === language?.code && (
                    <Icon name="Check" size={16} className="text-primary" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Auto-detect Option */}
            <div className="border-t border-white/20 p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Zap" size={14} />
                <span>Автоматическое определение включено</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageToggle;