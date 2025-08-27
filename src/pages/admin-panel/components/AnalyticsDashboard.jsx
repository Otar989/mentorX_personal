import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const metricOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'users', label: 'User Growth' },
    { value: 'courses', label: 'Course Completions' },
    { value: 'engagement', label: 'User Engagement' }
  ];

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', value: 450000, users: 120 },
    { name: 'Feb', value: 520000, users: 145 },
    { name: 'Mar', value: 480000, users: 135 },
    { name: 'Apr', value: 620000, users: 180 },
    { name: 'May', value: 580000, users: 165 },
    { name: 'Jun', value: 720000, users: 210 },
    { name: 'Jul', value: 680000, users: 195 },
    { name: 'Aug', value: 750000, users: 225 }
  ];

  const courseCompletionData = [
    { name: 'React Fundamentals', completions: 1247, rating: 4.8 },
    { name: 'Advanced JavaScript', completions: 892, rating: 4.9 },
    { name: 'Python Basics', completions: 634, rating: 4.7 },
    { name: 'Data Science', completions: 456, rating: 4.6 },
    { name: 'DevOps Essentials', completions: 321, rating: 4.5 }
  ];

  const userEngagementData = [
    { name: 'Active Users', value: 8923, color: '#2563EB' },
    { name: 'New Users', value: 2156, color: '#7C3AED' },
    { name: 'Returning Users', value: 6767, color: '#F59E0B' },
    { name: 'Inactive Users', value: 1234, color: '#EF4444' }
  ];

  const trafficSourceData = [
    { name: 'Direct', value: 35, color: '#2563EB' },
    { name: 'Search', value: 28, color: '#7C3AED' },
    { name: 'Social Media', value: 20, color: '#F59E0B' },
    { name: 'Referrals', value: 12, color: '#10B981' },
    { name: 'Email', value: 5, color: '#EF4444' }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '₽4,850,000',
      change: '+22.5%',
      changeType: 'positive',
      icon: 'TrendingUp',
      description: 'vs last month'
    },
    {
      title: 'Active Users',
      value: '8,923',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'Users',
      description: 'monthly active users'
    },
    {
      title: 'Course Completions',
      value: '3,547',
      change: '+8.7%',
      changeType: 'positive',
      icon: 'Award',
      description: 'this month'
    },
    {
      title: 'Avg. Session Time',
      value: '45m 32s',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'Clock',
      description: 'per session'
    }
  ];

  const exportData = (format) => {
    console.log(`Exporting analytics data in ${format} format`);
    // Simulate export
    const link = document.createElement('a');
    link.href = '#';
    link.download = `analytics-report-${new Date()?.toISOString()?.split('T')?.[0]}.${format}`;
    link?.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Platform performance and user insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-40"
          />
          
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            onClick={() => exportData('pdf')}
          >
            Export
          </Button>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards?.map((kpi, index) => (
          <div key={index} className="glass-lg rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={kpi?.icon} size={24} className="text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                kpi?.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={kpi?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                />
                {kpi?.change}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold">{kpi?.value}</h3>
              <p className="text-muted-foreground text-sm">{kpi?.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-lg rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <Select
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
              className="w-40"
            />
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  tickFormatter={(value) => `₽${(value / 1000)?.toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(16px)'
                  }}
                  formatter={(value) => [`₽${value?.toLocaleString('ru-RU')}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Completions */}
        <div className="glass-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Top Performing Courses</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCompletionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number"
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(16px)'
                  }}
                />
                <Bar 
                  dataKey="completions" 
                  fill="#7C3AED"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Engagement Pie Chart */}
        <div className="glass-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">User Engagement</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userEngagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userEngagementData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(16px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {userEngagementData?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm">{item?.name}</span>
                <span className="text-sm font-medium ml-auto">{item?.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="glass-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Traffic Sources</h3>
          
          <div className="space-y-4">
            {trafficSourceData?.map((source, index) => (
              <div key={index} className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: source?.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{source?.name}</span>
                    <span className="text-sm">{source?.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${source?.value}%`,
                        backgroundColor: source?.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Sessions</span>
              <span className="font-medium">24,567</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Bounce Rate</span>
              <span className="font-medium">32.4%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Export Options */}
      <div className="glass-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => exportData('pdf')}
            iconName="FileText"
            iconPosition="left"
            iconSize={16}
          >
            Export as PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => exportData('xlsx')}
            iconName="FileSpreadsheet"
            iconPosition="left"
            iconSize={16}
          >
            Export as Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => exportData('csv')}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export as CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;