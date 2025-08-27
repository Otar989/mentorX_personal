import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AdaptiveNavbar from '../../components/ui/AdaptiveNavbar';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NotificationCenter from '../../components/ui/NotificationCenter';

// Import components
import CodeEditor from './components/CodeEditor';
import SQLQueryRunner from './components/SQLQueryRunner';
import QuizInterface from './components/QuizInterface';
import FileUploadArea from './components/FileUploadArea';
import SubmissionHistory from './components/SubmissionHistory';

const AssignmentSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [assignmentType, setAssignmentType] = useState('code');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  // User state
  const [userRole] = useState('student');
  const [currentPath] = useState('/assignment-submission');

  // Mock current assignments
  const mockCurrentAssignments = [
    {
      id: 1,
      title: "React Component Implementation",
      type: "code",
      course: "React Fundamentals",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      difficulty: "intermediate",
      points: 25,
      timeLimit: 120,
      description: "Create a functional React component that manages state and handles user interactions",
      status: "in_progress"
    },
    {
      id: 2,
      title: "Database Query Optimization",
      type: "sql",
      course: "Database Management",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      difficulty: "advanced",
      points: 30,
      timeLimit: 90,
      description: "Write efficient SQL queries to retrieve customer order data with proper joins and aggregations",
      status: "not_started"
    },
    {
      id: 3,
      title: "JavaScript Fundamentals Quiz",
      type: "quiz",
      course: "JavaScript Essentials",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      difficulty: "beginner",
      points: 20,
      timeLimit: 45,
      description: "Test your knowledge of JavaScript concepts, functions, and best practices",
      status: "not_started"
    },
    {
      id: 4,
      title: "Portfolio Website Project",
      type: "project",
      course: "Web Development",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      difficulty: "advanced",
      points: 50,
      description: "Build a complete portfolio website using modern web technologies",
      status: "not_started"
    }
  ];

  const [currentAssignments] = useState(mockCurrentAssignments);

  // Initialize assignment from URL params or default
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const assignmentId = urlParams?.get('assignment');
    const type = urlParams?.get('type');
    
    if (assignmentId) {
      const assignment = currentAssignments?.find(a => a?.id === parseInt(assignmentId));
      if (assignment) {
        setCurrentAssignment(assignment);
        setAssignmentType(assignment?.type);
      }
    } else if (type) {
      setAssignmentType(type);
    } else if (currentAssignments?.length > 0) {
      setCurrentAssignment(currentAssignments?.[0]);
      setAssignmentType(currentAssignments?.[0]?.type);
    }
  }, [location?.search, currentAssignments]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleAssignmentSelect = (assignment) => {
    setCurrentAssignment(assignment);
    setAssignmentType(assignment?.type);
    navigate(`/assignment-submission?assignment=${assignment?.id}&type=${assignment?.type}`);
  };

  const handleSubmission = async (data) => {
    setSubmissionData(data);
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);
    
    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message and redirect
      alert('Assignment submitted successfully!');
      setActiveTab('history');
    }, 2000);
  };

  const handleSave = (data) => {
    console.log('Auto-saving assignment data:', data);
    // Implement auto-save functionality
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    const colors = {
      'not_started': 'text-muted-foreground',
      'in_progress': 'text-warning',
      'completed': 'text-success',
      'overdue': 'text-error'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'not_started': 'Circle',
      'in_progress': 'Clock',
      'completed': 'CheckCircle',
      'overdue': 'AlertCircle'
    };
    return icons?.[status] || 'Circle';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'text-success',
      'intermediate': 'text-warning',
      'advanced': 'text-error'
    };
    return colors?.[difficulty] || 'text-muted-foreground';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'code': 'Code',
      'sql': 'Database',
      'quiz': 'FileQuestion',
      'project': 'FolderOpen'
    };
    return icons?.[type] || 'FileText';
  };

  const renderAssignmentInterface = () => {
    if (!currentAssignment && activeTab === 'current') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <Icon name="FileText" size={64} className="text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Assignment Selected</h3>
          <p className="text-muted-foreground mb-6">
            Choose an assignment from the list to start working on it.
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveTab('current')}
            iconName="List"
            iconPosition="left"
            iconSize={16}
          >
            View Available Assignments
          </Button>
        </div>
      );
    }

    switch (assignmentType) {
      case 'code':
        return (
          <CodeEditor
            assignment={currentAssignment}
            onSubmit={handleSubmission}
            onSave={handleSave}
            className="h-full"
          />
        );
      case 'sql':
        return (
          <SQLQueryRunner
            assignment={currentAssignment}
            onSubmit={handleSubmission}
            onSave={handleSave}
            className="h-full"
          />
        );
      case 'quiz':
        return (
          <QuizInterface
            assignment={currentAssignment}
            onSubmit={handleSubmission}
            onSave={handleSave}
            className="h-full"
          />
        );
      case 'project':
        return (
          <FileUploadArea
            assignment={currentAssignment}
            onSubmit={handleSubmission}
            onSave={handleSave}
            className="h-full"
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Unsupported assignment type</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AdaptiveNavbar
        userRole={userRole}
        currentPath={currentPath}
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      {/* Sidebar */}
      <RoleSidebar
        userRole={userRole}
        currentPath={currentPath}
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Main Content */}
      <main className={`content-offset transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:content-offset-sidebar-collapsed' : 'lg:content-offset-sidebar'
      }`}>
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Assignment List Sidebar */}
          <div className="w-80 border-r border-white/10 bg-muted/30 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-smooth ${
                  activeTab === 'current' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                Current ({currentAssignments?.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-smooth ${
                  activeTab === 'history' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                History
              </button>
            </div>

            {/* Assignment List */}
            {activeTab === 'current' ? (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {currentAssignments?.map((assignment) => (
                    <button
                      key={assignment?.id}
                      onClick={() => handleAssignmentSelect(assignment)}
                      className={`w-full p-4 rounded-xl border transition-smooth text-left ${
                        currentAssignment?.id === assignment?.id
                          ? 'border-primary bg-primary/10' :'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon 
                            name={getTypeIcon(assignment?.type)} 
                            size={16} 
                            className="text-primary" 
                          />
                          <span className="font-semibold text-sm">{assignment?.title}</span>
                        </div>
                        <Icon 
                          name={getStatusIcon(assignment?.status)} 
                          size={16} 
                          className={getStatusColor(assignment?.status)}
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {assignment?.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className={getDifficultyColor(assignment?.difficulty)}>
                            {assignment?.difficulty}
                          </span>
                          <span className="text-muted-foreground">
                            {assignment?.points} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Icon name="Calendar" size={12} />
                          <span>
                            {getDaysUntilDue(assignment?.dueDate) > 0 
                              ? `${getDaysUntilDue(assignment?.dueDate)}d left`
                              : 'Overdue'
                            }
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <SubmissionHistory
                onViewSubmission={(submission) => console.log('View submission:', submission)}
                onRetrySubmission={(submission) => {
                  // Find the original assignment and set it as current
                  const assignment = currentAssignments?.find(a => a?.title === submission?.assignmentTitle);
                  if (assignment) {
                    handleAssignmentSelect(assignment);
                    setActiveTab('current');
                  }
                }}
                className="flex-1"
              />
            )}
          </div>

          {/* Main Assignment Interface */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'current' && renderAssignmentInterface()}
            {activeTab === 'history' && (
              <div className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="History" size={64} className="text-muted-foreground/50 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Submission History</h3>
                  <p className="text-muted-foreground">
                    View your past assignment submissions and grades in the sidebar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Submission Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
          <div className="glass-lg rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <Icon name="Send" size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Confirm Submission</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to submit this assignment? You cannot modify it after submission.
              </p>
              
              {submissionData && (
                <div className="text-left bg-muted/50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-2">Submission Summary:</h4>
                  <div className="text-sm space-y-1">
                    {submissionData?.score && (
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <span>{submissionData?.score}%</span>
                      </div>
                    )}
                    {submissionData?.testResults && (
                      <div className="flex justify-between">
                        <span>Tests Passed:</span>
                        <span>{submissionData?.testResults?.filter(t => t?.passed)?.length}/{submissionData?.testResults?.length}</span>
                      </div>
                    )}
                    {submissionData?.files && (
                      <div className="flex justify-between">
                        <span>Files:</span>
                        <span>{submissionData?.files?.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={confirmSubmission}
                  disabled={isSubmitting}
                  className="flex-1"
                  iconName={isSubmitting ? "Loader2" : "Send"}
                  iconPosition="right"
                  iconSize={16}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-dropdown">
        <NotificationCenter
          isOpen={isNotificationOpen}
          onToggle={toggleNotifications}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-modal">
          <div className="glass-lg rounded-xl p-6 flex items-center gap-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="font-medium">Submitting assignment...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmission;