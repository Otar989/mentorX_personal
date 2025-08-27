import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';

const ErrorPageComponent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState('ru');
  const [countdown, setCountdown] = useState(10);
  const [recentPages] = useState([
    { title: 'Dashboard', path: '/student-dashboard', desc: 'Return to your learning dashboard' },
    { title: 'Course Catalog', path: '/course-catalog', desc: 'Browse available courses' },
    { title: 'AI Voice Tutor', path: '/ai-voice-tutor', desc: 'Practice with AI tutor' },
  ]);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/student-dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const content = {
    ru: {
      title: 'Страница не найдена',
      subtitle: 'Упс! Кажется, вы забрели не туда',
      description: 'Страница, которую вы ищете, была перемещена, удалена или возможно никогда не существовала.',
      searchPlaceholder: 'Поиск по платформе...',
      dashboardBtn: 'Перейти в Dashboard',
      browseCourses: 'Просмотр курсов',
      contactSupport: 'Связаться с поддержкой',
      recentTitle: 'Рекомендуемые страницы',
      redirectText: `Автоматическое перенаправление через ${countdown} сек`,
      breadcrumb: 'Несуществующая страница'
    },
    en: {
      title: 'Page Not Found',
      subtitle: 'Oops! Looks like you went off the beaten path',
      description: 'The page you are looking for was moved, deleted, or may have never existed.',
      searchPlaceholder: 'Search platform...',
      dashboardBtn: 'Go to Dashboard',
      browseCourses: 'Browse Courses',
      contactSupport: 'Contact Support',
      recentTitle: 'Suggested Pages',
      redirectText: `Auto-redirecting in ${countdown}s`,
      breadcrumb: 'Non-existent page'
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/course-catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'ru' ? 'en' : 'ru');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
            <Icon name="GraduationCap" size={20} className="text-primary" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MentorX
          </span>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="glass-subtle hover:glass-hover transition-smooth"
          >
            {currentLang?.toUpperCase()}
          </Button>
        </div>
      </div>
      {/* Breadcrumb */}
      <div className="px-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Icon name="Home" size={16} />
          <Icon name="ChevronRight" size={14} />
          <span>{content?.[currentLang]?.breadcrumb}</span>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent opacity-50">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-primary/30 rounded-full border-t-primary"
                />
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-onBackground mb-4">
              {content?.[currentLang]?.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              {content?.[currentLang]?.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {content?.[currentLang]?.description}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={content?.[currentLang]?.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pl-12 glass-panel border-glass-border backdrop-blur-20 rounded-2xl h-12"
                />
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </form>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => handleNavigation('/student-dashboard')}
              className="glass text-white rounded-2xl px-6 py-3 shadow-glass-lg"
            >
              <Icon name="LayoutDashboard" size={18} className="mr-2" />
              {content?.[currentLang]?.dashboardBtn}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNavigation('/course-catalog')}
              className="glass-subtle hover:glass-hover rounded-2xl px-6 py-3 border-glass-border"
            >
              <Icon name="BookOpen" size={18} className="mr-2" />
              {content?.[currentLang]?.browseCourses}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => handleNavigation('/settings')}
              className="glass-subtle hover:glass-hover rounded-2xl px-6 py-3"
            >
              <Icon name="HelpCircle" size={18} className="mr-2" />
              {content?.[currentLang]?.contactSupport}
            </Button>
          </motion.div>

          {/* Auto Redirect Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <p className="text-sm text-muted-foreground">
              {content?.[currentLang]?.redirectText}
            </p>
          </motion.div>
        </div>
      </div>
      {/* Recent/Suggested Pages */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="px-6 pb-8"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-onBackground mb-6 text-center">
            {content?.[currentLang]?.recentTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPages?.map((page, index) => (
              <motion.div
                key={page?.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                onClick={() => handleNavigation(page?.path)}
                className="glass-panel rounded-2xl p-6 border border-glass-border backdrop-blur-20 hover:glass-hover cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 glass-subtle rounded-xl flex items-center justify-center group-hover:glass-hover transition-all">
                    <Icon name="ExternalLink" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-onBackground mb-1">{page?.title}</h4>
                    <p className="text-sm text-muted-foreground">{page?.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPageComponent;