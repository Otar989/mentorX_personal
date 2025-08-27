import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CourseTabs = ({ course, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Обзор', icon: 'Info' },
    { id: 'curriculum', label: 'Программа', icon: 'BookOpen' },
    { id: 'instructor', label: 'Преподаватель', icon: 'User' },
    { id: 'reviews', label: 'Отзывы', icon: 'Star' }
  ];

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => onTabChange(tab?.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
                {tab?.id === 'reviews' && (
                  <span className="ml-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {course?.reviewCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'overview' && <OverviewTab course={course} />}
          {activeTab === 'curriculum' && <CurriculumTab course={course} />}
          {activeTab === 'instructor' && <InstructorTab instructor={course?.instructor} />}
          {activeTab === 'reviews' && <ReviewsTab reviews={course?.reviews} rating={course?.rating} reviewCount={course?.reviewCount} />}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ course }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        {/* Course Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">О курсе</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              {course?.fullDescription}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Этот курс подходит как для начинающих разработчиков, так и для тех, кто хочет углубить свои знания в современной веб-разработке. Вы изучите лучшие практики, современные инструменты и получите практический опыт работы с реальными проектами.
            </p>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div>
          <h3 className="text-xl font-bold mb-4">Чему вы научитесь</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course?.learningOutcomes?.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Check" size={14} className="text-success" />
                </div>
                <span className="text-sm">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <h3 className="text-xl font-bold mb-4">Требования</h3>
          <div className="space-y-3">
            {course?.prerequisites?.map((prerequisite, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="BookOpen" size={14} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{prerequisite}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Features */}
        <div>
          <h3 className="text-xl font-bold mb-4">Особенности курса</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course?.features?.map((feature, index) => (
              <div key={index} className="glass rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={feature?.icon} size={20} className="text-primary" />
                  </div>
                  <h4 className="font-semibold">{feature?.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{feature?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div className="lg:col-span-4">
        <div className="glass-lg rounded-2xl p-6 sticky top-24">
          <h3 className="font-bold mb-4">Детали курса</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Уровень:</span>
              <span className="font-medium">{course?.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Продолжительность:</span>
              <span className="font-medium">{course?.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Уроков:</span>
              <span className="font-medium">{course?.lessonsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Заданий:</span>
              <span className="font-medium">{course?.assignmentsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Язык:</span>
              <span className="font-medium">{course?.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Сертификат:</span>
              <span className="font-medium text-success">Да</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="font-semibold mb-3">Теги</h4>
            <div className="flex flex-wrap gap-2">
              {course?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurriculumTab = ({ course }) => {
  const [expandedModules, setExpandedModules] = useState({ 0: true });

  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev?.[moduleIndex]
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Программа курса</h2>
          <p className="text-muted-foreground">
            {course?.modules?.length} модулей • {course?.lessonsCount} уроков • {course?.totalDuration}
          </p>
        </div>

        <div className="space-y-4">
          {course?.modules?.map((module, moduleIndex) => (
            <div key={moduleIndex} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full p-6 text-left hover:bg-white/5 transition-smooth"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-primary">
                        Модуль {moduleIndex + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {module.lessons?.length} уроков • {module.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{module.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                  </div>
                  <Icon
                    name="ChevronDown"
                    size={20}
                    className={`text-muted-foreground transition-transform ${
                      expandedModules?.[moduleIndex] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {expandedModules?.[moduleIndex] && (
                <div className="border-t border-white/10">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-smooth border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <Icon
                            name={lesson?.type === 'video' ? 'Play' : lesson?.type === 'quiz' ? 'HelpCircle' : 'FileText'}
                            size={14}
                            className="text-muted-foreground"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{lesson?.title}</h4>
                          <p className="text-xs text-muted-foreground">{lesson?.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson?.isPreview && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            Превью
                          </span>
                        )}
                        {lesson?.isCompleted && (
                          <Icon name="CheckCircle" size={16} className="text-success" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Icon name="Play" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="glass-lg rounded-2xl p-6 sticky top-24">
          <h3 className="font-bold mb-4">Прогресс по курсу</h3>
          <div className="space-y-4">
            {course?.modules?.map((module, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Модуль {index + 1}</span>
                  <span className="text-muted-foreground">{module.progress || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="progress-ambient h-2 rounded-full transition-all duration-500"
                    style={{ width: `${module.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Button variant="outline" fullWidth iconName="Download" iconPosition="left">
              Скачать программу
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructorTab = ({ instructor }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
            <img
              src={instructor?.avatar}
              alt={instructor?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{instructor?.name}</h2>
            <p className="text-lg text-primary mb-3">{instructor?.title}</p>
            <p className="text-muted-foreground">{instructor?.bio}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Опыт и достижения</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {instructor?.experience}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Другие курсы преподавателя</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instructor?.otherCourses?.map((course, index) => (
              <div key={index} className="glass rounded-xl p-4 hover:bg-white/5 transition-smooth cursor-pointer">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                  <img
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold mb-2">{course?.title}</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{course?.studentsCount} студентов</span>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-amber-400 fill-current" />
                    <span>{course?.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="glass-lg rounded-2xl p-6 sticky top-24">
          <h3 className="font-bold mb-4">Статистика преподавателя</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Студентов:</span>
              <span className="font-medium">{instructor?.totalStudents?.toLocaleString('ru-RU')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Курсов:</span>
              <span className="font-medium">{instructor?.coursesCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Рейтинг:</span>
              <div className="flex items-center gap-1">
                <Icon name="Star" size={14} className="text-amber-400 fill-current" />
                <span className="font-medium">{instructor?.rating}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Отзывов:</span>
              <span className="font-medium">{instructor?.reviewsCount}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="font-semibold mb-3">Социальные сети</h4>
            <div className="flex gap-3">
              {instructor?.socialLinks?.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(link?.url, '_blank')}
                >
                  <Icon name={link?.platform} size={16} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsTab = ({ reviews, rating, reviewCount }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'highest', label: 'Высокий рейтинг' },
    { value: 'lowest', label: 'Низкий рейтинг' }
  ];

  const ratingDistribution = [
    { stars: 5, count: 156, percentage: 78 },
    { stars: 4, count: 32, percentage: 16 },
    { stars: 3, count: 8, percentage: 4 },
    { stars: 2, count: 3, percentage: 1.5 },
    { stars: 1, count: 1, percentage: 0.5 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e?.target?.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Все оценки</option>
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews?.map((review, index) => (
            <div key={index} className="glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <img
                  src={review?.avatar}
                  alt={review?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{review?.name}</h4>
                      <p className="text-sm text-muted-foreground">{review?.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={i < review?.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{review?.comment}</p>
                  
                  {review?.helpful && (
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
                        <Icon name="ThumbsUp" size={14} />
                        Полезно ({review?.helpful})
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
                        <Icon name="MessageSquare" size={14} />
                        Ответить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" iconName="ChevronDown" iconPosition="right">
            Показать еще отзывы
          </Button>
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="glass-lg rounded-2xl p-6 sticky top-24">
          <h3 className="font-bold mb-4">Рейтинг курса</h3>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{rating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={20}
                  className={i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {reviewCount} отзывов
            </p>
          </div>

          <div className="space-y-3">
            {ratingDistribution?.map((item) => (
              <div key={item?.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{item?.stars}</span>
                  <Icon name="Star" size={12} className="text-amber-400 fill-current" />
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item?.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{item?.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Button variant="outline" fullWidth iconName="MessageSquare" iconPosition="left">
              Оставить отзыв
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTabs;