import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';


const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  isOpen = false, 
  onClose = () => {},
  className = '' 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const difficultyOptions = [
    { value: 'beginner', label: 'Начинающий' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];

  const durationOptions = [
    { value: '0-5', label: 'До 5 часов' },
    { value: '5-20', label: '5-20 часов' },
    { value: '20-50', label: '20-50 часов' },
    { value: '50+', label: 'Более 50 часов' }
  ];

  const languageOptions = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' }
  ];

  const priceOptions = [
    { value: 'free', label: 'Бесплатные' },
    { value: '0-5000', label: 'До 5 000 ₽' },
    { value: '5000-15000', label: '5 000 - 15 000 ₽' },
    { value: '15000+', label: 'Более 15 000 ₽' }
  ];

  const categoryOptions = [
    { value: 'programming', label: 'Программирование' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'design', label: 'Дизайн' },
    { value: 'marketing', label: 'Маркетинг' },
    { value: 'business', label: 'Бизнес' },
    { value: 'languages', label: 'Языки' }
  ];

  const featureOptions = [
    { value: 'ai-tutor', label: 'AI-наставник' },
    { value: 'certificates', label: 'Сертификаты' },
    { value: 'projects', label: 'Практические проекты' },
    { value: 'community', label: 'Сообщество' },
    { value: 'mobile-app', label: 'Мобильное приложение' },
    { value: 'offline-access', label: 'Офлайн доступ' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
  };

  const handleMultiSelectChange = (filterType, option, checked) => {
    const currentValues = localFilters[filterType] || [];
    const newValues = checked 
      ? [...currentValues, option]
      : currentValues.filter(item => item !== option);
    
    handleFilterChange(filterType, newValues);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const emptyFilters = {
      categories: [],
      difficulty: [],
      duration: [],
      language: [],
      price: [],
      features: [],
      rating: 0,
      hasDiscount: false,
      hasTrial: false
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(localFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) count += value.length;
      else if (typeof value === 'boolean' && value) count += 1;
      else if (typeof value === 'number' && value > 0) count += 1;
    });
    return count;
  };

  const FilterSection = ({ title, children }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-foreground">{title}</h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const CheckboxGroup = ({ options, filterType, title }) => (
    <FilterSection title={title}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={(localFilters[filterType] || []).includes(option.value)}
          onChange={(e) => handleMultiSelectChange(filterType, option.value, e.target.checked)}
          size="sm"
        />
      ))}
    </FilterSection>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-80 lg:w-full max-w-sm lg:max-w-none
        glass-lg lg:glass border-r lg:border-r-0 border-white/20
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Фильтры</h3>
              {getActiveFilterCount() > 0 && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Categories */}
            <CheckboxGroup 
              options={categoryOptions}
              filterType="categories"
              title="Категории"
            />

            {/* Difficulty */}
            <CheckboxGroup 
              options={difficultyOptions}
              filterType="difficulty"
              title="Уровень сложности"
            />

            {/* Duration */}
            <CheckboxGroup 
              options={durationOptions}
              filterType="duration"
              title="Продолжительность"
            />

            {/* Language */}
            <CheckboxGroup 
              options={languageOptions}
              filterType="language"
              title="Язык"
            />

            {/* Price */}
            <CheckboxGroup 
              options={priceOptions}
              filterType="price"
              title="Цена"
            />

            {/* Rating */}
            <FilterSection title="Рейтинг">
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={localFilters.rating === rating}
                      onChange={() => handleFilterChange('rating', rating)}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={i < rating ? "text-amber-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                      <span className="text-sm">и выше</span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Features */}
            <CheckboxGroup 
              options={featureOptions}
              filterType="features"
              title="Особенности"
            />

            {/* Special Offers */}
            <FilterSection title="Специальные предложения">
              <Checkbox
                label="Со скидкой"
                checked={localFilters.hasDiscount || false}
                onChange={(e) => handleFilterChange('hasDiscount', e.target.checked)}
                size="sm"
              />
              <Checkbox
                label="Пробный урок"
                checked={localFilters.hasTrial || false}
                onChange={(e) => handleFilterChange('hasTrial', e.target.checked)}
                size="sm"
              />
            </FilterSection>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 space-y-3">
            <Button
              variant="default"
              onClick={applyFilters}
              className="w-full"
              iconName="Filter"
              iconPosition="left"
              iconSize={16}
            >
              Применить фильтры
            </Button>
            
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full"
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
            >
              Сбросить все
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;