import React from 'react';
import { motion } from 'framer-motion';



const LanguageToggle = ({ 
  currentLanguage = 'en', 
  onLanguageChange = () => {},
  className = '' 
}) => {
  const languages = [
    { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
    { code: 'ru', label: 'RU', flag: '🇷🇺', name: 'Русский' }
  ];

  const currentLang = languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];

  const handleLanguageChange = (langCode) => {
    if (langCode !== currentLanguage) {
      onLanguageChange(langCode);
      // Store language preference
      localStorage.setItem('preferred-language', langCode);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-lg p-1 flex items-center gap-1"
      >
        {languages?.map((language) => (
          <button
            key={language?.code}
            onClick={() => handleLanguageChange(language?.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentLanguage === language?.code
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
            }`}
            title={language?.name}
          >
            <span className="text-base">{language?.flag}</span>
            <span>{language?.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default LanguageToggle;