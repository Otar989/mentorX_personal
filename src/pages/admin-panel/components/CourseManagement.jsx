import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CourseManagement = ({ className = '' }) => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Fundamentals",
      description: "Complete guide to React development with hooks and modern patterns",
      instructor: "Александр Петров",
      category: "frontend",
      difficulty: "beginner",
      status: "published",
      students: 1247,
      rating: 4.8,
      price: 15000,
      createdDate: "2024-01-15",
      lastUpdated: "2024-08-20",
      language: "ru"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Deep dive into JavaScript concepts, async programming, and performance optimization",
      instructor: "Мария Иванова",
      category: "backend",
      difficulty: "advanced",
      status: "published",
      students: 892,
      rating: 4.9,
      price: 25000,
      createdDate: "2024-02-10",
      lastUpdated: "2024-08-25",
      language: "en"
    },
    {
      id: 3,
      title: "Python для начинающих",
      description: "Изучение основ Python программирования с практическими примерами",
      instructor: "Дмитрий Сидоров",
      category: "backend",
      difficulty: "beginner",
      status: "draft",
      students: 0,
      rating: 0,
      price: 12000,
      createdDate: "2024-08-01",
      lastUpdated: "2024-08-26",
      language: "ru"
    },
    {
      id: 4,
      title: "Data Science Essentials",
      description: "Introduction to data analysis, visualization, and machine learning basics",
      instructor: "Елена Козлова",
      category: "data-science",
      difficulty: "intermediate",
      status: "published",
      students: 634,
      rating: 4.7,
      price: 30000,
      createdDate: "2024-03-05",
      lastUpdated: "2024-08-22",
      language: "en"
    },
    {
      id: 5,
      title: "DevOps и CI/CD",
      description: "Автоматизация развертывания и управление инфраструктурой",
      instructor: "Игорь Морозов",
      category: "devops",
      difficulty: "advanced",
      status: "review",
      students: 0,
      rating: 0,
      price: 35000,
      createdDate: "2024-07-15",
      lastUpdated: "2024-08-24",
      language: "ru"
    }
  ]);

  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'devops', label: 'DevOps' },
    { value: 'mobile', label: 'Mobile Development' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Under Review' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-muted text-muted-foreground',
      review: 'bg-warning/10 text-warning',
      published: 'bg-success/10 text-success',
      archived: 'bg-error/10 text-error'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-success/10 text-success',
      intermediate: 'bg-warning/10 text-warning',
      advanced: 'bg-error/10 text-error'
    };
    return colors?.[difficulty] || 'bg-muted text-muted-foreground';
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterCourses(query, categoryFilter, statusFilter);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    filterCourses(searchQuery, category, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterCourses(searchQuery, categoryFilter, status);
  };

  const filterCourses = (query, category, status) => {
    let filtered = courses;

    if (query) {
      filtered = filtered?.filter(course =>
        course?.title?.toLowerCase()?.includes(query?.toLowerCase()) ||
        course?.description?.toLowerCase()?.includes(query?.toLowerCase()) ||
        course?.instructor?.toLowerCase()?.includes(query?.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered?.filter(course => course?.category === category);
    }

    if (status !== 'all') {
      filtered = filtered?.filter(course => course?.status === status);
    }

    setFilteredCourses(filtered);
  };

  const handleGenerateWithAI = () => {
    setIsGeneratingCourse(true);
    
    setTimeout(() => {
      const newCourse = {
        id: courses?.length + 1,
        title: "AI-Generated Course: Machine Learning Basics",
        description: "Comprehensive introduction to machine learning algorithms and applications generated by AI",
        instructor: "AI Assistant",
        category: "data-science",
        difficulty: "beginner",
        status: "draft",
        students: 0,
        rating: 0,
        price: 20000,
        createdDate: new Date()?.toISOString()?.split('T')?.[0],
        lastUpdated: new Date()?.toISOString()?.split('T')?.[0],
        language: "ru"
      };
      
      setCourses(prev => [newCourse, ...prev]);
      setFilteredCourses(prev => [newCourse, ...prev]);
      setIsGeneratingCourse(false);
    }, 3000);
  };

  const handleStatusChange = (courseId, newStatus) => {
    setCourses(prev => prev?.map(course =>
      course?.id === courseId ? { ...course, status: newStatus } : course
    ));
    setFilteredCourses(prev => prev?.map(course =>
      course?.id === courseId ? { ...course, status: newStatus } : course
    ));
  };

  const handleDeleteCourse = (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev?.filter(course => course?.id !== courseId));
      setFilteredCourses(prev => prev?.filter(course => course?.id !== courseId));
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-muted-foreground">
            Create, edit, and manage platform courses
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleGenerateWithAI}
            disabled={isGeneratingCourse}
            iconName="Bot"
            iconPosition="left"
            iconSize={16}
          >
            {isGeneratingCourse ? 'Generating...' : 'Generate with AI'}
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Create Course
          </Button>
        </div>
      </div>
      {/* AI Generation Progress */}
      {isGeneratingCourse && (
        <div className="glass-lg rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-primary animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">AI Course Generation in Progress</h3>
              <p className="text-sm text-muted-foreground">
                Creating course structure, lessons, and assignments...
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="progress-ambient h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Filters and Search */}
      <div className="glass-lg rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e?.target?.value)}
            className="md:col-span-2"
          />
          
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={handleCategoryFilter}
            placeholder="Filter by category"
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusFilter}
            placeholder="Filter by status"
          />
        </div>
      </div>
      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses?.map((course) => (
          <div key={course?.id} className="glass-lg rounded-xl p-6 space-y-4">
            {/* Course Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-2">{course?.title}</h3>
                <p className="text-sm text-muted-foreground">by {course?.instructor}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCourse(course?.id)}
                  className="h-8 w-8 text-error hover:text-error"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>

            {/* Course Description */}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {course?.description}
            </p>

            {/* Course Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course?.status)}`}>
                {course?.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course?.difficulty)}`}>
                {course?.difficulty}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {course?.language?.toUpperCase()}
              </span>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-lg font-semibold">{course?.students}</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold flex items-center justify-center gap-1">
                  {course?.rating > 0 ? course?.rating : '-'}
                  {course?.rating > 0 && <Icon name="Star" size={14} className="text-accent" />}
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">₽{course?.price?.toLocaleString('ru-RU')}</div>
                <div className="text-xs text-muted-foreground">Price</div>
              </div>
            </div>

            {/* Course Actions */}
            <div className="flex items-center gap-2 pt-4">
              {course?.status === 'draft' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(course?.id, 'review')}
                  iconName="Send"
                  iconSize={14}
                >
                  Submit for Review
                </Button>
              )}
              {course?.status === 'review' && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusChange(course?.id, 'published')}
                    iconName="Check"
                    iconSize={14}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(course?.id, 'draft')}
                    iconName="X"
                    iconSize={14}
                  >
                    Reject
                  </Button>
                </>
              )}
              {course?.status === 'published' && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  iconSize={14}
                >
                  View Course
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredCourses?.length === 0 && (
        <div className="glass-lg rounded-xl p-12 text-center">
          <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or create a new course
          </p>
          <Button variant="default" iconName="Plus" iconPosition="left" iconSize={16}>
            Create First Course
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;