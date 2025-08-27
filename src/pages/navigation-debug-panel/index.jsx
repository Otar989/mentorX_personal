import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';

const NavigationDebugPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [testResults, setTestResults] = useState({});

  // Mock routing health data
  const [routingHealth, setRoutingHealth] = useState({
    brokenLinks: 3,
    totalLinks: 45,
    responseTime: 245,
    errorRate: 6.7,
    status: 'warning'
  });

  // Route structure data
  const routeStructure = [
    {
      path: '/',
      name: 'Home/Dashboard',
      status: 'working',
      responseTime: 120,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/login',
      name: 'Login',
      status: 'working',
      responseTime: 95,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/register',
      name: 'Register',
      status: 'working',
      responseTime: 110,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/student-dashboard',
      name: 'Student Dashboard',
      status: 'working',
      responseTime: 150,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/course-catalog',
      name: 'Course Catalog',
      status: 'working',
      responseTime: 200,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/course-detail',
      name: 'Course Detail',
      status: 'working',
      responseTime: 180,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/lesson-interface',
      name: 'Lesson Interface',
      status: 'working',
      responseTime: 300,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/assignment-submission',
      name: 'Assignment Submission',
      status: 'working',
      responseTime: 220,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/ai-voice-tutor',
      name: 'AI Voice Tutor',
      status: 'working',
      responseTime: 350,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/admin-panel',
      name: 'Admin Panel',
      status: 'restricted',
      responseTime: 180,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/company-dashboard',
      name: 'Company Dashboard',
      status: 'restricted',
      responseTime: 200,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/settings',
      name: 'Settings',
      status: 'working',
      responseTime: 130,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/profile',
      name: 'Profile',
      status: 'working',
      responseTime: 140,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/help',
      name: 'Help Center',
      status: 'working',
      responseTime: 160,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/password-reset',
      name: 'Password Reset',
      status: 'working',
      responseTime: 120,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/404-error-page',
      name: '404 Error Page',
      status: 'working',
      responseTime: 90,
      lastChecked: new Date()?.toLocaleTimeString()
    },
    {
      path: '/site-map',
      name: 'Site Map',
      status: 'working',
      responseTime: 170,
      lastChecked: new Date()?.toLocaleTimeString()
    }
  ];

  // Recent 404 errors (mock data)
  const [recentErrors, setRecentErrors] = useState([
    {
      timestamp: new Date(Date.now() - 300000)?.toLocaleString(),
      path: '/old-dashboard',
      referrer: '/login',
      userAgent: 'Chrome/91.0.4472.124',
      count: 5
    },
    {
      timestamp: new Date(Date.now() - 600000)?.toLocaleString(),
      path: '/courses/nonexistent',
      referrer: '/course-catalog',
      userAgent: 'Firefox/89.0',
      count: 2
    },
    {
      timestamp: new Date(Date.now() - 900000)?.toLocaleString(),
      path: '/user/profile',
      referrer: '/settings',
      userAgent: 'Safari/14.1.1',
      count: 3
    }
  ]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'routes', label: 'Route Mapping', icon: 'GitBranch' },
    { id: 'checker', label: 'Link Checker', icon: 'ExternalLink' },
    { id: 'errors', label: 'Error Log', icon: 'AlertTriangle' },
    { id: 'testing', label: 'Bulk Testing', icon: 'TestTube' }
  ];

  const handleTestRoute = (path) => {
    setTestResults(prev => ({
      ...prev,
      [path]: 'testing'
    }));

    // Simulate testing
    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        [path]: Math.random() > 0.8 ? 'failed' : 'passed'
      }));
    }, 2000);
  };

  const handleTestAll = () => {
    routeStructure?.forEach(route => {
      handleTestRoute(route?.path);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'text-success bg-success/10';
      case 'broken': return 'text-error bg-error/10';
      case 'slow': return 'text-warning bg-warning/10';
      case 'restricted': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted-foreground/10';
    }
  };

  const getTestResultColor = (result) => {
    switch (result) {
      case 'passed': return 'text-success bg-success/10';
      case 'failed': return 'text-error bg-error/10';
      case 'testing': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted-foreground/10';
    }
  };

  const filteredRoutes = routeStructure?.filter(route =>
    route?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    route?.path?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <AdaptiveNavbar 
        currentPath="/navigation-debug-panel"
        onNavigate={navigate}
        onToggleSidebar={() => {}}
      />
      <div className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-onBackground mb-2">Navigation Debug Panel</h1>
            <p className="text-muted-foreground">Monitor and debug routing issues across the MentorX platform</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab?.id)}
                  className="flex items-center gap-2"
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Health Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                      <Icon name="AlertTriangle" size={20} className="text-error" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Broken Links</p>
                      <p className="text-2xl font-bold text-onBackground">{routingHealth?.brokenLinks}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <Icon name="ExternalLink" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Links</p>
                      <p className="text-2xl font-bold text-onBackground">{routingHealth?.totalLinks}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon name="Clock" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold text-onBackground">{routingHealth?.responseTime}ms</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold text-onBackground">{routingHealth?.errorRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Errors */}
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                <h3 className="text-xl font-semibold text-onBackground mb-4">Recent 404 Errors</h3>
                <div className="space-y-4">
                  {recentErrors?.map((error, index) => (
                    <div key={index} className="flex items-center justify-between p-4 glass-subtle rounded-xl">
                      <div className="flex-1">
                        <p className="font-medium text-onBackground">{error?.path}</p>
                        <p className="text-sm text-muted-foreground">
                          From: {error?.referrer} • {error?.timestamp}
                        </p>
                      </div>
                      <span className="text-sm text-error bg-error/10 px-2 py-1 rounded-full">
                        {error?.count} errors
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Route Mapping Tab */}
          {activeTab === 'routes' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search routes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="glass-panel border-glass-border rounded-xl"
                  />
                </div>
                <Button onClick={() => window?.location?.reload()}>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 overflow-hidden">
                <div className="p-6 border-b border-glass-border">
                  <h3 className="text-xl font-semibold text-onBackground">Route Structure</h3>
                </div>
                <div className="divide-y divide-glass-border">
                  {filteredRoutes?.map((route, index) => (
                    <div key={route?.path} className="p-4 hover:glass-subtle transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <code className="text-sm bg-muted-foreground/10 px-2 py-1 rounded">
                              {route?.path}
                            </code>
                            <span className="font-medium text-onBackground">{route?.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Response: {route?.responseTime}ms • Last checked: {route?.lastChecked}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(route?.status)}`}>
                            {route?.status}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestRoute(route?.path)}
                            disabled={testResults?.[route?.path] === 'testing'}
                          >
                            {testResults?.[route?.path] === 'testing' ? (
                              <Icon name="Loader2" size={14} className="animate-spin" />
                            ) : (
                              <Icon name="TestTube" size={14} />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(route?.path)}
                          >
                            <Icon name="ExternalLink" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Link Checker Tab */}
          {activeTab === 'checker' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-onBackground">Link Validation</h3>
                  <Button onClick={handleTestAll}>
                    <Icon name="Play" size={16} className="mr-2" />
                    Test All Links
                  </Button>
                </div>

                <div className="space-y-4">
                  {routeStructure?.map((route) => (
                    <div key={route?.path} className="flex items-center justify-between p-4 glass-subtle rounded-xl">
                      <div className="flex items-center gap-3">
                        <Icon 
                          name={
                            testResults?.[route?.path] === 'passed' ? 'CheckCircle' :
                            testResults?.[route?.path] === 'failed' ? 'XCircle' :
                            testResults?.[route?.path] === 'testing' ? 'Loader2' : 'Circle'
                          }
                          size={16}
                          className={
                            testResults?.[route?.path] === 'passed' ? 'text-success' :
                            testResults?.[route?.path] === 'failed' ? 'text-error' :
                            testResults?.[route?.path] === 'testing' ? 'text-warning animate-spin' : 'text-muted-foreground'
                          }
                        />
                        <div>
                          <p className="font-medium text-onBackground">{route?.name}</p>
                          <p className="text-sm text-muted-foreground">{route?.path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {testResults?.[route?.path] && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getTestResultColor(testResults?.[route?.path])}`}>
                            {testResults?.[route?.path]}
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestRoute(route?.path)}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Log Tab */}
          {activeTab === 'errors' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                <h3 className="text-xl font-semibold text-onBackground mb-6">404 Error Details</h3>
                <div className="space-y-4">
                  {recentErrors?.map((error, index) => (
                    <div key={index} className="p-4 glass-subtle rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon name="AlertTriangle" size={16} className="text-error" />
                          <span className="font-medium text-onBackground">{error?.path}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{error?.timestamp}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Referrer:</strong> {error?.referrer}</p>
                        <p><strong>User Agent:</strong> {error?.userAgent}</p>
                        <p><strong>Error Count:</strong> {error?.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Bulk Testing Tab */}
          {activeTab === 'testing' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                <h3 className="text-xl font-semibold text-onBackground mb-6">Bulk Link Testing</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-onBackground mb-2">
                        Test Configuration
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Timeout (ms)</label>
                          <Input defaultValue="5000" type="number" />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Retries</label>
                          <Input defaultValue="3" type="number" />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleTestAll} className="w-full mb-6">
                      <Icon name="Zap" size={16} className="mr-2" />
                      Run Full Test Suite
                    </Button>

                    <div className="bg-muted-foreground/5 rounded-xl p-4 text-sm font-mono">
                      <div className="text-muted-foreground mb-2">Test Results:</div>
                      {Object.entries(testResults)?.length === 0 ? (
                        <div className="text-muted-foreground">No tests run yet...</div>
                      ) : (
                        Object.entries(testResults)?.map(([path, result]) => (
                          <div key={path} className="flex justify-between py-1">
                            <span>{path}</span>
                            <span className={
                              result === 'passed' ? 'text-success' :
                              result === 'failed' ? 'text-error' : 'text-warning'
                            }>
                              {result}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-onBackground mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Icon name="Download" size={16} className="mr-2" />
                        Export Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Icon name="Settings" size={16} className="mr-2" />
                        Test Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Icon name="History" size={16} className="mr-2" />
                        Test History
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationDebugPanel;