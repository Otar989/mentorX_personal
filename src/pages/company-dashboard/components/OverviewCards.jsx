import React from 'react';
import Icon from '../../../components/AppIcon';

const OverviewCards = ({ metrics = {} }) => {
  const defaultMetrics = {
    activeLearners: 156,
    completionRate: 78.5,
    licenseUtilization: 89.2,
    avgProgress: 65.3,
    totalCourses: 24,
    certificatesEarned: 89,
    ...metrics
  };

  const cards = [
    {
      title: "Active Learners",
      value: defaultMetrics?.activeLearners,
      change: "+12%",
      trend: "up",
      icon: "Users",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Completion Rate",
      value: `${defaultMetrics?.completionRate}%`,
      change: "+5.2%",
      trend: "up",
      icon: "TrendingUp",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "License Utilization",
      value: `${defaultMetrics?.licenseUtilization}%`,
      change: "+3.1%",
      trend: "up",
      icon: "Shield",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Average Progress",
      value: `${defaultMetrics?.avgProgress}%`,
      change: "-2.1%",
      trend: "down",
      icon: "BarChart3",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Total Courses",
      value: defaultMetrics?.totalCourses,
      change: "+2",
      trend: "up",
      icon: "BookOpen",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Certificates Earned",
      value: defaultMetrics?.certificatesEarned,
      change: "+15",
      trend: "up",
      icon: "Award",
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards?.map((card, index) => (
        <div key={index} className="glass rounded-xl p-6 hover:shadow-glass-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              card?.trend === 'up' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={card?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span>{card?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{card?.value}</h3>
            <p className="text-sm text-muted-foreground">{card?.title}</p>
          </div>
          
          {/* Progress bar for percentage values */}
          {typeof card?.value === 'string' && card?.value?.includes('%') && (
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    card?.trend === 'up' ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: card?.value }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;