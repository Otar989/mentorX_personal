import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';
import Icon from '../AppIcon';

const ThemeToggle = ({ className = '', variant = 'glass' }) => {
  const { currentTheme, toggleTheme, theme, setTheme } = useTheme();

  const themeOptions = [
    { id: 'light', label: 'Light', icon: 'Sun' },
    { id: 'dark', label: 'Dark', icon: 'Moon' },
    { id: 'system', label: 'System', icon: 'Monitor' }
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Quick Toggle Button */}
      <Button
        variant={variant}
        size="icon"
        onClick={toggleTheme}
        className="glass-subtle hover:glass-hover transition-all duration-300"
        title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      >
        <Icon 
          name={currentTheme === 'light' ? 'Moon' : 'Sun'} 
          size={18}
          className="transition-transform duration-300 hover:scale-110"
        />
      </Button>
      {/* Dropdown Menu for Theme Options */}
      <div className="relative group">
        <Button
          variant={variant}
          size="icon"
          className="glass-subtle hover:glass-hover transition-all duration-300 opacity-70 group-hover:opacity-100"
          title="Theme options"
        >
          <Icon name="ChevronDown" size={14} />
        </Button>
        
        <div className="absolute right-0 top-full mt-2 glass-panel rounded-xl shadow-glass-lg border border-glass-border backdrop-blur-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px]">
          {themeOptions?.map((option) => (
            <button
              key={option?.id}
              onClick={() => setTheme(option?.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 hover:bg-glass-hover first:rounded-t-xl last:rounded-b-xl ${
                theme === option?.id 
                  ? 'bg-glass-active text-primary font-medium' :'text-foreground/80 hover:text-foreground'
              }`}
            >
              <Icon name={option?.icon} size={16} />
              {option?.label}
              {theme === option?.id && (
                <Icon name="Check" size={14} className="ml-auto text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;