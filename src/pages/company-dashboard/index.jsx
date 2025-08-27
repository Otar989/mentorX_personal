import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OverviewCards from './components/OverviewCards';
import EmployeeManagementTable from './components/EmployeeManagementTable';
import LicenseManagementPanel from './components/LicenseManagementPanel';
import ProgressReportingSection from './components/ProgressReportingSection';
import BulkOperationsInterface from './components/BulkOperationsInterface';
import PaymentHistoryPanel from './components/PaymentHistoryPanel';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'employees', label: 'Employee Management', icon: 'Users' },
    { id: 'licenses', label: 'License Management', icon: 'Shield' },
    { id: 'progress', label: 'Progress Analytics', icon: 'BarChart3' },
    { id: 'bulk', label: 'Bulk Operations', icon: 'Upload' },
    { id: 'billing', label: 'Billing & Payments', icon: 'CreditCard' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleBulkAction = (action, data) => {
    console.log('Bulk action:', action, data);
    // Handle bulk operations like CSV upload, email sending, etc.
  };

  const handleLicenseManagement = (action, data) => {
    console.log('License management:', action, data);
    // Handle license operations like upgrade, renewal, etc.
  };

  const handleExportReport = (type, data) => {
    console.log('Export report:', type, data);
    // Handle report generation and export
  };

  const handlePaymentManagement = (action, data) => {
    console.log('Payment management:', action, data);
    // Handle payment operations like billing settings, invoice downloads, etc.
  };

  const handleBulkOperation = (operationData) => {
    console.log('Bulk operation executed:', operationData);
    // Process bulk operations
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
            >
              <Icon name="Menu" size={20} />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Company Dashboard</h1>
                <p className="text-sm text-muted-foreground">ООО "ТехИнновации"</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              iconName="HelpCircle"
              iconPosition="left"
              iconSize={16}
              onClick={() => handleNavigation('/help')}
            >
              Help
            </Button>
            <Button
              variant="outline"
              iconName="Settings"
              iconPosition="left"
              iconSize={16}
              onClick={() => handleNavigation('/settings')}
            >
              Settings
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center cursor-pointer">
              <Icon name="User" size={16} color="white" />
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar */}
        <aside className={`glass border-r border-white/10 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} hidden lg:block`}>
          <nav className="p-4 space-y-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? tab?.label : undefined}
              >
                <Icon name={tab?.icon} size={20} />
                {!sidebarCollapsed && <span>{tab?.label}</span>}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-white/10 mt-auto">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="UserPlus"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                  onClick={() => handleBulkAction('invite')}
                >
                  Invite Employee
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="BookOpen"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                  onClick={() => handleNavigation('/course-catalog')}
                >
                  Browse Courses
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-40">
          <div className="flex overflow-x-auto">
            {tabs?.slice(0, 5)?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-1 min-w-0 flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-smooth ${
                  activeTab === tab?.id
                    ? 'text-primary' :'text-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={20} />
                <span className="truncate">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-20 lg:pb-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Company Overview</h2>
                  <p className="text-muted-foreground">
                    Monitor your team's learning progress and platform usage
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    iconName="Download"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => handleExportReport('overview')}
                  >
                    Export Report
                  </Button>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setActiveTab('employees')}
                  >
                    Add Employees
                  </Button>
                </div>
              </div>

              <OverviewCards />

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { user: 'Александр Петров', action: 'completed React Fundamentals', time: '2 hours ago', icon: 'CheckCircle', color: 'text-success' },
                      { user: 'Мария Иванова', action: 'started TypeScript Basics', time: '4 hours ago', icon: 'Play', color: 'text-primary' },
                      { user: 'Дмитрий Сидоров', action: 'submitted assignment', time: '6 hours ago', icon: 'FileText', color: 'text-accent' },
                      { user: 'Елена Козлова', action: 'earned certificate', time: '1 day ago', icon: 'Award', color: 'text-secondary' }
                    ]?.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Icon name={activity?.icon} size={16} className={activity?.color} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{activity?.user}</span> {activity?.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity?.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Courses</h3>
                  <div className="space-y-3">
                    {[
                      { course: 'React Fundamentals', completion: 92, enrolled: 45 },
                      { course: 'JavaScript Advanced', completion: 87, enrolled: 38 },
                      { course: 'TypeScript Basics', completion: 78, enrolled: 32 },
                      { course: 'Node.js Backend', completion: 65, enrolled: 28 }
                    ]?.map((course, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{course?.course}</span>
                          <span className="text-xs text-muted-foreground">{course?.enrolled} enrolled</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="progress-ambient h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course?.completion}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{course?.completion}% completion rate</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee Management Tab */}
          {activeTab === 'employees' && (
            <EmployeeManagementTable onBulkAction={handleBulkAction} />
          )}

          {/* License Management Tab */}
          {activeTab === 'licenses' && (
            <LicenseManagementPanel onManageLicenses={handleLicenseManagement} />
          )}

          {/* Progress Analytics Tab */}
          {activeTab === 'progress' && (
            <ProgressReportingSection onExportReport={handleExportReport} />
          )}

          {/* Bulk Operations Tab */}
          {activeTab === 'bulk' && (
            <BulkOperationsInterface onBulkOperation={handleBulkOperation} />
          )}

          {/* Billing & Payments Tab */}
          {activeTab === 'billing' && (
            <PaymentHistoryPanel onManagePayment={handlePaymentManagement} />
          )}
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;