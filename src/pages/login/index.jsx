import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import LanguageToggle from './components/LanguageToggle';
import LoginBackground from './components/LoginBackground';

const Login = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && ['en', 'ru']?.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic
      const mockCredentials = {
        'student@mentorx.ru': { role: 'student', dashboard: '/student-dashboard' },
        'admin@mentorx.ru': { role: 'admin', dashboard: '/admin-panel' },
        'company@mentorx.ru': { role: 'company', dashboard: '/company-dashboard' }
      };

      const userInfo = mockCredentials?.[formData?.email];
      
      if (userInfo) {
        // Store user session
        localStorage.setItem('user-session', JSON.stringify({
          email: formData?.email,
          role: userInfo?.role,
          loginTime: new Date()?.toISOString(),
          rememberMe: formData?.rememberMe
        }));

        // Navigate to appropriate dashboard
        navigate(userInfo?.dashboard, { replace: true });
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    en: {
      platformName: 'MentorX',
      tagline: 'AI-Powered Learning Platform'
    },
    ru: {
      platformName: 'MentorX',
      tagline: 'Платформа обучения с ИИ'
    }
  };

  const t = translations?.[currentLanguage] || translations?.en;

  return (
    <div className="min-h-screen bg-background relative">
      <LoginBackground />
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/course-catalog')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Icon name="GraduationCap" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t?.platformName}
            </h1>
            <p className="text-xs text-muted-foreground">{t?.tagline}</p>
          </div>
        </motion.div>

        {/* Language Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <LanguageToggle
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </motion.div>
      </header>
      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block space-y-8"
            >
              <div className="space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-foreground leading-tight"
                >
                  {currentLanguage === 'ru' ?'Изучайте новые навыки с помощью ИИ' :'Learn New Skills with AI Assistance'
                  }
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-muted-foreground"
                >
                  {currentLanguage === 'ru' ?'Персонализированное обучение с голосовым ИИ-наставником, автоматической проверкой заданий и корпоративными решениями.' :'Personalized learning with voice AI tutoring, automated assignment checking, and corporate training solutions.'
                  }
                </motion.p>
              </div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {[
                  {
                    icon: 'Mic',
                    title: currentLanguage === 'ru' ? 'Голосовой ИИ-наставник' : 'Voice AI Tutor',
                    description: currentLanguage === 'ru' ?'Интерактивные голосовые сессии с ИИ' :'Interactive voice sessions with AI'
                  },
                  {
                    icon: 'CheckSquare',
                    title: currentLanguage === 'ru' ? 'Автоматическая проверка' : 'Automated Checking',
                    description: currentLanguage === 'ru' ?'Мгновенная обратная связь по заданиям' :'Instant feedback on assignments'
                  },
                  {
                    icon: 'Building2',
                    title: currentLanguage === 'ru' ? 'Корпоративные решения' : 'Corporate Solutions',
                    description: currentLanguage === 'ru' ?'Масштабируемые решения для команд' :'Scalable solutions for teams'
                  }
                ]?.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon name={feature?.icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{feature?.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature?.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Trust Signals */}
              <TrustSignals language={currentLanguage} />
            </motion.div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col items-center">
              <LoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={loginError}
                language={currentLanguage}
                className="w-full"
              />

              {/* Mobile Trust Signals */}
              <div className="lg:hidden mt-8 w-full">
                <TrustSignals language={currentLanguage} />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <button className="hover:text-foreground transition-smooth">
            {currentLanguage === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
          </button>
          <span>•</span>
          <button className="hover:text-foreground transition-smooth">
            {currentLanguage === 'ru' ? 'Условия использования' : 'Terms of Service'}
          </button>
          <span>•</span>
          <button className="hover:text-foreground transition-smooth">
            {currentLanguage === 'ru' ? 'Поддержка' : 'Support'}
          </button>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          © {new Date()?.getFullYear()} MentorX. {currentLanguage === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
        </motion.p>
      </footer>
    </div>
  );
};

export default Login;