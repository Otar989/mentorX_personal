import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmailVerification = ({ 
  email, 
  onVerify, 
  onBack, 
  isLoading, 
  language = 'en' 
}) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Localization
  const translations = {
    en: {
      title: 'Check Your Email',
      subtitle: 'We sent a verification code to',
      codeLabel: 'Enter verification code',
      resendCode: 'Resend Code',
      resendIn: 'Resend in',
      seconds: 'seconds',
      verify: 'Verify Email',
      backToForm: 'Back to Registration',
      codeSent: 'New code sent!',
      invalidCode: 'Invalid verification code. Please try again.',
      expiredCode: 'Code expired. Please request a new one.'
    },
    ru: {
      title: 'Проверьте Вашу Почту',
      subtitle: 'Мы отправили код подтверждения на',
      codeLabel: 'Введите код подтверждения',
      resendCode: 'Отправить Повторно',
      resendIn: 'Повторная отправка через',
      seconds: 'секунд',
      verify: 'Подтвердить Email',
      backToForm: 'Назад к Регистрации',
      codeSent: 'Новый код отправлен!',
      invalidCode: 'Неверный код подтверждения. Попробуйте снова.',
      expiredCode: 'Код истек. Пожалуйста, запросите новый.'
    }
  };

  const t = translations?.[language] || translations?.en;

  // Timer for resend functionality
  useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleCodeChange = (index, value) => {
    if (value?.length > 1) return; // Prevent multiple characters
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setVerificationError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="code-${index + 1}"]`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e?.key === 'Backspace' && !verificationCode?.[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="code-${index - 1}"]`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e?.preventDefault();
    const pastedData = e?.clipboardData?.getData('text')?.replace(/\D/g, '')?.slice(0, 6);
    if (pastedData) {
      const newCode = pastedData?.split('')?.concat(new Array(6)?.fill(''))?.slice(0, 6);
      setVerificationCode(newCode);
      setVerificationError('');
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(60);
      setCanResend(false);
      setVerificationError('');
      
      // Show success message briefly
      setVerificationError(t?.codeSent);
      setTimeout(() => setVerificationError(''), 3000);
      
    } catch (error) {
      setVerificationError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const code = verificationCode?.join('');
    if (code?.length !== 6) {
      setVerificationError('Please enter the complete 6-digit code');
      return;
    }

    try {
      await onVerify?.(code);
    } catch (error) {
      setVerificationError(t?.invalidCode);
    }
  };

  const isCodeComplete = verificationCode?.every(digit => digit !== '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
        >
          <Mail className="h-8 w-8 text-primary" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t?.title}
        </h2>
        
        <p className="text-muted-foreground text-sm">
          {t?.subtitle}
        </p>
        <p className="font-medium text-foreground mt-1">
          {email}
        </p>
      </div>
      {/* Verification Code Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          {t?.codeLabel}
        </label>
        
        <div className="flex justify-center gap-2">
          {verificationCode?.map((digit, index) => (
            <motion.input
              key={index}
              name={`code-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e?.target?.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-muted rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        {verificationError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm text-center ${
              verificationError === t?.codeSent ? 'text-success' : 'text-destructive'
            }`}
          >
            {verificationError}
          </motion.p>
        )}
      </div>
      {/* Resend Code */}
      <div className="text-center">
        {canResend ? (
          <Button
            variant="ghost"
            onClick={handleResendCode}
            loading={isResending}
            iconName="RefreshCw"
            iconPosition="left"
            className="text-primary"
          >
            {t?.resendCode}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t?.resendIn} {timeLeft} {t?.seconds}
          </p>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
          className="sm:w-auto"
        >
          {t?.backToForm}
        </Button>
        
        <Button
          onClick={handleVerify}
          loading={isLoading}
          disabled={!isCodeComplete}
          fullWidth
          iconName="CheckCircle"
          iconPosition="right"
          className="font-semibold"
        >
          {t?.verify}
        </Button>
      </div>
      {/* Success Animation Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="card-glass p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-success" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {language === 'ru' ? 'Подтверждение прошло успешно!' : 'Verification Successful!'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'ru' ? 'Перенаправление...' : 'Redirecting...'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmailVerification;