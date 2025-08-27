import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import RoleSidebar from '../../components/ui/RoleSidebar';
import CourseCard from './components/CourseCard';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import CoursePreviewModal from './components/CoursePreviewModal';
import LoadingSkeleton from './components/LoadingSkeleton';

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('relevance');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [wishlistedCourses, setWishlistedCourses] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreCourses, setHasMoreCourses] = useState(true);

  const [filters, setFilters] = useState({
    categories: [],
    difficulty: [],
    duration: [],
    language: [],
    price: [],
    features: [],
    rating: 0,
    hasDiscount: false,
    hasTrial: false
  });

  // Mock courses data
  const [allCourses] = useState([
    {
      id: 1,
      title: 'React Fundamentals: Полное руководство',
      instructor: 'Александр Петров',
      category: 'Программирование',
      difficulty: 'Начинающий',
      duration: 24,
      lessonCount: 45,
      studentCount: '2,341',
      rating: 4.8,
      reviewCount: 892,
      price: 12900,
      originalPrice: 18900,
      discount: 32,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      language: 'Русский',
      isEnrolled: false,
      hasTrial: true,
      keyFeatures: [
        'Современный React 18',
        'Hooks и функциональные компоненты',
        'State Management с Redux',
        'Практические проекты'
      ],
      description: `Изучите React с нуля до профессионального уровня. Курс включает все современные возможности React 18, включая Hooks, Context API, и лучшие практики разработки.`
    },
    {
      id: 2,
      title: 'Python для Data Science',
      instructor: 'Мария Иванова',
      category: 'Data Science',
      difficulty: 'Средний',
      duration: 36,
      lessonCount: 68,
      studentCount: '1,876',
      rating: 4.9,
      reviewCount: 654,
      price: 15900,
      originalPrice: null,
      discount: null,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
      language: 'Русский',
      isEnrolled: true,
      progress: 67,
      hasTrial: false,
      keyFeatures: [
        'NumPy и Pandas',
        'Машинное обучение',
        'Визуализация данных',
        'Реальные проекты'
      ],
      description: `Полный курс по анализу данных с Python. Изучите библиотеки NumPy, Pandas, Matplotlib и основы машинного обучения.`
    },
    {
      id: 3,
      title: 'UI/UX Design: От идеи до прототипа',
      instructor: 'Елена Смирнова',
      category: 'Дизайн',
      difficulty: 'Начинающий',
      duration: 18,
      lessonCount: 32,
      studentCount: '3,245',
      rating: 4.7,
      reviewCount: 1203,
      price: 0,
      originalPrice: null,
      discount: null,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      language: 'Русский',
      isEnrolled: false,
      hasTrial: true,
      keyFeatures: [
        'Принципы UX дизайна',
        'Работа в Figma',
        'Создание прототипов',
        'Пользовательские исследования'
      ],
      description: `Изучите основы UI/UX дизайна и научитесь создавать удобные интерфейсы. Курс включает работу в Figma и создание интерактивных прототипов.`
    },
    {
      id: 4,
      title: 'JavaScript Advanced: ES6+ и современные возможности',
      instructor: 'Дмитрий Козлов',
      category: 'Программирование',
      difficulty: 'Продвинутый',
      duration: 28,
      lessonCount: 52,
      studentCount: '1,567',
      rating: 4.9,
      reviewCount: 423,
      price: 16900,
      originalPrice: 22900,
      discount: 26,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
      language: 'Русский',
      isEnrolled: false,
      hasTrial: false,
      keyFeatures: [
        'ES6+ синтаксис',
        'Асинхронное программирование',
        'Модули и сборка',
        'Тестирование кода'
      ],
      description: `Углубленное изучение JavaScript для опытных разработчиков. Изучите современные возможности языка и лучшие практики.`
    },
    {
      id: 5,
      title: 'Digital Marketing: Полный курс',
      instructor: 'Анна Волкова',
      category: 'Маркетинг',
      difficulty: 'Средний',
      duration: 32,
      lessonCount: 58,
      studentCount: '2,890',
      rating: 4.6,
      reviewCount: 756,
      price: 13900,
      originalPrice: null,
      discount: null,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      language: 'Русский',
      isEnrolled: false,
      hasTrial: true,
      keyFeatures: [
        'SEO и контент-маркетинг',
        'Социальные сети',
        'Email маркетинг',
        'Аналитика и метрики'
      ],
      description: `Комплексный курс по цифровому маркетингу. Изучите все основные каналы продвижения и научитесь создавать эффективные кампании.`
    },
    {
      id: 6,
      title: 'Machine Learning с TensorFlow',
      instructor: 'Сергей Николаев',
      category: 'Data Science',
      difficulty: 'Продвинутый',
      duration: 42,
      lessonCount: 78,
      studentCount: '987',
      rating: 4.8,
      reviewCount: 234,
      price: 19900,
      originalPrice: 24900,
      discount: 20,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      language: 'English',
      isEnrolled: false,
      hasTrial: false,
      keyFeatures: [
        'Нейронные сети',
        'Глубокое обучение',
        'Computer Vision',
        'NLP обработка текста'
      ],
      description: `Продвинутый курс по машинному обучению с использованием TensorFlow. Изучите создание и обучение нейронных сетей.`
    },
    {
      id: 7,
      title: 'Бизнес-аналитика: От данных к решениям',
      instructor: 'Ольга Морозова',
      category: 'Бизнес',
      difficulty: 'Средний',
      duration: 26,
      lessonCount: 48,
      studentCount: '1,432',
      rating: 4.7,
      reviewCount: 389,
      price: 14900,
      originalPrice: null,
      discount: null,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      language: 'Русский',
      isEnrolled: true,
      progress: 23,
      hasTrial: true,
      keyFeatures: [
        'Анализ бизнес-процессов',
        'Работа с данными',
        'Создание отчетов',
        'Принятие решений'
      ],
      description: `Научитесь анализировать бизнес-данные и принимать обоснованные решения. Курс включает работу с Excel, SQL и BI-инструментами.`
    },
    {
      id: 8,
      title: 'English for IT Professionals',
      instructor: 'James Wilson',
      category: 'Языки',
      difficulty: 'Средний',
      duration: 20,
      lessonCount: 40,
      studentCount: '2,156',
      rating: 4.5,
      reviewCount: 567,
      price: 8900,
      originalPrice: 11900,
      discount: 25,
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
      language: 'English',
      isEnrolled: false,
      hasTrial: true,
      keyFeatures: [
        'Техническая лексика',
        'Деловое общение',
        'Презентации на английском',
        'Собеседования'
      ],
      description: `Специализированный курс английского языка для IT-специалистов. Изучите техническую лексику и навыки делового общения.`
    }
  ]);

  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Initialize courses on component mount
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredCourses(allCourses);
      setDisplayedCourses(allCourses.slice(0, 8));
      setIsLoading(false);
    }, 1000);
  }, [allCourses]);

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...allCourses];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(course => {
        const categoryMap = {
          'programming': 'Программирование',
          'data-science': 'Data Science',
          'design': 'Дизайн',
          'marketing': 'Маркетинг',
          'business': 'Бизнес',
          'languages': 'Языки'
        };
        return filters.categories.some(cat => categoryMap[cat] === course.category);
      });
    }

    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(course => {
        const difficultyMap = {
          'beginner': 'Начинающий',
          'intermediate': 'Средний',
          'advanced': 'Продвинутый'
        };
        return filters.difficulty.some(diff => difficultyMap[diff] === course.difficulty);
      });
    }

    // Apply duration filter
    if (filters.duration.length > 0) {
      filtered = filtered.filter(course => {
        return filters.duration.some(duration => {
          switch (duration) {
            case '0-5': return course.duration <= 5;
            case '5-20': return course.duration > 5 && course.duration <= 20;
            case '20-50': return course.duration > 20 && course.duration <= 50;
            case '50+': return course.duration > 50;
            default: return true;
          }
        });
      });
    }

    // Apply language filter
    if (filters.language.length > 0) {
      filtered = filtered.filter(course => {
        const languageMap = {
          'ru': 'Русский',
          'en': 'English'
        };
        return filters.language.some(lang => languageMap[lang] === course.language);
      });
    }

    // Apply price filter
    if (filters.price.length > 0) {
      filtered = filtered.filter(course => {
        return filters.price.some(price => {
          switch (price) {
            case 'free': return course.price === 0;
            case '0-5000': return course.price > 0 && course.price <= 5000;
            case '5000-15000': return course.price > 5000 && course.price <= 15000;
            case '15000+': return course.price > 15000;
            default: return true;
          }
        });
      });
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(course => course.rating >= filters.rating);
    }

    // Apply special offers filters
    if (filters.hasDiscount) {
      filtered = filtered.filter(course => course.discount);
    }

    if (filters.hasTrial) {
      filtered = filtered.filter(course => course.hasTrial);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (currentSort) {
        case 'popularity':
          return parseInt(b.studentCount.replace(',', '')) - parseInt(a.studentCount.replace(',', ''));
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration-short':
          return a.duration - b.duration;
        case 'duration-long':
          return b.duration - a.duration;
        default: // relevance
          return 0;
      }
    });

    setFilteredCourses(filtered);
    setDisplayedCourses(filtered.slice(0, 8));
    setCurrentPage(1);
    setHasMoreCourses(filtered.length > 8);
  }, [allCourses, searchQuery, filters, currentSort]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.text);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterRemove = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (Array.isArray(newFilters[filterType])) {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
    } else {
      newFilters[filterType] = filterType === 'rating' ? 0 : false;
    }
    
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({
      categories: [],
      difficulty: [],
      duration: [],
      language: [],
      price: [],
      features: [],
      rating: 0,
      hasDiscount: false,
      hasTrial: false
    });
  };

  const handleSortChange = (sort) => {
    setCurrentSort(sort);
  };

  const handleCourseEnroll = (course) => {
    console.log('Enrolling in course:', course.title);
    navigate('/course-detail', { state: { courseId: course.id } });
  };

  const handleCoursePreview = (course) => {
    setSelectedCourse(course);
    setIsPreviewModalOpen(true);
  };

  const handleWishlist = (courseId) => {
    setWishlistedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const loadMoreCourses = useCallback(() => {
    if (isLoadingMore || !hasMoreCourses) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * 8;
      const endIndex = startIndex + 8;
      const newCourses = filteredCourses.slice(startIndex, endIndex);
      
      setDisplayedCourses(prev => [...prev, ...newCourses]);
      setCurrentPage(nextPage);
      setHasMoreCourses(endIndex < filteredCourses.length);
      setIsLoadingMore(false);
    }, 800);
  }, [currentPage, filteredCourses, hasMoreCourses, isLoadingMore]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreCourses();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreCourses]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AdaptiveNavbar
        userRole="student"
        currentPath="/course-catalog"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <RoleSidebar
        userRole="student"
        currentPath="/course-catalog"
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } pt-16`}>
        <div className="flex">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                className="h-full"
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Каталог курсов
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Найдите идеальный курс для развития ваших навыков
                    </p>
                  </div>

                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterPanelOpen(true)}
                    iconName="Filter"
                    iconPosition="left"
                    iconSize={16}
                    className="lg:hidden"
                  >
                    Фильтры
                  </Button>
                </div>

                {/* Search Bar */}
                <SearchBar
                  onSearch={handleSearch}
                  onSuggestionSelect={handleSuggestionSelect}
                  placeholder="Поиск курсов, преподавателей, тем..."
                />

                {/* Filter Chips and Sort */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <FilterChips
                    filters={filters}
                    onFilterRemove={handleFilterRemove}
                    onClearAll={handleClearAllFilters}
                  />
                  
                  <SortDropdown
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                    resultsCount={filteredCourses.length}
                  />
                </div>
              </div>

              {/* Course Grid */}
              {isLoading ? (
                <LoadingSkeleton type="card" count={8} />
              ) : displayedCourses.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onEnroll={handleCourseEnroll}
                        onPreview={handleCoursePreview}
                        onWishlist={handleWishlist}
                        isWishlisted={wishlistedCourses.has(course.id)}
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  {isLoadingMore && (
                    <LoadingSkeleton type="card" count={4} />
                  )}

                  {!hasMoreCourses && displayedCourses.length > 8 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Вы просмотрели все доступные курсы
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Icon name="Search" size={64} className="mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Курсы не найдены</h3>
                  <p className="text-muted-foreground mb-6">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearAllFilters}
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
      />

      {/* Course Preview Modal */}
      <CoursePreviewModal
        course={selectedCourse}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onEnroll={handleCourseEnroll}
      />
    </div>
  );
};

export default CourseCatalog;