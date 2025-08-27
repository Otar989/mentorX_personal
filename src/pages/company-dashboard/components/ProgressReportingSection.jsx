import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ProgressReportingSection = ({ onExportReport = () => {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('completion');

  const periodOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last 12 Months' }
  ];

  const metricOptions = [
    { value: 'completion', label: 'Course Completion' },
    { value: 'engagement', label: 'User Engagement' },
    { value: 'performance', label: 'Assessment Performance' },
    { value: 'time', label: 'Learning Time' }
  ];

  const completionData = [
    { date: '2025-08-01', completed: 12, started: 18, enrolled: 25 },
    { date: '2025-08-05', completed: 18, started: 22, enrolled: 30 },
    { date: '2025-08-10', completed: 25, started: 28, enrolled: 35 },
    { date: '2025-08-15', completed: 32, started: 35, enrolled: 42 },
    { date: '2025-08-20', completed: 38, started: 41, enrolled: 48 },
    { date: '2025-08-25', completed: 45, started: 48, enrolled: 55 }
  ];

  const engagementData = [
    { date: '2025-08-01', activeUsers: 89, totalLogins: 156, avgSessionTime: 45 },
    { date: '2025-08-05', activeUsers: 92, totalLogins: 168, avgSessionTime: 48 },
    { date: '2025-08-10', activeUsers: 95, totalLogins: 175, avgSessionTime: 52 },
    { date: '2025-08-15', activeUsers: 98, totalLogins: 182, avgSessionTime: 55 },
    { date: '2025-08-20', activeUsers: 102, totalLogins: 195, avgSessionTime: 58 },
    { date: '2025-08-25', activeUsers: 105, totalLogins: 203, avgSessionTime: 62 }
  ];

  const performanceData = [
    { date: '2025-08-01', avgScore: 78, passRate: 85, attempts: 124 },
    { date: '2025-08-05', avgScore: 79, passRate: 87, attempts: 135 },
    { date: '2025-08-10', avgScore: 81, passRate: 89, attempts: 142 },
    { date: '2025-08-15', avgScore: 82, passRate: 91, attempts: 158 },
    { date: '2025-08-20', avgScore: 84, passRate: 92, attempts: 167 },
    { date: '2025-08-25', avgScore: 85, passRate: 94, attempts: 175 }
  ];

  const timeData = [
    { date: '2025-08-01', totalHours: 245, avgPerUser: 2.8, peakHours: 35 },
    { date: '2025-08-05', totalHours: 268, avgPerUser: 3.1, peakHours: 38 },
    { date: '2025-08-10', totalHours: 285, avgPerUser: 3.3, peakHours: 42 },
    { date: '2025-08-15', totalHours: 312, avgPerUser: 3.6, peakHours: 45 },
    { date: '2025-08-20', totalHours: 334, avgPerUser: 3.8, peakHours: 48 },
    { date: '2025-08-25', totalHours: 356, avgPerUser: 4.1, peakHours: 52 }
  ];

  const getCurrentData = () => {
    switch (selectedMetric) {
      case 'engagement': return engagementData;
      case 'performance': return performanceData;
      case 'time': return timeData;
      default: return completionData;
    }
  };

  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'engagement':
        return {
          primary: { key: 'activeUsers', name: 'Active Users', color: '#2563EB' },
          secondary: { key: 'totalLogins', name: 'Total Logins', color: '#7C3AED' }
        };
      case 'performance':
        return {
          primary: { key: 'avgScore', name: 'Average Score', color: '#10B981' },
          secondary: { key: 'passRate', name: 'Pass Rate (%)', color: '#F59E0B' }
        };
      case 'time':
        return {
          primary: { key: 'totalHours', name: 'Total Hours', color: '#EF4444' },
          secondary: { key: 'avgPerUser', name: 'Avg Per User', color: '#8B5CF6' }
        };
      default:
        return {
          primary: { key: 'completed', name: 'Completed', color: '#10B981' },
          secondary: { key: 'started', name: 'Started', color: '#F59E0B' }
        };
    }
  };

  const currentData = getCurrentData();
  const metricConfig = getMetricConfig();

  const keyMetrics = [
    {
      title: "Total Learners",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: "Users",
      color: "text-primary"
    },
    {
      title: "Completion Rate",
      value: "78.5%",
      change: "+5.2%",
      trend: "up",
      icon: "CheckCircle",
      color: "text-success"
    },
    {
      title: "Avg. Score",
      value: "85%",
      change: "+3.1%",
      trend: "up",
      icon: "Target",
      color: "text-accent"
    },
    {
      title: "Learning Hours",
      value: "356h",
      change: "+8.7%",
      trend: "up",
      icon: "Clock",
      color: "text-secondary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Progress Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Track learning outcomes and engagement metrics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              className="w-40"
            />
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              onClick={() => onExportReport('analytics')}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyMetrics?.map((metric, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name={metric?.icon} size={20} className={metric?.color} />
                <div className={`flex items-center gap-1 text-sm ${
                  metric?.trend === 'up' ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                  />
                  <span>{metric?.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
                <p className="text-sm text-muted-foreground">{metric?.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Charts */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">Detailed Analytics</h3>
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="w-48"
          />
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.6)"
                tickFormatter={(value) => new Date(value)?.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(16px)'
                }}
                labelFormatter={(value) => new Date(value)?.toLocaleDateString('ru-RU')}
              />
              <Area 
                type="monotone" 
                dataKey={metricConfig?.primary?.key} 
                stroke={metricConfig?.primary?.color}
                fill={metricConfig?.primary?.color}
                fillOpacity={0.3}
                name={metricConfig?.primary?.name}
              />
              <Area 
                type="monotone" 
                dataKey={metricConfig?.secondary?.key} 
                stroke={metricConfig?.secondary?.color}
                fill={metricConfig?.secondary?.color}
                fillOpacity={0.3}
                name={metricConfig?.secondary?.name}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="font-medium text-foreground">Positive Trend</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Course completion rates have increased by 15% this month
            </p>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="font-medium text-foreground">High Engagement</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average session time has improved to 62 minutes per user
            </p>
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={16} className="text-accent" />
              <span className="font-medium text-foreground">Performance Goal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Team is 94% towards quarterly learning objectives
            </p>
          </div>
        </div>
      </div>
      {/* Department Performance */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Department Performance</h3>
        <div className="space-y-4">
          {[
            { name: 'IT Development', completion: 92, engagement: 88, avgScore: 87 },
            { name: 'Marketing', completion: 78, engagement: 82, avgScore: 85 },
            { name: 'Sales', completion: 65, engagement: 75, avgScore: 79 },
            { name: 'HR', completion: 89, engagement: 91, avgScore: 88 },
            { name: 'Finance', completion: 72, engagement: 68, avgScore: 82 }
          ]?.map((dept, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">{dept?.name}</h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Completion: <span className="text-foreground font-medium">{dept?.completion}%</span>
                  </span>
                  <span className="text-muted-foreground">
                    Engagement: <span className="text-foreground font-medium">{dept?.engagement}%</span>
                  </span>
                  <span className="text-muted-foreground">
                    Avg Score: <span className="text-foreground font-medium">{dept?.avgScore}%</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all duration-500"
                      style={{ width: `${dept?.completion}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${dept?.engagement}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${dept?.avgScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressReportingSection;