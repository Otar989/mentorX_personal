import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';

const RoleSidebar = ({
  userRole = 'student',
  currentPath = '/',
  onNavigate,
  isCollapsed = false,
  isOpen = false,
  onClose,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    courses: true,
    management: false,
    tools: false
  });

  const { currentTheme } = useTheme();

  // Role-based sidebar sections
  const getSidebarSections = () => {
    const sections = {
      student: [
        {
          id: 'dashboard',
          label: 'Обзор',
          items: [
            { label: 'Дашборд', path: '/student-dashboard', icon: 'LayoutDashboard' },
            { label: 'Мой прогресс', path: '/progress', icon: 'TrendingUp' },
            { label: 'Достижения', path: '/achievements', icon: 'Award' }
          ]
        },
        {
          id: 'courses',
          label: 'Обучение',
          items: [
            { label: 'Каталог курсов', path: '/course-catalog', icon: 'BookOpen' },
            { label: 'Мои курсы', path: '/my-courses', icon: 'Book' },
            { label: 'Задания', path: '/assignment-submission', icon: 'FileText' },
            { label: 'Урок', path: '/lesson-interface', icon: 'Play' }
          ]
        },
        {
          id: 'tools',
          label: 'ИИ инструменты',
          items: [
            { label: 'Голосовой тьютор', path: '/ai-voice-tutor', icon: 'Mic' },
            { label: 'Помощник по учебе', path: '/study-assistant', icon: 'Bot' },
            { label: 'Тесты', path: '/practice-tests', icon: 'FileQuestion' }
          ]
        }
      ],
      admin: [
        {
          id: 'dashboard',
          label: 'Обзор',
          items: [
            { label: 'Админ панель', path: '/admin-panel', icon: 'LayoutDashboard' },
            { label: 'Аналитика', path: '/analytics', icon: 'BarChart3' },
            { label: 'Отчеты', path: '/reports', icon: 'FileBarChart' }
          ]
        },
        {
          id: 'management',
          label: 'Управление',
          items: [
            { label: 'Управление пользователями', path: '/user-management', icon: 'Users' },
            { label: 'Управление курсами', path: '/course-management', icon: 'BookOpen' },
            { label: 'Библиотека контента', path: '/content-library', icon: 'Library' },
            { label: 'Системные настройки', path: '/system-settings', icon: 'Settings' }
          ]
        },
        {
          id: 'courses',
          label: 'Контент',
          items: [
            { label: 'Каталог курсов', path: '/course-catalog', icon: 'Book' },
            { label: 'Конструктор уроков', path: '/lesson-builder', icon: 'PlusCircle' },
            { label: 'Инструменты оценки', path: '/assessment-tools', icon: 'CheckSquare' }
          ]
        }
      ],
      company: [
        {
          id: 'dashboard',
          label: 'Обзор',
          items: [
            { label: 'Дашборд компании', path: '/company-dashboard', icon: 'Building2' },
            { label: 'Прогресс команды', path: '/team-progress', icon: 'Users' },
            { label: 'ROI обучения', path: '/training-roi', icon: 'TrendingUp' }
          ]
        },
        {
          id: 'management',
          label: 'Управление командой',
          items: [
            { label: 'Регистрация сотрудников', path: '/employee-enrollment', icon: 'UserPlus' },
            { label: 'Пути обучения', path: '/learning-paths', icon: 'Route' },
            { label: 'Оценка навыков', path: '/skill-assessment', icon: 'Target' },
            { label: 'Отслеживание соответствия', path: '/compliance', icon: 'Shield' }
          ]
        },
        {
          id: 'courses',
          label: 'Учебный контент',
          items: [
            { label: 'Каталог курсов', path: '/course-catalog', icon: 'BookOpen' },
            { label: 'Индивидуальное обучение', path: '/custom-training', icon: 'Wrench' },
            { label: 'Программы сертификации', path: '/certifications', icon: 'Award' }
          ]
        }
      ]
    };

    return sections?.[userRole] || sections?.student;
  };

  const sidebarSections = getSidebarSections();

  const getRoleLabel = () => {
    const roleLabels = {
      student: 'Студент',
      admin: 'Администратор',
      company: 'Компания'
    };
    return roleLabels[userRole] || 'Пользователь';
  };

  const getNavigationItems = () => {
    return sidebarSections.flatMap(section => section.items);
  };

  const toggleSection = (sectionId) => {
    if (!isCollapsed) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev?.[sectionId]
      }));
    }
  };

  const handleNavigation = (path) => {
    onNavigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Auto-expand sections on desktop when not collapsed
  useEffect(() => {
    if (!isCollapsed) {
      setExpandedSections({
        dashboard: true,
        courses: true,
        management: true,
        tools: true
      });
    }
  }, [isCollapsed]);

  const sidebarClasses = `
    fixed left-0 top-header bottom-0 z-sidebar
    ${isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'}
    glass-lg border-r border-white/20
    transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    ${className}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-sidebar-collapsed-width' : 'w-sidebar-width'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full glass-panel border-r border-glass-border backdrop-blur-20 flex flex-col">
          {/* Header */}
          <div className={`p-4 border-b border-glass-border ${isCollapsed ? 'px-2' : ''}`}>
            {isCollapsed ? (
              <div className="w-10 h-10 mx-auto glass rounded-xl flex items-center justify-center">
                <Icon name="GraduationCap" size={20} className="text-primary" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    MentorX
                  </h2>
                  <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {getNavigationItems()?.map((item) => {
              const isActive = currentPath === item?.path;
              
              return (
                <button
                  key={item?.path}
                  onClick={() => {
                    onNavigate?.(item?.path);
                    onClose?.();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                    transition-all duration-300 group relative
                    ${isActive 
                      ? 'glass text-primary shadow-glass' 
                      : 'hover:glass-subtle hover:text-foreground text-muted-foreground'
                    }
                    ${isCollapsed ? 'justify-center px-2' : ''}
                  `}
                  title={isCollapsed ? item?.label : undefined}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20}
                    className={`transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-300">
                      {item?.label}
                    </span>
                  )}
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className={`absolute ${
                      isCollapsed 
                        ? 'right-1 w-1 h-6' :'right-3 w-2 h-2'
                    } bg-primary rounded-full transition-all duration-300`} />
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 glass-panel rounded-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      {item?.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className={`p-3 border-t border-glass-border ${isCollapsed ? 'px-2' : ''}`}>
            {/* User Info */}
            <div className={`flex items-center gap-3 p-3 glass rounded-xl mb-3 ${
              isCollapsed ? 'justify-center p-2' : ''
            }`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="User" size={16} className="text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">{getRoleLabel()}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className={`flex gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
              <Button
                variant="ghost"
                size="icon"
                className="glass-subtle hover:glass-hover transition-smooth"
                title="Settings"
                onClick={() => onNavigate?.('/settings')}
              >
                <Icon name="Settings" size={16} />
              </Button>
              
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass-subtle hover:glass-hover transition-smooth"
                  title="Help"
                >
                  <Icon name="HelpCircle" size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default RoleSidebar;