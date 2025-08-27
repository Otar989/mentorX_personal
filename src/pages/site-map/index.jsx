import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';

const SiteMapComponent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState('ru');
  const [expandedSections, setExpandedSections] = useState({
    authentication: true,
    learning: true,
    tools: true,
    administration: true
  });

  // Site structure data
  const siteStructure = {
    authentication: {
      title: { ru: 'Аутентификация', en: 'Authentication' },
      icon: 'UserCheck',
      pages: [
        { title: 'Login', path: '/login', desc: 'User authentication', status: 'active' },
        { title: 'Register', path: '/register', desc: 'New user registration', status: 'active' },
        { title: 'Password Reset', path: '/password-reset', desc: 'Reset forgotten password', status: 'maintenance' },
      ]
    },
    learning: {
      title: { ru: 'Обучение', en: 'Learning' },
      icon: 'BookOpen',
      pages: [
        { title: 'Student Dashboard', path: '/student-dashboard', desc: 'Student learning hub', status: 'active' },
        { title: 'Course Catalog', path: '/course-catalog', desc: 'Browse all courses', status: 'active' },
        { title: 'Course Detail', path: '/course-detail', desc: 'Individual course information', status: 'active' },
        { title: 'Lesson Interface', path: '/lesson-interface', desc: 'Interactive lesson player', status: 'active' },
        { title: 'Assignment Submission', path: '/assignment-submission', desc: 'Submit coursework', status: 'active' },
      ]
    },
    tools: {
      title: { ru: 'Инструменты', en: 'Tools' },
      icon: 'Wrench',
      pages: [
        { title: 'AI Voice Tutor', path: '/ai-voice-tutor', desc: 'Practice with AI assistant', status: 'active' },
        { title: 'Settings', path: '/settings', desc: 'User preferences', status: 'active' },
        { title: 'Profile', path: '/profile', desc: 'User profile management', status: 'restricted' },
        { title: 'Help', path: '/help', desc: 'Support and documentation', status: 'restricted' },
      ]
    },
    administration: {
      title: { ru: 'Администрирование', en: 'Administration' },
      icon: 'Shield',
      pages: [
        { title: 'Admin Panel', path: '/admin-panel', desc: 'System administration', status: 'restricted' },
        { title: 'Company Dashboard', path: '/company-dashboard', desc: 'Company management', status: 'restricted' },
      ]
    }
  };

  const quickAccess = [
    { title: 'Dashboard', path: '/student-dashboard', icon: 'LayoutDashboard' },
    { title: 'Courses', path: '/course-catalog', icon: 'BookOpen' },
    { title: 'AI Tutor', path: '/ai-voice-tutor', icon: 'Mic' },
    { title: 'Settings', path: '/settings', icon: 'Settings' },
  ];

  // Filter pages based on search
  const filteredStructure = useMemo(() => {
    if (!searchQuery?.trim()) return siteStructure;

    const filtered = {};
    Object.keys(siteStructure)?.forEach(sectionKey => {
      const section = siteStructure?.[sectionKey];
      const filteredPages = section?.pages?.filter(page =>
        page?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        page?.desc?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      
      if (filteredPages?.length > 0) {
        filtered[sectionKey] = {
          ...section,
          pages: filteredPages
        };
      }
    });
    
    return filtered;
  }, [searchQuery]);

  const content = {
    ru: {
      title: 'Карта сайта',
      subtitle: 'Полная структура платформы MentorX',
      description: 'Найдите любую страницу или функциональность на нашей платформе обучения',
      searchPlaceholder: 'Поиск страниц...',
      quickAccess: 'Быстрый доступ',
      allPages: 'Все страницы',
      breadcrumb: 'Карта сайта',
      statusActive: 'Активно',
      statusMaintenance: 'Обслуживание',
      statusRestricted: 'Ограничен доступ'
    },
    en: {
      title: 'Site Map',
      subtitle: 'Complete MentorX platform structure',
      description: 'Find any page or functionality on our learning platform',
      searchPlaceholder: 'Search pages...',
      quickAccess: 'Quick Access',
      allPages: 'All Pages',
      breadcrumb: 'Site Map',
      statusActive: 'Active',
      statusMaintenance: 'Maintenance',
      statusRestricted: 'Restricted Access'
    }
  };

  const statusColors = {
    active: 'text-success bg-success/10',
    maintenance: 'text-warning bg-warning/10',
    restricted: 'text-error bg-error/10'
  };

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'ru' ? 'en' : 'ru');
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev?.[sectionKey]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-panel border-b border-glass-border backdrop-blur-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="glass-subtle hover:glass-hover"
              >
                <Icon name="ArrowLeft" size={18} />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} className="text-primary" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MentorX
                </span>
              </div>
            </div>

            {/* Header Controls */}
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
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Icon name="Home" size={16} />
          <Icon name="ChevronRight" size={14} />
          <span>{content?.[currentLang]?.breadcrumb}</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-onBackground mb-4">
            {content?.[currentLang]?.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {content?.[currentLang]?.subtitle}
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {content?.[currentLang]?.description}
          </p>
          
          {/* Site URL Info */}
          <div className="mt-6 glass-panel border border-glass-border backdrop-blur-20 rounded-2xl p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <Icon name="Globe" size={18} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                {currentLang === 'ru' ? 'Ссылка на сайт:' : 'Site URL:'}
              </span>
              <a 
                href="https://mentorx9283back.builtwithrocket.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                mentorx9283back.builtwithrocket.new
              </a>
              <Icon name="ExternalLink" size={14} className="text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder={content?.[currentLang]?.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e?.target?.value)}
              className="pl-12 glass-panel border-glass-border backdrop-blur-20 rounded-2xl h-14 text-lg"
            />
            <Icon
              name="Search"
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-onBackground mb-6">
            {content?.[currentLang]?.quickAccess}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickAccess?.map((item, index) => (
              <motion.div
                key={item?.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <Button
                  variant="outline"
                  onClick={() => handleNavigation(item?.path)}
                  className="w-full glass-panel border-glass-border backdrop-blur-20 rounded-2xl p-6 h-auto flex-col gap-3 hover:glass-hover transition-all duration-300"
                >
                  <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center">
                    <Icon name={item?.icon} size={24} className="text-primary" />
                  </div>
                  <span className="font-medium">{item?.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-onBackground mb-6">
            {content?.[currentLang]?.allPages}
          </h2>

          <div className="space-y-6">
            {Object.keys(filteredStructure)?.map((sectionKey, sectionIndex) => {
              const section = filteredStructure?.[sectionKey];
              const isExpanded = expandedSections?.[sectionKey];

              return (
                <motion.div
                  key={sectionKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + sectionIndex * 0.1 }}
                  className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between p-6 hover:glass-hover transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center">
                        <Icon name={section?.icon} size={20} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-onBackground">
                          {section?.title?.[currentLang]}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {section?.pages?.length} pages
                        </p>
                      </div>
                    </div>
                    <Icon 
                      name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                      size={20} 
                      className="text-muted-foreground transition-transform duration-200"
                    />
                  </button>
                  {/* Section Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-glass-border"
                    >
                      <div className="p-6 space-y-3">
                        {section?.pages?.map((page, pageIndex) => (
                          <motion.div
                            key={page?.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: pageIndex * 0.05 }}
                            onClick={() => handleNavigation(page?.path)}
                            className="flex items-center justify-between p-4 glass-subtle rounded-xl hover:glass-hover cursor-pointer transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Icon 
                                name="ExternalLink" 
                                size={16} 
                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" 
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-onBackground">{page?.title}</h4>
                                <p className="text-sm text-muted-foreground">{page?.desc}</p>
                                <p className="text-xs text-muted-foreground mt-1">{page?.path}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors?.[page?.status]}`}>
                              {content?.[currentLang]?.[`status${page?.status?.charAt(0)?.toUpperCase() + page?.status?.slice(1)}`]}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12 pt-8 border-t border-glass-border"
        >
          <p className="text-sm text-muted-foreground">
            © 2025 MentorX Platform - AI-Powered Learning Experience
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SiteMapComponent;