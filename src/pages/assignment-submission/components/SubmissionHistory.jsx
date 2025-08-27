import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmissionHistory = ({ 
  submissions = [],
  onViewSubmission = () => {},
  onRetrySubmission = () => {},
  className = ''
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock submission history data
  const mockSubmissions = [
    {
      id: 1,
      assignmentTitle: "React Component Implementation",
      type: "code",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: "graded",
      score: 85,
      maxScore: 100,
      attempt: 2,
      maxAttempts: 3,
      feedback: "Good implementation of React hooks. Consider adding error handling for edge cases. The component structure is clean and follows best practices.",
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      gradedBy: "Dr. Sarah Johnson",
      testResults: {
        passed: 4,
        total: 5,
        details: [
          { name: "Component renders", passed: true },
          { name: "State management", passed: true },
          { name: "Event handling", passed: true },
          { name: "Error boundaries", passed: false },
          { name: "Performance optimization", passed: true }
        ]
      },
      plagiarismScore: 5, // percentage
      executionTime: 1250 // ms
    },
    {
      id: 2,
      assignmentTitle: "Database Query Optimization",
      type: "sql",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: "graded",
      score: 92,
      maxScore: 100,
      attempt: 1,
      maxAttempts: 5,
      feedback: "Excellent query optimization! Your use of proper indexing and JOIN operations shows deep understanding of database principles.",
      gradedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      gradedBy: "Prof. Michael Chen",
      queryResults: {
        executionTime: 45,
        rowsReturned: 1250,
        performanceScore: 95
      },
      plagiarismScore: 2
    },
    {
      id: 3,
      assignmentTitle: "React Fundamentals Quiz",
      type: "quiz",
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: "graded",
      score: 78,
      maxScore: 100,
      attempt: 1,
      maxAttempts: 2,
      feedback: "Good understanding of React basics. Review lifecycle methods and hooks interaction patterns for better performance.",
      gradedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      gradedBy: "Dr. Sarah Johnson",
      quizResults: {
        correctAnswers: 12,
        totalQuestions: 15,
        timeSpent: 28 // minutes
      }
    },
    {
      id: 4,
      assignmentTitle: "Portfolio Project",
      type: "project",
      submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      status: "pending",
      attempt: 1,
      maxAttempts: 2,
      files: [
        { name: "portfolio.zip", size: "15.2 MB" },
        { name: "README.md", size: "2.1 KB" }
      ],
      githubUrl: "https://github.com/student/portfolio-project"
    },
    {
      id: 5,
      assignmentTitle: "Advanced JavaScript Concepts",
      type: "code",
      submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: "processing",
      attempt: 3,
      maxAttempts: 3,
      plagiarismStatus: "checking"
    }
  ];

  const submission_data = submissions?.length > 0 ? submissions : mockSubmissions;

  const getStatusColor = (status) => {
    const colors = {
      graded: 'text-success',
      pending: 'text-warning',
      processing: 'text-primary',
      failed: 'text-error',
      draft: 'text-muted-foreground'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      graded: 'CheckCircle',
      pending: 'Clock',
      processing: 'Loader2',
      failed: 'XCircle',
      draft: 'FileText'
    };
    return icons?.[status] || 'FileText';
  };

  const getTypeIcon = (type) => {
    const icons = {
      code: 'Code',
      sql: 'Database',
      quiz: 'FileQuestion',
      project: 'FolderOpen'
    };
    return icons?.[type] || 'FileText';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-warning';
    return 'text-error';
  };

  const filteredSubmissions = submission_data?.filter(submission => {
    if (filterStatus === 'all') return true;
    return submission?.status === filterStatus;
  });

  const canRetry = (submission) => {
    return submission?.attempt < submission?.maxAttempts && 
           (submission?.status === 'graded' || submission?.status === 'failed');
  };

  return (
    <div className={`submission-history h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icon name="History" size={20} className="text-primary" />
          <h3 className="font-semibold">Submission History</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="px-3 py-1 bg-background border border-white/20 rounded text-sm"
          >
            <option value="all">All Status</option>
            <option value="graded">Graded</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      <div className="flex-1 flex">
        {/* Submissions List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSubmissions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Icon name="FileText" size={48} className="text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'all' ? "You haven't submitted any assignments yet." : `No submissions with status"${filterStatus}".`
                }
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredSubmissions?.map((submission) => (
                <div
                  key={submission?.id}
                  className={`border border-white/10 rounded-xl p-4 hover:bg-muted/30 transition-smooth cursor-pointer ${
                    selectedSubmission?.id === submission?.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon name={getTypeIcon(submission?.type)} size={20} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{submission?.assignmentTitle}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {formatTimeAgo(submission?.submittedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="RotateCcw" size={14} />
                            Attempt {submission?.attempt}/{submission?.maxAttempts}
                          </span>
                        </div>
                        
                        {submission?.status === 'graded' && (
                          <div className="flex items-center gap-4 mt-2">
                            <div className={`flex items-center gap-1 ${getScoreColor(submission?.score, submission?.maxScore)}`}>
                              <Icon name="Award" size={14} />
                              <span className="font-medium">
                                {submission?.score}/{submission?.maxScore} ({Math.round((submission?.score / submission?.maxScore) * 100)}%)
                              </span>
                            </div>
                            {submission?.plagiarismScore !== undefined && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Icon name="Shield" size={14} />
                                <span>Similarity: {submission?.plagiarismScore}%</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`flex items-center gap-1 ${getStatusColor(submission?.status)}`}>
                        <Icon 
                          name={getStatusIcon(submission?.status)} 
                          size={16} 
                          className={submission?.status === 'processing' ? 'animate-spin' : ''}
                        />
                        <span className="text-sm font-medium capitalize">{submission?.status}</span>
                      </div>
                      
                      {canRetry(submission) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onRetrySubmission(submission);
                          }}
                          iconName="RotateCcw"
                          iconSize={14}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submission Details Panel */}
        {selectedSubmission && (
          <div className="w-96 border-l border-white/10 bg-muted/30">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Submission Details</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSubmission(null)}
                  className="h-6 w-6"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Basic Info */}
              <div className="space-y-3">
                <h5 className="font-medium">Assignment Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{selectedSubmission?.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>{selectedSubmission?.submittedAt?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`capitalize ${getStatusColor(selectedSubmission?.status)}`}>
                      {selectedSubmission?.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Attempt:</span>
                    <span>{selectedSubmission?.attempt}/{selectedSubmission?.maxAttempts}</span>
                  </div>
                </div>
              </div>

              {/* Score and Feedback */}
              {selectedSubmission?.status === 'graded' && (
                <>
                  <div className="space-y-3">
                    <h5 className="font-medium">Grading Results</h5>
                    <div className="p-3 bg-background rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Final Score</span>
                        <span className={`text-lg font-bold ${getScoreColor(selectedSubmission?.score, selectedSubmission?.maxScore)}`}>
                          {selectedSubmission?.score}/{selectedSubmission?.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(selectedSubmission?.score / selectedSubmission?.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">Graded by:</span>
                        <span>{selectedSubmission?.gradedBy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Graded on:</span>
                        <span>{selectedSubmission?.gradedAt?.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSubmission?.feedback && (
                    <div className="space-y-3">
                      <h5 className="font-medium">Instructor Feedback</h5>
                      <div className="p-3 bg-background rounded-lg border border-white/10">
                        <p className="text-sm">{selectedSubmission?.feedback}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Test Results for Code Assignments */}
              {selectedSubmission?.testResults && (
                <div className="space-y-3">
                  <h5 className="font-medium">Test Results</h5>
                  <div className="space-y-2">
                    {selectedSubmission?.testResults?.details?.map((test, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded border ${
                          test?.passed
                            ? 'bg-success/5 border-success/20' :'bg-error/5 border-error/20'
                        }`}
                      >
                        <Icon
                          name={test?.passed ? "CheckCircle" : "XCircle"}
                          size={16}
                          className={test?.passed ? "text-success" : "text-error"}
                        />
                        <span className="text-sm">{test?.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall:</span>
                    <span className="font-medium">
                      {selectedSubmission?.testResults?.passed}/{selectedSubmission?.testResults?.total} tests passed
                    </span>
                  </div>
                </div>
              )}

              {/* Files for Project Submissions */}
              {selectedSubmission?.files && (
                <div className="space-y-3">
                  <h5 className="font-medium">Submitted Files</h5>
                  <div className="space-y-2">
                    {selectedSubmission?.files?.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border border-white/10">
                        <Icon name="File" size={16} className="text-primary" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{file?.name}</div>
                          <div className="text-xs text-muted-foreground">{file?.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedSubmission?.githubUrl && (
                    <div className="flex items-center gap-2 p-2 bg-background rounded border border-white/10">
                      <Icon name="Github" size={16} className="text-primary" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">GitHub Repository</div>
                        <a 
                          href={selectedSubmission?.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {selectedSubmission?.githubUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => onViewSubmission(selectedSubmission)}
                  className="w-full"
                  iconName="Eye"
                  iconPosition="left"
                  iconSize={16}
                >
                  View Full Submission
                </Button>
                
                {canRetry(selectedSubmission) && (
                  <Button
                    variant="default"
                    onClick={() => onRetrySubmission(selectedSubmission)}
                    className="w-full"
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Retry Assignment
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionHistory;