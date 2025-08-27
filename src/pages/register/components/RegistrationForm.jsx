import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, Building, Users, GraduationCap } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import TermsModal from './TermsModal';

const RegistrationForm = ({ onSubmit, isLoading, language = 'en' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      accountType: '',
      invitationCode: '',
      agreedToTerms: false,
      agreedToPrivacy: false
    }
  });

  const watchedPassword = watch('password');
  const watchedAccountType = watch('accountType');
  const watchedTerms = watch('agreedToTerms');
  const watchedPrivacy = watch('agreedToPrivacy');

  // Localization
  const translations = {
    en: {
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email Address',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Create a secure password',
      accountType: 'Account Type',
      individualStudent: 'Individual Student',
      individualDesc: 'Personal learning journey',
      corporateEmployee: 'Corporate Employee',
      corporateDesc: 'Company-sponsored learning',
      invitationCode: 'Invitation Code',
      invitationPlaceholder: 'Enter your company code',
      terms: 'I agree to the Terms of Service',
      privacy: 'I agree to the Privacy Policy',
      createAccount: 'Create Account',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      passwordMin: 'Password must be at least 8 characters',
      codeRequired: 'Invitation code is required for corporate accounts'
    },
    ru: {
      fullName: 'Полное Имя',
      fullNamePlaceholder: 'Введите ваше полное имя',
      email: 'Адрес Электронной Почты',
      emailPlaceholder: 'Введите ваш email',
      password: 'Пароль',
      passwordPlaceholder: 'Создайте безопасный пароль',
      accountType: 'Тип Аккаунта',
      individualStudent: 'Индивидуальный Студент',
      individualDesc: 'Персональное обучение',
      corporateEmployee: 'Корпоративный Сотрудник',
      corporateDesc: 'Обучение от компании',
      invitationCode: 'Код Приглашения',
      invitationPlaceholder: 'Введите код компании',
      terms: 'Я согласен с Условиями Обслуживания',
      privacy: 'Я согласен с Политикой Конфиденциальности',
      createAccount: 'Создать Аккаунт',
      required: 'Это поле обязательно',
      invalidEmail: 'Введите действительный email',
      passwordMin: 'Пароль должен содержать минимум 8 символов',
      codeRequired: 'Код приглашения обязателен для корпоративных аккаунтов'
    }
  };

  const t = translations?.[language] || translations?.en;

  const handleFormSubmit = (data) => {
    if (data?.accountType === 'corporate' && !data?.invitationCode) {
      return;
    }
    onSubmit?.(data);
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setValue('accountType', type, { shouldValidate: true });
    if (type !== 'corporate') {
      setValue('invitationCode', '');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit(handleFormSubmit)}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Full Name Field */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              {...register('fullName', { 
                required: t?.required 
              })}
              type="text"
              placeholder={t?.fullNamePlaceholder}
              className="pl-10"
              error={errors?.fullName?.message}
            />
          </div>
        </motion.div>

        {/* Email Field */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              {...register('email', { 
                required: t?.required,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t?.invalidEmail
                }
              })}
              type="email"
              placeholder={t?.emailPlaceholder}
              className="pl-10"
              error={errors?.email?.message}
            />
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
              {...register('password', { 
                required: t?.required,
                minLength: {
                  value: 8,
                  message: t?.passwordMin
                }
              })}
              type={showPassword ? 'text' : 'password'}
              placeholder={t?.passwordPlaceholder}
              className="pl-10 pr-10"
              error={errors?.password?.message}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {watchedPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <PasswordStrengthIndicator 
                password={watchedPassword} 
                language={language}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Account Type Selection */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-foreground mb-3">
            {t?.accountType} *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Individual Student */}
            <motion.button
              type="button"
              onClick={() => handleAccountTypeChange('individual')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                watchedAccountType === 'individual' ?'border-primary bg-primary/10' :'border-muted hover:border-primary/50 bg-background'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className={`h-5 w-5 ${
                  watchedAccountType === 'individual' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div>
                  <div className={`font-medium ${
                    watchedAccountType === 'individual' ? 'text-primary' : 'text-foreground'
                  }`}>
                    {t?.individualStudent}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t?.individualDesc}
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Corporate Employee */}
            <motion.button
              type="button"
              onClick={() => handleAccountTypeChange('corporate')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                watchedAccountType === 'corporate' ?'border-primary bg-primary/10' :'border-muted hover:border-primary/50 bg-background'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Building className={`h-5 w-5 ${
                  watchedAccountType === 'corporate' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div>
                  <div className={`font-medium ${
                    watchedAccountType === 'corporate' ? 'text-primary' : 'text-foreground'
                  }`}>
                    {t?.corporateEmployee}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t?.corporateDesc}
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
          {errors?.accountType && (
            <p className="text-sm text-destructive mt-1">
              {errors?.accountType?.message}
            </p>
          )}
        </motion.div>

        {/* Corporate Invitation Code */}
        <AnimatePresence>
          {watchedAccountType === 'corporate' && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  {...register('invitationCode', { 
                    required: watchedAccountType === 'corporate' ? t?.codeRequired : false
                  })}
                  type="text"
                  placeholder={t?.invitationPlaceholder}
                  className="pl-10"
                  error={errors?.invitationCode?.message}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terms and Privacy Checkboxes */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-start gap-3">
            <Input
              {...register('agreedToTerms', { 
                required: t?.required 
              })}
              type="checkbox"
              className="mt-1"
            />
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-primary hover:underline"
              >
                {t?.terms}
              </button>
              {errors?.agreedToTerms && (
                <p className="text-destructive mt-1">
                  {errors?.agreedToTerms?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Input
              {...register('agreedToPrivacy', { 
                required: t?.required 
              })}
              type="checkbox"
              className="mt-1"
            />
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-primary hover:underline"
              >
                {t?.privacy}
              </button>
              {errors?.agreedToPrivacy && (
                <p className="text-destructive mt-1">
                  {errors?.agreedToPrivacy?.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            disabled={!isValid || !watchedTerms || !watchedPrivacy}
            className="font-semibold"
          >
            {t?.createAccount}
          </Button>
        </motion.div>
      </motion.form>
      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms"
        language={language}
      />
      {/* Privacy Modal */}
      <TermsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        type="privacy"
        language={language}
      />
    </>
  );
};

export default RegistrationForm;