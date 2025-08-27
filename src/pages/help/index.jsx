import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import { useNavigate } from 'react-router-dom';

const HelpPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'Play',
      articles: [
        { title: 'How to create your first account', content: 'Step-by-step guide to registration' },
        { title: 'Navigating the dashboard', content: 'Learn your way around the interface' },
        { title: 'Enrolling in your first course', content: 'Find and join courses' }
      ]
    },
    {
      id: 'courses',
      title: 'Courses & Learning',
      icon: 'BookOpen',
      articles: [
        { title: 'How to browse and filter courses', content: 'Find the perfect course for you' },
        { title: 'Understanding course progress', content: 'Track your learning journey' },
        { title: 'Submitting assignments', content: 'Complete and submit your work' }
      ]
    },
    {
      id: 'ai-tutor',
      title: 'AI Voice Tutor',
      icon: 'Mic',
      articles: [
        { title: 'Setting up voice sessions', content: 'Configure your microphone and audio' },
        { title: 'Getting the most from AI conversations', content: 'Tips for effective interaction' },
        { title: 'Troubleshooting audio issues', content: 'Solve common problems' }
      ]
    },
    {
      id: 'account',
      title: 'Account & Settings',
      icon: 'User',
      articles: [
        { title: 'Managing your profile', content: 'Update personal information' },
        { title: 'Privacy and security settings', content: 'Keep your account secure' },
        { title: 'Notification preferences', content: 'Control what you hear about' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'AlertTriangle',
      articles: [
        { title: 'Common login issues', content: 'Resolve authentication problems' },
        { title: 'Video playback problems', content: 'Fix streaming issues' },
        { title: 'Browser compatibility', content: 'Ensure optimal performance' }
      ]
    }
  ];

  const quickActions = [
    { title: 'Contact Support', icon: 'MessageCircle', action: () => console.log('Contact support') },
    { title: 'Report a Bug', icon: 'Bug', action: () => console.log('Report bug') },
    { title: 'Feature Request', icon: 'Lightbulb', action: () => console.log('Feature request') },
    { title: 'Live Chat', icon: 'MessageSquare', action: () => console.log('Live chat') }
  ];

  const currentCategory = helpCategories?.find(cat => cat?.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <AdaptiveNavbar 
        currentPath="/help"
        onNavigate={navigate}
        onToggleSidebar={() => {}}
      />
      <div className="pt-20 px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold text-onBackground mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to your questions and get the most out of MentorX
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pl-12 glass-panel border-glass-border backdrop-blur-20 rounded-2xl h-14 text-lg"
                />
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-onBackground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions?.map((action, index) => (
                <motion.div
                  key={action?.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    onClick={action?.action}
                    className="w-full glass-panel border-glass-border backdrop-blur-20 rounded-2xl p-6 h-auto flex-col gap-3 hover:glass-hover transition-all duration-300"
                  >
                    <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center">
                      <Icon name={action?.icon} size={24} className="text-primary" />
                    </div>
                    <span className="font-medium text-sm">{action?.title}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-6">
                <h3 className="font-semibold text-onBackground mb-4">Categories</h3>
                <div className="space-y-2">
                  {helpCategories?.map((category) => (
                    <button
                      key={category?.id}
                      onClick={() => setActiveCategory(category?.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                        activeCategory === category?.id
                          ? 'glass text-primary shadow-glass'
                          : 'hover:glass-subtle'
                      }`}
                    >
                      <Icon name={category?.icon} size={16} />
                      <span className="text-sm">{category?.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="glass-panel rounded-2xl border border-glass-border backdrop-blur-20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 glass-subtle rounded-xl flex items-center justify-center">
                    <Icon name={currentCategory?.icon} size={20} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-onBackground">
                    {currentCategory?.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {currentCategory?.articles?.map((article, index) => (
                    <motion.div
                      key={article?.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glass-subtle rounded-xl p-6 hover:glass-hover cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-onBackground mb-2 group-hover:text-primary transition-colors">
                            {article?.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {article?.content}
                          </p>
                        </div>
                        <Icon 
                          name="ChevronRight" 
                          size={16} 
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Still Need Help */}
                <div className="mt-12 pt-8 border-t border-glass-border">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-onBackground mb-2">
                      Still need help?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Our support team is here to help you succeed
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="default">
                        <Icon name="MessageCircle" size={16} className="mr-2" />
                        Contact Support
                      </Button>
                      <Button variant="outline">
                        <Icon name="Calendar" size={16} className="mr-2" />
                        Schedule Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;