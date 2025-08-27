import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';

import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Student',
    lastName: 'User',
    email: 'student@mentorx.com',
    phone: '+7 999 123 45 67',
    birthDate: '1995-06-15',
    location: 'Moscow, Russia',
    bio: 'Passionate learner interested in technology and innovation.',
    language: 'ru',
    timezone: 'Europe/Moscow',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      showProfile: true
    }
  });

  const tabs = [
    { id: 'general', label: 'General Info', icon: 'User' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'security', label: 'Security', icon: 'Lock' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset changes logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <AdaptiveNavbar 
        currentPath="/profile"
        onNavigate={navigate}
        onToggleSidebar={() => {}}
      />
      <div className="pt-20 px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-onBackground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                <div className="space-y-2">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab?.id
                          ? 'glass text-primary shadow-glass'
                          : 'hover:glass-subtle'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      {tab?.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-8">
                {/* General Info Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-onBackground">General Information</h2>
                      <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Icon name={isEditing ? "X" : "Edit"} size={16} className="mr-2" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <Icon name="User" size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-onBackground">
                          {profileData?.firstName} {profileData?.lastName}
                        </h3>
                        <p className="text-muted-foreground">{profileData?.email}</p>
                        {isEditing && (
                          <Button variant="outline" size="sm" className="mt-2">
                            Change Photo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-onBackground mb-2">
                          First Name
                        </label>
                        <Input
                          value={profileData?.firstName}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, firstName: e?.target?.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-onBackground mb-2">
                          Last Name
                        </label>
                        <Input
                          value={profileData?.lastName}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, lastName: e?.target?.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-onBackground mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={profileData?.email}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, email: e?.target?.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-onBackground mb-2">
                          Phone
                        </label>
                        <Input
                          value={profileData?.phone}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, phone: e?.target?.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-onBackground mb-2">
                          Birth Date
                        </label>
                        <Input
                          type="date"
                          value={profileData?.birthDate}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, birthDate: e?.target?.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-onBackground mb-2">
                          Location
                        </label>
                        <Input
                          value={profileData?.location}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, location: e?.target?.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-onBackground mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData?.bio}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, bio: e?.target?.value})}
                        className="w-full p-3 glass-panel border border-glass-border rounded-xl backdrop-blur-20 resize-none h-24"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-4 pt-6 border-t border-glass-border">
                        <Button variant="default" onClick={handleSave}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Other tabs content would go here */}
                {activeTab === 'preferences' && (
                  <div className="text-center py-12">
                    <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-onBackground mb-2">Preferences</h3>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="text-center py-12">
                    <Icon name="Shield" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-onBackground mb-2">Privacy Settings</h3>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="text-center py-12">
                    <Icon name="Lock" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-onBackground mb-2">Security</h3>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;