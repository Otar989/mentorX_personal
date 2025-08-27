import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password, language = 'en' }) => {
  // Password strength criteria
  const criteria = [
    {
      key: 'length',
      test: (pwd) => pwd?.length >= 8,
      text: {
        en: 'At least 8 characters',
        ru: 'Минимум 8 символов'
      }
    },
    {
      key: 'uppercase',
      test: (pwd) => /[A-Z]/?.test(pwd),
      text: {
        en: 'One uppercase letter',
        ru: 'Одна заглавная буква'
      }
    },
    {
      key: 'lowercase',
      test: (pwd) => /[a-z]/?.test(pwd),
      text: {
        en: 'One lowercase letter',
        ru: 'Одна строчная буква'
      }
    },
    {
      key: 'number',
      test: (pwd) => /\d/?.test(pwd),
      text: {
        en: 'One number',
        ru: 'Одна цифра'
      }
    },
    {
      key: 'special',
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/?.test(pwd),
      text: {
        en: 'One special character',ru: 'Один спецсимвол'
      }
    }
  ];

  // Calculate password strength
  const passedCriteria = criteria?.filter(criterion => criterion?.test(password));
  const strengthPercentage = (passedCriteria?.length / criteria?.length) * 100;

  // Determine strength level and color
  const getStrengthLevel = () => {
    if (strengthPercentage <= 40) return { level: 'weak', color: 'bg-red-500' };
    if (strengthPercentage <= 60) return { level: 'fair', color: 'bg-yellow-500' };
    if (strengthPercentage <= 80) return { level: 'good', color: 'bg-blue-500' };
    return { level: 'strong', color: 'bg-green-500' };
  };

  const strength = getStrengthLevel();

  const strengthLabels = {
    en: {
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong'
    },
    ru: {
      weak: 'Слабый',
      fair: 'Средний',
      good: 'Хороший',
      strong: 'Надежный'
    }
  };

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {language === 'ru' ? 'Надежность пароля' : 'Password Strength'}
          </span>
          <span className={`font-medium ${
            strength?.level === 'strong' ? 'text-green-600' :
            strength?.level === 'good' ? 'text-blue-600' :
            strength?.level === 'fair'? 'text-yellow-600' : 'text-red-600'
          }`}>
            {strengthLabels?.[language]?.[strength?.level]}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${strength?.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${strengthPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {criteria?.map((criterion, index) => {
          const isPassed = criterion?.test(password);
          
          return (
            <motion.div
              key={criterion?.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isPassed ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                isPassed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
              }`}>
                {isPassed ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </div>
              <span className={isPassed ? 'line-through' : ''}>
                {criterion?.text?.[language]}
              </span>
            </motion.div>
          );
        })}
      </div>
      {/* Additional Security Tips */}
      {strengthPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'ru' ?'Отличный пароль! Ваш аккаунт хорошо защищен.' :'Great password! Your account is well protected.'
              }
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PasswordStrengthIndicator;