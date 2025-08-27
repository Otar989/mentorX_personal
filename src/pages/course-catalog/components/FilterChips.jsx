import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ 
  filters, 
  onFilterRemove, 
  onClearAll,
  className = '' 
}) => {
  const getFilterChips = () => {
    const chips = [];

    // Categories
    if (filters.categories?.length > 0) {
      filters.categories.forEach(category => {
        const categoryLabels = {
          'programming': 'Программирование',
          'data-science': 'Data Science',
          'design': 'Дизайн',
          'marketing': 'Маркетинг',
          'business': 'Бизнес',
          'languages': 'Языки'
        };
        chips.push({
          id: `category-${category}`,
          label: categoryLabels[category] || category,
          type: 'categories',
          value: category
        });
      });
    }

    // Difficulty
    if (filters.difficulty?.length > 0) {
      filters.difficulty.forEach(level => {
        const difficultyLabels = {
          'beginner': 'Начинающий',
          'intermediate': 'Средний',
          'advanced': 'Продвинутый'
        };
        chips.push({
          id: `difficulty-${level}`,
          label: difficultyLabels[level] || level,
          type: 'difficulty',
          value: level
        });
      });
    }

    // Duration
    if (filters.duration?.length > 0) {
      filters.duration.forEach(duration => {
        const durationLabels = {
          '0-5': 'До 5 часов',
          '5-20': '5-20 часов',
          '20-50': '20-50 часов',
          '50+': 'Более 50 часов'
        };
        chips.push({
          id: `duration-${duration}`,
          label: durationLabels[duration] || duration,
          type: 'duration',
          value: duration
        });
      });
    }

    // Language
    if (filters.language?.length > 0) {
      filters.language.forEach(lang => {
        const languageLabels = {
          'ru': 'Русский',
          'en': 'English'
        };
        chips.push({
          id: `language-${lang}`,
          label: languageLabels[lang] || lang,
          type: 'language',
          value: lang
        });
      });
    }

    // Price
    if (filters.price?.length > 0) {
      filters.price.forEach(price => {
        const priceLabels = {
          'free': 'Бесплатные',
          '0-5000': 'До 5 000 ₽',
          '5000-15000': '5 000 - 15 000 ₽',
          '15000+': 'Более 15 000 ₽'
        };
        chips.push({
          id: `price-${price}`,
          label: priceLabels[price] || price,
          type: 'price',
          value: price
        });
      });
    }

    // Features
    if (filters.features?.length > 0) {
      filters.features.forEach(feature => {
        const featureLabels = {
          'ai-tutor': 'AI-наставник',
          'certificates': 'Сертификаты',
          'projects': 'Практические проекты',
          'community': 'Сообщество',
          'mobile-app': 'Мобильное приложение',
          'offline-access': 'Офлайн доступ'
        };
        chips.push({
          id: `feature-${feature}`,
          label: featureLabels[feature] || feature,
          type: 'features',
          value: feature
        });
      });
    }

    // Rating
    if (filters.rating && filters.rating > 0) {
      chips.push({
        id: `rating-${filters.rating}`,
        label: `${filters.rating}+ звезд`,
        type: 'rating',
        value: filters.rating
      });
    }

    // Special offers
    if (filters.hasDiscount) {
      chips.push({
        id: 'discount',
        label: 'Со скидкой',
        type: 'hasDiscount',
        value: true
      });
    }

    if (filters.hasTrial) {
      chips.push({
        id: 'trial',
        label: 'Пробный урок',
        type: 'hasTrial',
        value: true
      });
    }

    return chips;
  };

  const chips = getFilterChips();

  const handleChipRemove = (chip) => {
    onFilterRemove(chip.type, chip.value);
  };

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium transition-smooth hover:bg-primary/20"
          >
            <span>{chip.label}</span>
            <button
              onClick={() => handleChipRemove(chip)}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary/20 transition-smooth"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Clear All Button */}
      {chips.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          iconName="X"
          iconPosition="left"
          iconSize={14}
          className="text-muted-foreground hover:text-foreground"
        >
          Очистить все
        </Button>
      )}
    </div>
  );
};

export default FilterChips;