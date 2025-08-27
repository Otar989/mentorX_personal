import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const LicenseManagementPanel = ({ onManageLicenses = () => {} }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const licenseData = {
    totalSeats: 200,
    usedSeats: 156,
    availableSeats: 44,
    renewalDate: "2025-12-15",
    subscriptionType: "Enterprise",
    monthlyUsage: [
      { month: 'Jan', used: 120, available: 80 },
      { month: 'Feb', used: 135, available: 65 },
      { month: 'Mar', used: 142, available: 58 },
      { month: 'Apr', used: 156, available: 44 },
      { month: 'May', used: 148, available: 52 },
      { month: 'Jun', used: 156, available: 44 }
    ],
    departmentUsage: [
      { name: 'IT Development', value: 45, color: '#2563EB' },
      { name: 'Marketing', value: 25, color: '#7C3AED' },
      { name: 'Sales', value: 35, color: '#F59E0B' },
      { name: 'HR', value: 20, color: '#10B981' },
      { name: 'Finance', value: 15, color: '#EF4444' },
      { name: 'Operations', value: 16, color: '#8B5CF6' }
    ]
  };

  const utilizationPercentage = (licenseData?.usedSeats / licenseData?.totalSeats) * 100;
  const daysUntilRenewal = Math.ceil((new Date(licenseData.renewalDate) - new Date()) / (1000 * 60 * 60 * 24));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'usage', label: 'Usage Analytics', icon: 'TrendingUp' },
    { id: 'departments', label: 'Department Breakdown', icon: 'Users' },
    { id: 'billing', label: 'Billing & Renewal', icon: 'CreditCard' }
  ];

  return (
    <div className="glass rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">License Management</h2>
          <p className="text-sm text-muted-foreground">
            Monitor seat allocation and subscription usage
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            onClick={() => onManageLicenses('export')}
          >
            Export Report
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            onClick={() => onManageLicenses('upgrade')}
          >
            Upgrade Plan
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-smooth ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{licenseData?.usedSeats}</p>
                  <p className="text-sm text-muted-foreground">Active Seats</p>
                </div>
              </div>
            </div>
            
            <div className="bg-success/5 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{licenseData?.availableSeats}</p>
                  <p className="text-sm text-muted-foreground">Available Seats</p>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/5 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Percent" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{utilizationPercentage?.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                </div>
              </div>
            </div>
            
            <div className="bg-warning/5 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{daysUntilRenewal}</p>
                  <p className="text-sm text-muted-foreground">Days to Renewal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Utilization Progress */}
          <div className="bg-white/5 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Seat Utilization</h3>
              <span className="text-sm text-muted-foreground">
                {licenseData?.usedSeats} of {licenseData?.totalSeats} seats used
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 mb-2">
              <div 
                className="progress-ambient h-4 rounded-full transition-all duration-500"
                style={{ width: `${utilizationPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0</span>
              <span>{licenseData?.totalSeats}</span>
            </div>
          </div>

          {/* Renewal Alert */}
          {daysUntilRenewal <= 30 && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Renewal Required Soon</h4>
                  <p className="text-sm text-muted-foreground">
                    Your subscription expires on {licenseData?.renewalDate}. Renew now to avoid service interruption.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManageLicenses('renew')}
                >
                  Renew Now
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Usage Analytics Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Monthly Usage Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={licenseData?.monthlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(16px)'
                    }}
                  />
                  <Bar dataKey="used" fill="#2563EB" name="Used Seats" />
                  <Bar dataKey="available" fill="#10B981" name="Available Seats" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      {/* Department Breakdown Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Department Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={licenseData?.departmentUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {licenseData?.departmentUsage?.map((entry, index) => (
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
            </div>
            
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Department Details</h3>
              <div className="space-y-3">
                {licenseData?.departmentUsage?.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: dept?.color }}
                      />
                      <span className="font-medium text-foreground">{dept?.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-foreground">{dept?.value}</span>
                      <span className="text-sm text-muted-foreground ml-1">seats</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Billing & Renewal Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Current Subscription</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type</span>
                  <span className="font-medium text-foreground">{licenseData?.subscriptionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Seats</span>
                  <span className="font-medium text-foreground">{licenseData?.totalSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-medium text-foreground">₽89,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Billing</span>
                  <span className="font-medium text-foreground">{licenseData?.renewalDate}</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <Button
                    variant="default"
                    fullWidth
                    iconName="CreditCard"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => onManageLicenses('billing')}
                  >
                    Manage Billing
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Usage Recommendations</h3>
              <div className="space-y-4">
                {utilizationPercentage > 90 && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning" />
                      <span className="font-medium text-foreground">High Utilization</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider upgrading your plan to accommodate more users.
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-primary" />
                    <span className="font-medium text-foreground">Growth Opportunity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invite more team members to maximize your learning investment.
                  </p>
                </div>
                
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="font-medium text-foreground">Optimal Usage</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your current plan suits your team size well.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseManagementPanel;