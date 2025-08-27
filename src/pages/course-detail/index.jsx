import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CourseHero from './components/CourseHero';
import CourseTabs from './components/CourseTabs';
import RelatedCourses from './components/RelatedCourses';
import CoursePreview from './components/CoursePreview';
import EnrollmentModal from './components/EnrollmentModal';
import CourseFAQ from './components/CourseFAQ';

const CourseDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userProgress, setUserProgress] = useState(0);

  // Mock course data
  const courseData = {
    id: 'react-fundamentals-2024',
    title: 'React 18 Fundamentals: Полный курс современной веб-разработки',
    description: 'Изучите React 18 с нуля до продвинутого уровня. Hooks, Context API, Server Components и многое другое.',
    fullDescription: `Этот комплексный курс по React 18 предназначен для разработчиков, которые хотят освоить современную веб-разработку с использованием самой популярной JavaScript библиотеки.\n\nВы изучите все ключевые концепции React, включая компоненты, состояние, эффекты, контекст и новейшие возможности React 18. Курс включает практические проекты, которые помогут вам закрепить полученные знания и создать портфолио.`,
    level: 'Средний',
    duration: '12 недель',
    lessonsCount: 48,
    assignmentsCount: 15,
    totalDuration: '24 часа',
    language: 'Русский',
    price: 24990,
    originalPrice: 34990,
    discount: 30,
    installmentPrice: 2499,
    rating: 4.8,
    reviewCount: 1247,
    enrolledCount: 8934,
    recentEnrollments: 127,
    lastUpdated: '15 августа 2024',
    nextLesson: 'Введение в JSX',
    previewImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    instructor: {
      name: 'Алексей Петров',
      title: 'Senior Frontend Developer в Яндексе',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Опытный разработчик с 8-летним стажем в веб-разработке. Специализируется на React, TypeScript и современных фронтенд-технологиях.',
      experience: 'Алексей работал в таких компаниях как Яндекс, Mail.ru Group и несколько стартапов. Он является автором популярных статей о React и выступает на конференциях по фронтенд-разработке. За время своей карьеры он обучил более 10,000 студентов и помог им найти работу в IT.',
      totalStudents: 12543,
      coursesCount: 8,
      rating: 4.9,
      reviewsCount: 2341,
      socialLinks: [
        { platform: 'Github', url: 'https://github.com' },
        { platform: 'Linkedin', url: 'https://linkedin.com' },
        { platform: 'Twitter', url: 'https://twitter.com' }
      ],
      otherCourses: [
        {
          title: 'TypeScript для React разработчиков',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
          studentsCount: 3421,
          rating: 4.7
        },
        {
          title: 'Next.js 14: Полное руководство',
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop',
          studentsCount: 2156,
          rating: 4.9
        }
      ]
    },
    learningOutcomes: [
      'Создавать современные React приложения с использованием функциональных компонентов',
      'Эффективно использовать React Hooks для управления состоянием',
      'Работать с Context API для глобального состояния',
      'Оптимизировать производительность React приложений',
      'Тестировать React компоненты с помощью Jest и React Testing Library',
      'Интегрировать React с внешними API и библиотеками',
      'Использовать новые возможности React 18: Concurrent Features, Suspense',
      'Деплоить React приложения в продакшн'
    ],
    prerequisites: [
      'Базовые знания HTML, CSS и JavaScript',
      'Понимание ES6+ синтаксиса (стрелочные функции, деструктуризация)',
      'Опыт работы с командной строкой',
      'Установленный Node.js и npm/yarn'
    ],
    features: [
      {
        icon: 'Code',
        title: 'Практические проекты',
        description: 'Создайте 5 реальных проектов для вашего портфолио'
      },
      {
        icon: 'Users',
        title: 'Менторская поддержка',
        description: 'Получайте помощь от опытных разработчиков'
      },
      {
        icon: 'BookOpen',
        title: 'Современная программа',
        description: 'Изучайте актуальные технологии и подходы'
      },
      {
        icon: 'Award',
        title: 'Сертификат',
        description: 'Получите сертификат о прохождении курса'
      }
    ],
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Hooks', 'JSX'],
    modules: [
      {
        title: 'Введение в React',
        description: 'Основы React, JSX, компоненты и их жизненный цикл',
        duration: '2 недели',
        progress: 100,
        lessons: [
          {
            title: 'Что такое React и зачем он нужен',
            duration: '15 мин',
            type: 'video',
            isPreview: true,
            isCompleted: true
          },
          {
            title: 'Настройка окружения разработки',
            duration: '20 мин',
            type: 'video',
            isPreview: true,
            isCompleted: true
          },
          {
            title: 'Первый React компонент',
            duration: '25 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          },
          {
            title: 'JSX синтаксис и особенности',
            duration: '30 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          },
          {
            title: 'Практическое задание: Создание компонента',
            duration: '45 мин',
            type: 'assignment',
            isPreview: false,
            isCompleted: false
          }
        ]
      },
      {
        title: 'Компоненты и Props',
        description: 'Создание переиспользуемых компонентов, передача данных через props',
        duration: '2 недели',
        progress: 60,
        lessons: [
          {
            title: 'Функциональные vs классовые компоненты',
            duration: '20 мин',
            type: 'video',
            isPreview: true,
            isCompleted: false
          },
          {
            title: 'Props и их типизация',
            duration: '25 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          },
          {
            title: 'Композиция компонентов',
            duration: '30 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          },
          {
            title: 'Условный рендеринг',
            duration: '20 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          }
        ]
      },
      {
        title: 'State и Events',
        description: 'Управление состоянием компонентов и обработка событий',
        duration: '2 недели',
        progress: 0,
        lessons: [
          {
            title: 'useState Hook',
            duration: '25 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          },
          {
            title: 'Обработка событий в React',
            duration: '20 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          },
          {
            title: 'Формы и контролируемые компоненты',
            duration: '35 мин',
            type: 'video',
            isPreview: false,
            isCompleted: false
          }
        ]
      }
    ],
    reviews: [
      {
        name: 'Мария Иванова',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
        date: '2 недели назад',
        comment: 'Отличный курс! Очень подробно и понятно объясняется материал. Алексей - прекрасный преподаватель, который умеет донести сложные концепции простым языком. Практические задания помогают закрепить теорию.',
        helpful: 23
      },
      {
        name: 'Дмитрий Сидоров',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 5,
        date: '1 месяц назад',
        comment: 'Прошел курс полностью и остался очень доволен. Получил работу React разработчика через 3 месяца после окончания. Курс дает все необходимые знания для старта карьеры.',
        helpful: 45
      },
      {
        name: 'Анна Петрова',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        rating: 4,
        date: '3 недели назад',
        comment: 'Хороший курс, но хотелось бы больше практических заданий. Теория объясняется отлично, но практики могло бы быть больше. В целом рекомендую!',
        helpful: 12
      }
    ]
  };

  const relatedCourses = [
    {
      title: 'Vue.js 3: Современная разработка',
      description: 'Изучите Vue.js 3 с Composition API и TypeScript',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop',
      instructor: {
        name: 'Елена Козлова',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      price: 19990,
      originalPrice: 29990,
      discount: 33,
      rating: 4.7,
      studentsCount: 2341,
      duration: '10 недель',
      lessonsCount: 36,
      level: 'Средний'
    },
    {
      title: 'Angular 17: Полное руководство',
      description: 'Создавайте масштабируемые приложения с Angular',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      instructor: {
        name: 'Игорь Волков',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      price: 27990,
      rating: 4.6,
      studentsCount: 1876,
      duration: '14 недель',
      lessonsCount: 52,
      level: 'Продвинутый'
    },
    {
      title: 'JavaScript ES2024: Новые возможности',
      description: 'Изучите последние возможности JavaScript',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
      instructor: {
        name: 'Максим Орлов',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      price: 15990,
      originalPrice: 21990,
      discount: 27,
      rating: 4.9,
      studentsCount: 5432,
      duration: '8 недель',
      lessonsCount: 28,
      level: 'Средний'
    }
  ];

  const faqData = [
    {
      question: 'Подходит ли курс для начинающих?',
      answer: 'Курс рассчитан на разработчиков со средним уровнем подготовки. Необходимы базовые знания JavaScript, HTML и CSS. Если вы только начинаете изучать программирование, рекомендуем сначала пройти наш курс "JavaScript для начинающих".',
      additionalInfo: 'Мы предоставляем список рекомендуемых материалов для подготовки к курсу.'
    },
    {
      question: 'Сколько времени нужно уделять обучению?',
      answer: 'Рекомендуется уделять обучению 8-10 часов в неделю. Это включает просмотр видеоуроков, выполнение практических заданий и работу над проектами. При таком темпе вы завершите курс за 12 недель.',
      additionalInfo: 'Вы можете учиться в своем темпе - доступ к материалам предоставляется навсегда.'
    },
    {
      question: 'Какие проекты я буду создавать?',
      answer: 'В рамках курса вы создадите 5 полноценных проектов: Todo-приложение, интернет-магазин, блог-платформу, дашборд аналитики и социальную сеть. Все проекты используют современные технологии и подходы.',
      additionalInfo: 'Проекты можно добавить в портфолио и показать потенциальным работодателям.'
    },
    {
      question: 'Предоставляется ли поддержка преподавателя?',
      answer: 'Да, у вас будет доступ к менторской поддержке. Вы можете задавать вопросы в чате курса, участвовать в еженедельных Q&A сессиях и получать обратную связь по выполненным заданиям.',
      additionalInfo: 'Среднее время ответа на вопросы составляет 2-4 часа в рабочие дни.'
    },
    {
      question: 'Выдается ли сертификат по окончании?',
      answer: 'Да, после успешного завершения всех модулей и защиты финального проекта вы получите сертификат о прохождении курса. Сертификат можно добавить в LinkedIn и показать работодателям.',
      additionalInfo: 'Сертификат содержит информацию о пройденных темах и количестве часов обучения.'
    },
    {
      question: 'Можно ли получить возврат средств?',
      answer: 'Да, мы предоставляем 14-дневную гарантию возврата средств. Если курс вам не подойдет, вы можете вернуть деньги в течение первых двух недель обучения без объяснения причин.',
      additionalInfo: 'Возврат осуществляется на ту же карту, с которой была произведена оплата.'
    }
  ];

  // Breadcrumb navigation
  const breadcrumbs = [
    { label: 'Главная', path: '/student-dashboard' },
    { label: 'Каталог курсов', path: '/course-catalog' },
    { label: 'Frontend разработка', path: '/course-catalog?category=frontend' },
    { label: courseData?.title, path: '/course-detail', active: true }
  ];

  const handleEnroll = () => {
    setIsEnrollmentOpen(true);
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleEnrollmentComplete = () => {
    setIsEnrolled(true);
    setUserProgress(5); // Start with some progress
  };

  const handleCourseClick = (course) => {
    // Navigate to course detail page
    console.log('Navigate to course:', course?.title);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                )}
                {crumb?.active ? (
                  <span className="text-foreground font-medium truncate">
                    {crumb?.label}
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(crumb?.path)}
                    className="text-muted-foreground hover:text-foreground transition-smooth truncate"
                  >
                    {crumb?.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
      {/* Course Hero Section */}
      <CourseHero
        course={courseData}
        onEnroll={handleEnroll}
        onPreview={handlePreview}
        isEnrolled={isEnrolled}
        userProgress={userProgress}
      />
      {/* Course Tabs */}
      <CourseTabs
        course={courseData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {/* FAQ Section */}
      <CourseFAQ faqs={faqData} />
      {/* Related Courses */}
      <RelatedCourses
        courses={relatedCourses}
        onCourseClick={handleCourseClick}
      />
      {/* Course Preview Modal */}
      <CoursePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        course={courseData}
        onEnroll={handleEnroll}
      />
      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        course={courseData}
        onEnrollmentComplete={handleEnrollmentComplete}
      />
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        {!isEnrolled ? (
          <Button
            variant="default"
            size="lg"
            onClick={handleEnroll}
            className="rounded-full shadow-glass-lg"
            iconName="CreditCard"
            iconPosition="left"
          >
            Записаться
          </Button>
        ) : (
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/lesson-interface')}
            className="rounded-full shadow-glass-lg"
            iconName="Play"
            iconPosition="left"
          >
            Продолжить
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;