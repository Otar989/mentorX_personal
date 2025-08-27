import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import RoleSidebar from '../../components/ui/RoleSidebar';
import SystemMetrics from './components/SystemMetrics';
import UserManagement from './components/UserManagement';
import CourseManagement from './components/CourseManagement';
import PaymentManagement from './components/PaymentManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SystemConfiguration from './components/SystemConfiguration';
import AICourseGenerator from './components/AICourseGenerator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';


const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');

  const adminSections = [
    {
      id: 'overview',
      label: 'System Overview',
      icon: 'LayoutDashboard',
      component: SystemMetrics
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      component: UserManagement
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: 'BookOpen',
      component: CourseManagement
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      component: AnalyticsDashboard
    },
    {
      id: 'payments',
      label: 'Payment Management',
      icon: 'CreditCard',
      component: PaymentManagement
    },
    {
      id: 'settings',
      label: 'System Configuration',
      icon: 'Settings',
      component: SystemConfiguration
    }
  ];

  const tabs = [
    { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
    { id: 'courses', label: 'Курсы', icon: 'BookOpen' },
    { id: 'ai-generator', label: 'AI Генератор', icon: 'Wand2' },
    { id: 'payments', label: 'Платежи', icon: 'CreditCard' },
    { id: 'system', label: 'Система', icon: 'Settings' },
    { id: 'metrics', label: 'Метрики', icon: 'Activity' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const renderActiveSection = () => {
    const section = adminSections?.find(s => s?.id === activeSection);
    if (!section) return null;

    const Component = section?.component;
    return <Component />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'ai-generator':
        return <AICourseGenerator />;
      case 'payments':
        return <PaymentManagement />;
      case 'system':
        return <SystemConfiguration />;
      case 'metrics':
        return <SystemMetrics />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation Header */}
      <AdaptiveNavbar
        userRole="admin"
        currentPath="/admin-panel"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      
      {/* Sidebar */}
      <RoleSidebar
        userRole="admin"
        currentPath="/admin-panel"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className={`pt-header transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-sidebar-collapsed-width' : 'lg:ml-sidebar-width'
      }`}>
        <div className="p-6">
          {/* Admin Panel Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-muted-foreground">
                    Comprehensive platform management and analytics
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button
                  variant="default"
                  className="glass-subtle hover:glass-hover hidden sm:flex"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Quick Action
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card-glass hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">15,847</p>
                    <p className="text-xs text-success">+12% vs last month</p>
                  </div>
                </div>
              </div>
              
              <div className="card-glass hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <Icon name="BookOpen" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-success">+8% vs last month</p>
                  </div>
                </div>
              </div>
              
              <div className="card-glass hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                    <p className="text-2xl font-bold">₽485,600</p>
                    <p className="text-xs text-success">+15% vs last month</p>
                  </div>
                </div>
              </div>
              
              <div className="card-glass hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <Icon name="Activity" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">System Health</p>
                    <p className="text-2xl font-bold">98.5%</p>
                    <p className="text-xs text-success">Excellent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="card-glass p-3">
              <div className="flex flex-wrap gap-2">
                {adminSections?.map((section) => (
                  <Button
                    key={section?.id}
                    variant={activeSection === section?.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSection(section?.id)}
                    iconName={section?.icon}
                    iconPosition="left"
                    iconSize={16}
                    className={`gap-2 transition-smooth ${
                      activeSection === section?.id 
                        ? 'glass shadow-glass text-primary' 
                        : 'hover:glass-subtle'
                    }`}
                  >
                    {section?.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Section Content */}
          <div className="space-y-6">
            <div className="card-glass-lg floating-glass">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Menu Button */}
      <Button
        variant="default"
        size="icon"
        onClick={handleMobileSidebarToggle}
        className="fixed bottom-6 right-6 lg:hidden z-40 glass rounded-full shadow-glass-lg hover-lift"
      >
        <Icon name="Menu" size={20} />
      </Button>
    </div>
  );
};

export default AdminPanel;