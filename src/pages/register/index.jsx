import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import EmailVerification from './components/EmailVerification';
import ProgressIndicator from './components/ProgressIndicator';
import LanguageToggle from '../login/components/LanguageToggle';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    accountType: '',
    invitationCode: '',
    agreedToTerms: false,
    agreedToPrivacy: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Localization object
  const translations = {
    en: {
      title: 'Create Your Account',
      subtitle: 'Join thousands of learners transforming their careers',
      step1Title: 'Account Information',
      step2Title: 'Email Verification',
      backToLogin: 'Already have an account?',
      loginLink: 'Sign in',
      success: 'Registration successful!',
      redirecting: 'Redirecting to your dashboard...'
    },
    ru: {
      title: 'Создать Аккаунт',
      subtitle: 'Присоединяйтесь к тысячам учащихся, меняющих свою карьеру',
      step1Title: 'Информация об Аккаунте',
      step2Title: 'Подтверждение Email',
      backToLogin: 'Уже есть аккаунт?',
      loginLink: 'Войти',
      success: 'Регистрация успешна!',
      redirecting: 'Перенаправление в панель управления...'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setFormData(prev => ({ ...prev, ...data }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(2);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (verificationCode) => {
    setIsLoading(true);
    
    try {
      // Simulate email verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message and redirect
      setTimeout(() => {
        const redirectPath = formData?.accountType === 'corporate' ?'/corporate-dashboard' :'/student-dashboard';
        navigate(redirectPath);
      }, 1500);
      
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>Register - EduPlatform</title>
        <meta name="description" content="Create your account and start your learning journey with EduPlatform" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex flex-col">
        {/* Navigation Header */}
        <motion.nav 
          className="flex items-center justify-between p-4 md:p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <Trophy className="h-8 w-8" />
            EduPlatform
          </Link>
          
          <LanguageToggle 
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </motion.nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Progress Indicator */}
            <motion.div variants={itemVariants}>
              <ProgressIndicator 
                currentStep={currentStep}
                totalSteps={2}
                language={currentLanguage}
              />
            </motion.div>

            {/* Glass Card Container */}
            <motion.div 
              className="card-glass-lg mt-6"
              variants={itemVariants}
            >
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                variants={itemVariants}
              >
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {t?.title}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {t?.subtitle}
                </p>
              </motion.div>

              {/* Step Content */}
              <motion.div variants={itemVariants}>
                {currentStep === 1 ? (
                  <RegistrationForm
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    language={currentLanguage}
                  />
                ) : (
                  <EmailVerification
                    email={formData?.email}
                    onVerify={handleEmailVerification}
                    onBack={() => setCurrentStep(1)}
                    isLoading={isLoading}
                    language={currentLanguage}
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Footer Links */}
            <motion.div 
              className="text-center mt-6"
              variants={itemVariants}
            >
              <p className="text-sm text-muted-foreground">
                {t?.backToLogin}{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  {t?.loginLink}
                </Link>
              </p>
            </motion.div>

            {/* Social Registration Options */}
            <motion.div 
              className="mt-6 space-y-3"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground">
                    {currentLanguage === 'ru' ? 'Или продолжить с' : 'Or continue with'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  className="glass rounded-lg p-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/90 transition-smooth"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </motion.button>

                <motion.button
                  className="glass rounded-lg p-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/90 transition-smooth"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;