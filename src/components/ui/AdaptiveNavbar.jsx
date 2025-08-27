import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

const AdaptiveNavbar = ({ 
  userRole = 'student', 
  currentPath = '/', 
  onNavigate,
  isCollapsed = false,
  onToggleSidebar
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentTheme } = useTheme();

  // Helper functions for user data
  const getUserName = () => {
    const userNames = {
      student: 'Student User',
      admin: 'Admin User',
      company: 'Company User'
    };
    return userNames[userRole] || 'User';
  };

  const getRoleLabel = () => {
    const roleLabels = {
      student: 'Student',
      admin: 'Administrator',
      company: 'Company'
    };
    return roleLabels[userRole] || 'User';
  };

  const getUserMenuItems = () => {
    const baseMenuItems = [
      { label: 'Profile', path: '/profile', icon: 'User', roles: ['student', 'admin', 'company'] },
      { label: 'Settings', path: '/settings', icon: 'Settings', roles: ['student', 'admin', 'company'] },
      { label: 'Help', path: '/help', icon: 'HelpCircle', roles: ['student', 'admin', 'company'] },
      { label: 'Logout', path: '/logout', icon: 'LogOut', roles: ['student', 'admin', 'company'] }
    ];

    return baseMenuItems.filter(item => item.roles.includes(userRole));
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Dashboard', path: '/student-dashboard', icon: 'LayoutDashboard', roles: ['student', 'admin', 'company'] },
      { label: 'Courses', path: '/course-catalog', icon: 'BookOpen', roles: ['student', 'admin', 'company'] },
      { label: 'Learning Tools', path: '/ai-voice-tutor', icon: 'Mic', roles: ['student'] },
      { label: 'Management', path: '/admin-panel', icon: 'Settings', roles: ['admin'] },
      { label: 'Company', path: '/company-dashboard', icon: 'Building2', roles: ['company'] }
    ];

    return baseItems?.filter(item => item?.roles?.includes(userRole));
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 150);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
      if (!event?.target?.closest('.search-container')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isCollapsed ? 'lg:pl-sidebar-collapsed-width' : 'lg:pl-sidebar-width'
    }`}>
      <div className="glass-panel border-b border-glass-border backdrop-blur-20">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="lg:hidden glass-subtle hover:glass-hover"
              >
                <Icon name="Menu" size={20} />
              </Button>

              {/* Desktop Sidebar Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="hidden lg:flex glass-subtle hover:glass-hover transition-smooth"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Icon 
                  name={isCollapsed ? "PanelLeftOpen" : "PanelLeft"} 
                  size={18}
                  className="transition-transform duration-300"
                />
              </Button>

              {/* Logo/Brand */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={18} className="text-primary" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MentorX
                </span>
              </div>
            </div>

            {/* Center Section - Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {getNavigationItems()?.slice(0, 4)?.map((item) => (
                <Button
                  key={item?.path}
                  variant={currentPath === item?.path ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate?.(item?.path)}
                  className={`gap-2 transition-smooth ${
                    currentPath === item?.path 
                      ? 'glass text-primary shadow-glass' 
                      : 'hover:glass-subtle'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  {item?.label}
                </Button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle className="hidden sm:flex" />

              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass-subtle hover:glass-hover transition-smooth"
                  title="Search"
                >
                  <Icon name="Search" size={18} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass-subtle hover:glass-hover transition-smooth relative"
                  title="Notifications"
                >
                  <Icon name="Bell" size={18} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                </Button>
              </div>

              {/* User Profile */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 pl-2 pr-3 py-2 glass-subtle hover:glass-hover transition-smooth"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="User" size={16} className="text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{getUserName()}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                  </div>
                  <Icon name="ChevronDown" size={14} className="hidden sm:block" />
                </Button>

                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-2 glass-panel rounded-xl shadow-glass-lg border border-glass-border backdrop-blur-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
                  <div className="p-3 border-b border-glass-border">
                    <p className="font-medium">{getUserName()}</p>
                    <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
                  </div>
                  
                  {getUserMenuItems()?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => onNavigate?.(item?.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 hover:bg-glass-hover first:rounded-t-none last:rounded-b-xl"
                    >
                      <Icon name={item?.icon} size={16} />
                      {item?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdaptiveNavbar;