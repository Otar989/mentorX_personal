import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ProgressIndicator = ({ currentStep, totalSteps, language = 'en' }) => {
  const steps = [
    {
      number: 1,
      title: {
        en: 'Account Info',
        ru: 'Данные Аккаунта'
      }
    },
    {
      number: 2,
      title: {
        en: 'Verification',
        ru: 'Подтверждение'
      }
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        {steps?.map((step, index) => {
          const isActive = currentStep === step?.number;
          const isCompleted = currentStep > step?.number;
          const isLast = index === steps?.length - 1;

          return (
            <div key={step?.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <motion.div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all ${
                  isCompleted
                    ? 'bg-success border-success text-success-foreground'
                    : isActive
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-muted-foreground/30 text-muted-foreground'
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  step?.number
                )}

                {/* Active Step Pulse */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </motion.div>
              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 mx-3 h-0.5 bg-muted relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-success"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Step Labels */}
      <div className="flex items-center justify-between">
        {steps?.map((step) => {
          const isActive = currentStep === step?.number;
          const isCompleted = currentStep > step?.number;

          return (
            <motion.div
              key={step?.number}
              className={`text-center transition-colors ${
                isCompleted || isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
              animate={{
                y: isActive ? -2 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <div className={`text-sm font-medium ${
                isActive ? 'text-primary' : ''
              }`}>
                {step?.title?.[language]}
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Progress Percentage */}
      <div className="mt-4 text-center">
        <motion.div
          className="text-xs text-muted-foreground"
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {language === 'ru' 
            ? `Шаг ${currentStep} из ${totalSteps}`
            : `Step ${currentStep} of ${totalSteps}`
          }
        </motion.div>
        
        {/* Progress bar background */}
        <div className="mt-2 w-full bg-muted rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;