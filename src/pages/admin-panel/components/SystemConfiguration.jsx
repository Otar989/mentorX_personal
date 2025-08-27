import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SystemConfiguration = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'MentorX',
    supportEmail: 'support@mentorx.ru',
    defaultLanguage: 'ru',
    timezone: 'Europe/Moscow',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    yookassaShopId: '123456',
    yookassaSecretKey: '••••••••••••••••',
    fiscalReceiptsEnabled: true,
    taxRate: 20,
    currency: 'RUB',
    minPaymentAmount: 100,
    maxPaymentAmount: 500000
  });

  const [aiSettings, setAiSettings] = useState({
    openaiApiKey: '••••••••••••••••',
    voiceTutorEnabled: true,
    contentGenerationEnabled: true,
    maxTokensPerRequest: 4000,
    defaultModel: 'gpt-4',
    rateLimitPerUser: 100
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.yandex.ru',
    smtpPort: 587,
    smtpUsername: 'noreply@mentorx.ru',
    smtpPassword: '••••••••••••••••',
    fromName: 'MentorX Platform',
    fromEmail: 'noreply@mentorx.ru'
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 24,
    passwordMinLength: 8,
    requireSpecialChars: true,
    twoFactorEnabled: false,
    ipWhitelistEnabled: false,
    bruteForceProtection: true,
    maxLoginAttempts: 5
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'payment', label: 'Payment', icon: 'CreditCard' },
    { id: 'ai', label: 'AI Integration', icon: 'Bot' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const languageOptions = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' }
  ];

  const timezoneOptions = [
    { value: 'Europe/Moscow', label: 'Moscow (UTC+3)' },
    { value: 'Europe/London', label: 'London (UTC+0)' },
    { value: 'America/New_York', label: 'New York (UTC-5)' }
  ];

  const currencyOptions = [
    { value: 'RUB', label: 'Russian Ruble (₽)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ];

  const aiModelOptions = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' }
  ];

  const handleSave = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      console.log('Settings saved successfully');
    }, 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset logic here
      setHasChanges(false);
    }
  };

  const testConnection = (type) => {
    console.log(`Testing ${type} connection...`);
    // Test connection logic
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Platform Name"
          value={generalSettings?.platformName}
          onChange={(e) => {
            setGeneralSettings(prev => ({ ...prev, platformName: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Support Email"
          type="email"
          value={generalSettings?.supportEmail}
          onChange={(e) => {
            setGeneralSettings(prev => ({ ...prev, supportEmail: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Select
          label="Default Language"
          options={languageOptions}
          value={generalSettings?.defaultLanguage}
          onChange={(value) => {
            setGeneralSettings(prev => ({ ...prev, defaultLanguage: value }));
            setHasChanges(true);
          }}
        />
        
        <Select
          label="Timezone"
          options={timezoneOptions}
          value={generalSettings?.timezone}
          onChange={(value) => {
            setGeneralSettings(prev => ({ ...prev, timezone: value }));
            setHasChanges(true);
          }}
        />
      </div>

      <div className="space-y-4">
        <Checkbox
          label="Maintenance Mode"
          description="Enable to temporarily disable platform access"
          checked={generalSettings?.maintenanceMode}
          onChange={(e) => {
            setGeneralSettings(prev => ({ ...prev, maintenanceMode: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
        
        <Checkbox
          label="User Registration"
          description="Allow new users to register accounts"
          checked={generalSettings?.registrationEnabled}
          onChange={(e) => {
            setGeneralSettings(prev => ({ ...prev, registrationEnabled: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
        
        <Checkbox
          label="Email Verification Required"
          description="Require email verification for new accounts"
          checked={generalSettings?.emailVerificationRequired}
          onChange={(e) => {
            setGeneralSettings(prev => ({ ...prev, emailVerificationRequired: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="YooKassa Shop ID"
          value={paymentSettings?.yookassaShopId}
          onChange={(e) => {
            setPaymentSettings(prev => ({ ...prev, yookassaShopId: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="YooKassa Secret Key"
          type="password"
          value={paymentSettings?.yookassaSecretKey}
          onChange={(e) => {
            setPaymentSettings(prev => ({ ...prev, yookassaSecretKey: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Tax Rate (%)"
          type="number"
          value={paymentSettings?.taxRate}
          onChange={(e) => {
            setPaymentSettings(prev => ({ ...prev, taxRate: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
        
        <Select
          label="Currency"
          options={currencyOptions}
          value={paymentSettings?.currency}
          onChange={(value) => {
            setPaymentSettings(prev => ({ ...prev, currency: value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Minimum Payment Amount"
          type="number"
          value={paymentSettings?.minPaymentAmount}
          onChange={(e) => {
            setPaymentSettings(prev => ({ ...prev, minPaymentAmount: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Maximum Payment Amount"
          type="number"
          value={paymentSettings?.maxPaymentAmount}
          onChange={(e) => {
            setPaymentSettings(prev => ({ ...prev, maxPaymentAmount: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
      </div>

      <Checkbox
        label="Fiscal Receipts (54-FZ)"
        description="Generate fiscal receipts for all transactions"
        checked={paymentSettings?.fiscalReceiptsEnabled}
        onChange={(e) => {
          setPaymentSettings(prev => ({ ...prev, fiscalReceiptsEnabled: e?.target?.checked }));
          setHasChanges(true);
        }}
      />

      <Button
        variant="outline"
        onClick={() => testConnection('payment')}
        iconName="TestTube"
        iconPosition="left"
        iconSize={16}
      >
        Test YooKassa Connection
      </Button>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="OpenAI API Key"
          type="password"
          value={aiSettings?.openaiApiKey}
          onChange={(e) => {
            setAiSettings(prev => ({ ...prev, openaiApiKey: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Select
          label="Default AI Model"
          options={aiModelOptions}
          value={aiSettings?.defaultModel}
          onChange={(value) => {
            setAiSettings(prev => ({ ...prev, defaultModel: value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Max Tokens per Request"
          type="number"
          value={aiSettings?.maxTokensPerRequest}
          onChange={(e) => {
            setAiSettings(prev => ({ ...prev, maxTokensPerRequest: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Rate Limit per User (per hour)"
          type="number"
          value={aiSettings?.rateLimitPerUser}
          onChange={(e) => {
            setAiSettings(prev => ({ ...prev, rateLimitPerUser: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
      </div>

      <div className="space-y-4">
        <Checkbox
          label="Voice Tutor Enabled"
          description="Enable AI voice tutoring capabilities"
          checked={aiSettings?.voiceTutorEnabled}
          onChange={(e) => {
            setAiSettings(prev => ({ ...prev, voiceTutorEnabled: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
        
        <Checkbox
          label="Content Generation Enabled"
          description="Allow AI-powered course content generation"
          checked={aiSettings?.contentGenerationEnabled}
          onChange={(e) => {
            setAiSettings(prev => ({ ...prev, contentGenerationEnabled: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
      </div>

      <Button
        variant="outline"
        onClick={() => testConnection('ai')}
        iconName="TestTube"
        iconPosition="left"
        iconSize={16}
      >
        Test OpenAI Connection
      </Button>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="SMTP Host"
          value={emailSettings?.smtpHost}
          onChange={(e) => {
            setEmailSettings(prev => ({ ...prev, smtpHost: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="SMTP Port"
          type="number"
          value={emailSettings?.smtpPort}
          onChange={(e) => {
            setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="SMTP Username"
          value={emailSettings?.smtpUsername}
          onChange={(e) => {
            setEmailSettings(prev => ({ ...prev, smtpUsername: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="SMTP Password"
          type="password"
          value={emailSettings?.smtpPassword}
          onChange={(e) => {
            setEmailSettings(prev => ({ ...prev, smtpPassword: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="From Name"
          value={emailSettings?.fromName}
          onChange={(e) => {
            setEmailSettings(prev => ({ ...prev, fromName: e?.target?.value }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="From Email"
          type="email"
          value={emailSettings?.fromEmail}
          onChange={(e) => {
            setEmailSettings(prev => ({ ...prev, fromEmail: e?.target?.value }));
            setHasChanges(true);
          }}
        />
      </div>

      <Button
        variant="outline"
        onClick={() => testConnection('email')}
        iconName="TestTube"
        iconPosition="left"
        iconSize={16}
      >
        Test Email Configuration
      </Button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Session Timeout (hours)"
          type="number"
          value={securitySettings?.sessionTimeout}
          onChange={(e) => {
            setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Password Minimum Length"
          type="number"
          value={securitySettings?.passwordMinLength}
          onChange={(e) => {
            setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
        
        <Input
          label="Max Login Attempts"
          type="number"
          value={securitySettings?.maxLoginAttempts}
          onChange={(e) => {
            setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e?.target?.value) }));
            setHasChanges(true);
          }}
        />
      </div>

      <div className="space-y-4">
        <Checkbox
          label="Require Special Characters"
          description="Passwords must contain special characters"
          checked={securitySettings?.requireSpecialChars}
          onChange={(e) => {
            setSecuritySettings(prev => ({ ...prev, requireSpecialChars: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
        
        <Checkbox
          label="Two-Factor Authentication"
          description="Enable 2FA for all admin accounts"
          checked={securitySettings?.twoFactorEnabled}
          onChange={(e) => {
            setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
        
        <Checkbox
          label="IP Whitelist"
          description="Restrict admin access to specific IP addresses"
          checked={securitySettings?.ipWhitelistEnabled}
          onChange={(e) => {
            setSecuritySettings(prev => ({ ...prev, ipWhitelistEnabled: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
        
        <Checkbox
          label="Brute Force Protection"
          description="Automatically block suspicious login attempts"
          checked={securitySettings?.bruteForceProtection}
          onChange={(e) => {
            setSecuritySettings(prev => ({ ...prev, bruteForceProtection: e?.target?.checked }));
            setHasChanges(true);
          }}
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'ai':
        return renderAISettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Configuration</h2>
          <p className="text-muted-foreground">
            Manage platform settings and integrations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
      {/* Changes Indicator */}
      {hasChanges && (
        <div className="glass rounded-lg p-4 border-l-4 border-warning">
          <div className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <span className="font-medium">Unsaved Changes</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            You have unsaved changes. Don't forget to save your configuration.
          </p>
        </div>
      )}
      {/* Settings Container */}
      <div className="glass-lg rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-smooth ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;