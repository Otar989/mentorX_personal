import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortDropdown = ({ 
  currentSort = 'relevance', 
  onSortChange,
  resultsCount = 0,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'По релевантности', icon: 'Target' },
    { value: 'popularity', label: 'По популярности', icon: 'TrendingUp' },
    { value: 'newest', label: 'Сначала новые', icon: 'Clock' },
    { value: 'oldest', label: 'Сначала старые', icon: 'History' },
    { value: 'price-low', label: 'Сначала дешевые', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Сначала дорогие', icon: 'ArrowDown' },
    { value: 'rating', label: 'По рейтингу', icon: 'Star' },
    { value: 'duration-short', label: 'Сначала короткие', icon: 'Clock' },
    { value: 'duration-long', label: 'Сначала длинные', icon: 'Clock' }
  ];

  const currentOption = sortOptions.find(option => option.value === currentSort);

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Найдено: <span className="font-medium text-foreground">{resultsCount.toLocaleString('ru-RU')}</span> курсов
      </div>

      {/* Sort Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={toggleDropdown}
          iconName={currentOption?.icon || 'Target'}
          iconPosition="left"
          iconSize={16}
          className="gap-2 min-w-[180px] justify-between"
        >
          <span>{currentOption?.label || 'Сортировка'}</span>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 glass-lg rounded-xl border border-white/20 shadow-glass-lg z-dropdown py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-smooth hover:bg-white/10 ${
                  currentSort === option.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                <Icon 
                  name={option.icon} 
                  size={16} 
                  className={currentSort === option.value ? 'text-primary' : 'text-muted-foreground'}
                />
                <span className="font-medium text-sm">{option.label}</span>
                {currentSort === option.value && (
                  <Icon name="Check" size={16} className="ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;