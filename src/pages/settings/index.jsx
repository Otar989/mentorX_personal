import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import RoleSidebar from '../../components/ui/RoleSidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const Settings = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    avatar_url: ''
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    assignment_reminders: true,
    course_updates: true,
    achievement_alerts: true
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'public',
    show_progress: true,
    show_achievements: true,
    allow_messages: true
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile?.full_name || '',
        email: user?.email || '',
        phone: userProfile?.phone || '',
        bio: userProfile?.bio || '',
        avatar_url: userProfile?.avatar_url || ''
      });
    }
  }, [user, userProfile]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateProfile(profileData);
      setMessage('Профиль успешно обновлен');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      setMessage('Ошибка при обновлении профиля');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
    { id: 'privacy', label: 'Приватность', icon: 'Shield' },
    { id: 'account', label: 'Аккаунт', icon: 'Settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={profileData?.avatar_url}
                  alt="Аватар профиля"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full">
                  <Icon name="Camera" size={16} />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Фото профиля</h3>
                <p className="text-sm text-muted-foreground">Загрузите свое фото профиля</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Изменить фото
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Полное имя</label>
                <Input
                  value={profileData?.full_name}
                  onChange={(e) => setProfileData(prev => ({...prev, full_name: e?.target?.value}))}
                  placeholder="Введите ваше полное имя"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  value={profileData?.email}
                  onChange={(e) => setProfileData(prev => ({...prev, email: e?.target?.value}))}
                  placeholder="Введите ваш email"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Телефон</label>
                <Input
                  value={profileData?.phone}
                  onChange={(e) => setProfileData(prev => ({...prev, phone: e?.target?.value}))}
                  placeholder="Введите ваш телефон"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Биография</label>
              <textarea
                value={profileData?.bio}
                onChange={(e) => setProfileData(prev => ({...prev, bio: e?.target?.value}))}
                placeholder="Расскажите о себе..."
                className="w-full p-3 border rounded-lg bg-background"
                rows={4}
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Настройки уведомлений</h3>
            <div className="space-y-4">
              {[
                { key: 'email_notifications', label: 'Email уведомления', desc: 'Получать уведомления на email' },
                { key: 'push_notifications', label: 'Push уведомления', desc: 'Получать push уведомления' },
                { key: 'assignment_reminders', label: 'Напоминания о заданиях', desc: 'Напоминания о предстоящих дедлайнах' },
                { key: 'course_updates', label: 'Обновления курсов', desc: 'Уведомления о новых материалах' },
                { key: 'achievement_alerts', label: 'Уведомления о достижениях', desc: 'Уведомления о новых достижениях' }
              ]?.map(setting => (
                <div key={setting?.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{setting?.label}</h4>
                    <p className="text-sm text-muted-foreground">{setting?.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings?.[setting?.key]}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        [setting?.key]: e?.target?.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Настройки приватности</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Видимость профиля</h4>
                <select
                  value={privacySettings?.profile_visibility}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    profile_visibility: e?.target?.value
                  }))}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="public">Публичный</option>
                  <option value="private">Приватный</option>
                  <option value="friends">Только друзья</option>
                </select>
              </div>

              {[
                { key: 'show_progress', label: 'Показывать прогресс', desc: 'Другие могут видеть ваш прогресс обучения' },
                { key: 'show_achievements', label: 'Показывать достижения', desc: 'Другие могут видеть ваши достижения' },
                { key: 'allow_messages', label: 'Разрешить сообщения', desc: 'Другие пользователи могут отправлять вам сообщения' }
              ]?.map(setting => (
                <div key={setting?.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{setting?.label}</h4>
                    <p className="text-sm text-muted-foreground">{setting?.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacySettings?.[setting?.key]}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        [setting?.key]: e?.target?.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Управление аккаунтом</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Смена пароля</h4>
                <p className="text-sm text-muted-foreground mb-4">Обновите свой пароль для обеспечения безопасности</p>
                <Button variant="outline">
                  Изменить пароль
                </Button>
              </div>

              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium mb-2 text-red-800">Опасная зона</h4>
                <p className="text-sm text-red-600 mb-4">Эти действия необратимы. Будьте осторожны.</p>
                <div className="space-y-2">
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    Удалить аккаунт
                  </Button>
                  <Button onClick={handleLogout} variant="outline" className="ml-2">
                    Выйти из аккаунта
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <AdaptiveNavbar
        userRole={userProfile?.role || "student"}
        currentPath="/settings"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      {/* Sidebar */}
      <RoleSidebar
        userRole={userProfile?.role || "student"}
        currentPath="/settings"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      {/* Main Content */}
      <main className={`
        content-offset transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'lg:content-offset-sidebar-collapsed' : 'lg:content-offset-sidebar'}
      `}>
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Настройки</h1>
            <p className="text-muted-foreground">
              Управляйте своим аккаунтом и настройками приложения
            </p>
          </motion.div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg"
            >
              {message}
            </motion.div>
          )}

          {/* Settings Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={20} />
                    <span className="font-medium">{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-glass p-6"
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;