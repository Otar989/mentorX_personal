import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ 
  onSearch, 
  onSuggestionSelect,
  placeholder = "Поиск курсов, уроков...",
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Mock suggestions data
  const mockSuggestions = [
    { id: 1, text: 'React Fundamentals', type: 'course', category: 'Программирование' },
    { id: 2, text: 'JavaScript ES6+', type: 'course', category: 'Программирование' },
    { id: 3, text: 'Python для начинающих', type: 'course', category: 'Программирование' },
    { id: 4, text: 'Data Science с Python', type: 'course', category: 'Data Science' },
    { id: 5, text: 'UI/UX Design', type: 'course', category: 'Дизайн' },
    { id: 6, text: 'Machine Learning', type: 'lesson', category: 'Data Science' },
    { id: 7, text: 'React Hooks', type: 'lesson', category: 'Программирование' },
    { id: 8, text: 'CSS Grid Layout', type: 'lesson', category: 'Веб-разработка' },
    { id: 9, text: 'Node.js Backend', type: 'course', category: 'Программирование' },
    { id: 10, text: 'TypeScript Advanced', type: 'course', category: 'Программирование' }
  ];

  const popularSearches = [
    'React', 'JavaScript', 'Python', 'Data Science', 'Machine Learning', 'UI/UX'
  ];

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.length > 0) {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          const filtered = mockSuggestions.filter(item =>
            item.text.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered.slice(0, 8));
          setIsLoading(false);
          setIsOpen(true);
        }, 300);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    onSuggestionSelect?.(suggestion);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    if (query.length === 0) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type) => {
    return type === 'course' ? 'BookOpen' : 'FileText';
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-3 glass rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground"
          />
          
          {/* Clear Button */}
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6"
            >
              <Icon name="X" size={14} />
            </Button>
          )}
          
          {/* Search Button */}
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Icon name="Search" size={18} />
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 glass-lg rounded-xl border border-white/20 shadow-glass-lg z-dropdown max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Поиск...</span>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-smooth ${
                    index === selectedIndex ? 'bg-white/10' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    suggestion.type === 'course' ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    <Icon 
                      name={getSuggestionIcon(suggestion.type)} 
                      size={16} 
                      className={suggestion.type === 'course' ? 'text-primary' : 'text-secondary'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{suggestion.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {suggestion.category} • {suggestion.type === 'course' ? 'Курс' : 'Урок'}
                    </div>
                  </div>
                  <Icon name="ArrowUpRight" size={14} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : query.length === 0 ? (
            <div className="p-4">
              <h4 className="font-medium text-sm mb-3">Популярные запросы</h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setQuery(search);
                      onSearch(search);
                      setIsOpen(false);
                    }}
                    className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-smooth"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <Icon name="Search" size={32} className="mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Ничего не найдено по запросу "{query}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Попробуйте изменить поисковый запрос
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;