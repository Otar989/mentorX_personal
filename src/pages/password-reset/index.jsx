import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request', 'sent', 'reset'
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendReset = async (e) => {
    e?.preventDefault();
    if (!email?.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('sent');
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (!resetCode?.trim()) return;
    setStep('reset');
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/login')}
          className="glass-subtle hover:glass-hover"
        >
          <Icon name="ArrowLeft" size={18} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
            <Icon name="GraduationCap" size={20} className="text-primary" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MentorX
          </span>
        </div>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-3xl border border-glass-border backdrop-blur-20 p-8 shadow-glass-lg"
        >
          {/* Step 1: Request Reset */}
          {step === 'request' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 glass-subtle rounded-2xl flex items-center justify-center">
                  <Icon name="KeyRound" size={24} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-onBackground mb-2">
                  Reset Password
                </h1>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSendReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-onBackground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e?.target?.value)}
                      className="pl-12 glass-panel border-glass-border rounded-2xl h-12"
                      required
                    />
                    <Icon
                      name="Mail"
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full glass rounded-2xl h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                  ) : (
                    <Icon name="Send" size={18} className="mr-2" />
                  )}
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Email Sent */}
          {step === 'sent' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 glass-subtle rounded-2xl flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-success" />
                </div>
                <h1 className="text-2xl font-bold text-onBackground mb-2">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground mb-4">
                  We've sent a reset code to
                </p>
                <p className="font-medium text-onBackground">{email}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-onBackground mb-2">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e?.target?.value)}
                    className="glass-panel border-glass-border rounded-2xl h-12 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={handleVerifyCode}
                  variant="default"
                  size="lg"
                  className="w-full glass rounded-2xl h-12"
                  disabled={resetCode?.length !== 6}
                >
                  <Icon name="CheckCircle" size={18} className="mr-2" />
                  Verify Code
                </Button>

                <button
                  onClick={() => setStep('request')}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 glass-subtle rounded-2xl flex items-center justify-center">
                  <Icon name="Lock" size={24} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-onBackground mb-2">
                  New Password
                </h1>
                <p className="text-muted-foreground">
                  Create a strong password for your account
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-onBackground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e?.target?.value)}
                      className="pl-12 pr-12 glass-panel border-glass-border rounded-2xl h-12"
                      required
                    />
                    <Icon
                      name="Lock"
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-onBackground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e?.target?.value)}
                      className="pl-12 glass-panel border-glass-border rounded-2xl h-12"
                      required
                    />
                    <Icon
                      name="Lock"
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-error text-sm mt-2">Passwords don't match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full glass rounded-2xl h-12"
                  disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                >
                  {isLoading ? (
                    <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                  ) : (
                    <Icon name="Check" size={18} className="mr-2" />
                  )}
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-glass-border">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Icon name="ArrowLeft" size={14} />
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PasswordResetPage;