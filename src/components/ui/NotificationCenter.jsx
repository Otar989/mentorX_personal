import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ 
  isOpen = false,
  onToggle = () => {},
  onClose = () => {},
  className = ''
}) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'Assignment Due Soon',
      message: 'React Fundamentals Quiz is due in 2 hours',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      priority: 'high',
      actionUrl: '/assignment-submission'
    },
    {
      id: 2,
      type: 'course',
      title: 'New Lesson Available',
      message: 'Advanced React Hooks lesson has been published',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      priority: 'medium',
      actionUrl: '/lesson-interface'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You completed 5 lessons this week',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      priority: 'low',
      actionUrl: '/achievements'
    },
    {
      id: 4,
      type: 'ai_tutor',
      title: 'AI Tutor Session',
      message: 'Your scheduled tutoring session starts in 15 minutes',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: false,
      priority: 'high',
      actionUrl: '/ai-voice-tutor'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight from 2-4 AM EST',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      read: true,
      priority: 'medium',
      actionUrl: null
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, high
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const getNotificationIcon = (type) => {
    const icons = {
      assignment: 'FileText',
      course: 'BookOpen',
      achievement: 'Award',
      ai_tutor: 'Bot',
      system: 'Settings',
      default: 'Bell'
    };
    return icons?.[type] || icons?.default;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    if (type === 'achievement') return 'text-success';
    if (type === 'ai_tutor') return 'text-primary';
    return 'text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => 
        n?.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
      setIsLoading(false);
    }, 500);
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification?.id);
    if (notification?.actionUrl) {
      // Navigate to the action URL
      console.log('Navigate to:', notification?.actionUrl);
    }
    onClose();
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'unread') return !notification?.read;
    if (filter === 'high') return notification?.priority === 'high';
    return true;
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event?.target?.closest('.notification-center')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className={`notification-center relative ${className}`}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="relative"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] glass-lg rounded-xl shadow-glass-lg border border-white/20 z-dropdown">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {isLoading ? 'Marking...' : 'Mark all read'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { key: 'all', label: 'All', count: notifications?.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'high', label: 'Priority', count: notifications?.filter(n => n?.priority === 'high')?.length }
            ]?.map((tab) => (
              <button
                key={tab?.key}
                onClick={() => setFilter(tab?.key)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-smooth ${
                  filter === tab?.key
                    ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {tab?.label}
                {tab?.count > 0 && (
                  <span className="ml-1 text-xs opacity-60">({tab?.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={48} className="mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  {filter === 'unread' ? 'No unread notifications' : 
                   filter === 'high' ? 'No priority notifications' : 
                   'No notifications'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredNotifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className={`p-4 hover:bg-white/5 transition-smooth cursor-pointer group ${
                      !notification?.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        notification?.priority === 'high' ? 'bg-error/10' :
                        notification?.type === 'achievement'? 'bg-success/10' : 'bg-primary/10'
                      }`}>
                        <Icon 
                          name={getNotificationIcon(notification?.type)} 
                          size={16} 
                          className={getNotificationColor(notification?.type, notification?.priority)}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-medium text-sm ${
                            !notification?.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification?.title}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification?.timestamp)}
                            </span>
                            {!notification?.read && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification?.message}
                        </p>
                        
                        {/* Priority Badge */}
                        {notification?.priority === 'high' && (
                          <span className="inline-block mt-2 px-2 py-1 bg-error/10 text-error text-xs rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e?.stopPropagation();
                            deleteNotification(notification?.id);
                          }}
                          className="h-6 w-6 text-muted-foreground hover:text-error"
                        >
                          <Icon name="X" size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications?.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  console.log('View all notifications');
                  onClose();
                }}
              >
                View All Notifications
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;