import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemMetrics = ({ className = '' }) => {
  const [metrics, setMetrics] = useState({
    totalUsers: 15847,
    activeUsers: 8923,
    totalCourses: 156,
    completedCourses: 4521,
    revenue: 2847500,
    monthlyRevenue: 485600,
    systemHealth: 98.5,
    serverLoad: 45
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const metricCards = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers?.toLocaleString('ru-RU'),
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'text-primary'
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers?.toLocaleString('ru-RU'),
      change: '+8.3%',
      changeType: 'positive',
      icon: 'UserCheck',
      color: 'text-success'
    },
    {
      title: 'Total Courses',
      value: metrics?.totalCourses?.toLocaleString('ru-RU'),
      change: '+5.2%',
      changeType: 'positive',
      icon: 'BookOpen',
      color: 'text-secondary'
    },
    {
      title: 'Course Completions',
      value: metrics?.completedCourses?.toLocaleString('ru-RU'),
      change: '+15.7%',
      changeType: 'positive',
      icon: 'Award',
      color: 'text-accent'
    },
    {
      title: 'Total Revenue',
      value: `₽${metrics?.revenue?.toLocaleString('ru-RU')}`,
      change: '+22.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      title: 'Monthly Revenue',
      value: `₽${metrics?.monthlyRevenue?.toLocaleString('ru-RU')}`,
      change: '+18.4%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'text-primary'
    },
    {
      title: 'System Health',
      value: `${metrics?.systemHealth}%`,
      change: '+0.2%',
      changeType: 'positive',
      icon: 'Activity',
      color: 'text-success'
    },
    {
      title: 'Server Load',
      value: `${metrics?.serverLoad}%`,
      change: '-5.1%',
      changeType: 'negative',
      icon: 'Server',
      color: 'text-warning'
    }
  ];

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const refreshMetrics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        totalUsers: prev?.totalUsers + Math.floor(Math.random() * 100),
        activeUsers: prev?.activeUsers + Math.floor(Math.random() * 50),
        revenue: prev?.revenue + Math.floor(Math.random() * 10000)
      }));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Metrics</h2>
          <p className="text-muted-foreground">Real-time platform performance indicators</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 glass rounded-lg p-1">
            {timeRanges?.map((range) => (
              <button
                key={range?.value}
                onClick={() => handleTimeRangeChange(range?.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-smooth ${
                  timeRange === range?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMetrics}
            disabled={isLoading}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards?.map((metric, index) => (
          <div key={index} className="glass-lg rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center ${metric?.color}`}>
                <Icon name={metric?.icon} size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric?.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={metric?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                />
                {metric?.change}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold">{metric?.value}</h3>
              <p className="text-muted-foreground text-sm">{metric?.title}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="glass-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            iconName="UserPlus"
            iconPosition="left"
            iconSize={20}
          >
            <div className="text-left">
              <div className="font-medium">Add User</div>
              <div className="text-sm text-muted-foreground">Create new account</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            iconName="BookPlus"
            iconPosition="left"
            iconSize={20}
          >
            <div className="text-left">
              <div className="font-medium">New Course</div>
              <div className="text-sm text-muted-foreground">Create with AI</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            iconName="BarChart3"
            iconPosition="left"
            iconSize={20}
          >
            <div className="text-left">
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-muted-foreground">Analytics dashboard</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            iconName="Settings"
            iconPosition="left"
            iconSize={20}
          >
            <div className="text-left">
              <div className="font-medium">System Config</div>
              <div className="text-sm text-muted-foreground">Platform settings</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;