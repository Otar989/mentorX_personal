import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AssignmentPanel = ({ 
  assignment = null,
  isOpen = false,
  onToggle = () => {},
  onClose = () => {},
  onSubmit = () => {},
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [code, setCode] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const fileInputRef = useRef(null);

  // Mock assignment data
  const mockAssignment = assignment || {
    id: 1,
    title: "React Hooks Implementation",
    type: "code", // code, sql, quiz, project
    description: "Implement a custom hook that manages form state with validation",
    instructions: `Create a custom React hook called useFormValidation that:
1. Accepts an initial state object and validation rules
2. Returns current values, errors, and handler functions
3. Validates fields on change and submit
4. Supports async validation for email uniqueness`,
    maxAttempts: 3,
    timeLimit: 3600, // 1 hour in seconds
    points: 100,
    dueDate: new Date(Date.now() + 86400000), // 24 hours from now
    files: [
      { name: "starter-template.js", url: "/assets/starter-template.js" },
      { name: "test-cases.js", url: "/assets/test-cases.js" }
    ],
    hints: [
      "Start by defining the hook signature with parameters",
      "Use useState to manage form values and errors",
      "Implement validation logic in useEffect",
      "Consider using useCallback for performance optimization"
    ],
    testCases: [
      { input: "Valid email format", expected: "No validation error", passed: null },
      { input: "Invalid email format", expected: "Email validation error", passed: null },
      { input: "Empty required field", expected: "Required field error", passed: null }
    ]
  };

  const mockSqlAssignment = {
    ...mockAssignment,
    type: "sql",
    title: "Database Query Optimization",
    description: "Write optimized SQL queries for user analytics",
    instructions: `Write SQL queries to:
1. Find top 10 users by course completion rate
2. Calculate average time spent per lesson
3. Identify users who haven't logged in for 30+ days`,
    schema: {
      tables: [
        { name: "users", columns: ["id", "email", "created_at", "last_login"] },
        { name: "courses", columns: ["id", "title", "duration"] },
        { name: "enrollments", columns: ["user_id", "course_id", "completed_at"] },
        { name: "lesson_progress", columns: ["user_id", "lesson_id", "time_spent", "completed"] }
      ]
    }
  };

  const mockQuizAssignment = {
    ...mockAssignment,
    type: "quiz",
    title: "React Hooks Knowledge Check",
    description: "Test your understanding of React Hooks concepts",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Which hook is used for managing component state?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correct: 1
      },
      {
        id: 2,
        type: "multiple-select",
        question: "Which of the following are valid dependency array patterns for useEffect?",
        options: ["[]", "[count]", "[count, name]", "undefined"],
        correct: [0, 1, 2]
      },
      {
        id: 3,
        type: "text",
        question: "Explain the difference between useState and useReducer.",
        maxLength: 500
      }
    ]
  };

  const currentAssignment = mockAssignment?.type === 'sql' ? mockSqlAssignment : 
                           mockAssignment?.type === 'quiz' ? mockQuizAssignment : mockAssignment;

  const tabs = [
    { id: 'instructions', label: 'Instructions', icon: 'FileText' },
    { id: 'workspace', label: 'Workspace', icon: 'Code' },
    { id: 'tests', label: 'Tests', icon: 'CheckSquare' },
    { id: 'hints', label: 'Hints', icon: 'Lightbulb' }
  ];

  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleRunTests = () => {
    setIsSubmitting(true);
    // Simulate test execution
    setTimeout(() => {
      const results = currentAssignment?.testCases?.map(test => ({
        ...test,
        passed: Math.random() > 0.3 // Random pass/fail for demo
      }));
      setTestResults(results);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleSubmitAssignment = () => {
    setIsSubmitting(true);
    setAttempts(prev => prev + 1);
    
    setTimeout(() => {
      onSubmit({
        assignmentId: currentAssignment?.id,
        code,
        sqlQuery,
        quizAnswers,
        attempt: attempts + 1
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event?.target?.files);
    console.log('Files uploaded:', files);
  };

  const renderWorkspace = () => {
    switch (currentAssignment?.type) {
      case 'code':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Code Editor</h4>
              <div className="flex items-center gap-2">
                <Select
                  options={[
                    { value: 'javascript', label: 'JavaScript' },
                    { value: 'typescript', label: 'TypeScript' },
                    { value: 'jsx', label: 'JSX' }
                  ]}
                  value="javascript"
                  onChange={() => {}}
                  className="w-32"
                />
                <Button variant="outline" size="sm">
                  <Icon name="Play" size={14} className="mr-1" />
                  Run
                </Button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e?.target?.value)}
                placeholder="// Write your custom hook here
function useFormValidation(initialState, validationRules) {
  // Your implementation
}"
                className="w-full h-64 p-4 bg-muted border border-white/10 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                Lines: {code?.split('\n')?.length} | Characters: {code?.length}
              </div>
            </div>
          </div>
        );

      case 'sql':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">SQL Query Editor</h4>
              <Button variant="outline" size="sm" onClick={handleRunTests}>
                <Icon name="Database" size={14} className="mr-1" />
                Execute Query
              </Button>
            </div>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e?.target?.value)}
              placeholder="-- Write your SQL query here
SELECT u.email, 
       COUNT(e.course_id) as completed_courses,
       AVG(lp.time_spent) as avg_time_spent
FROM users u
LEFT JOIN enrollments e ON u.id = e.user_id
LEFT JOIN lesson_progress lp ON u.id = lp.user_id
GROUP BY u.id
ORDER BY completed_courses DESC
LIMIT 10;"
              className="w-full h-48 p-4 bg-muted border border-white/10 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {/* Schema Reference */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h5 className="font-medium mb-2">Database Schema</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {mockSqlAssignment?.schema?.tables?.map((table) => (
                  <div key={table?.name} className="space-y-1">
                    <div className="font-medium text-primary">{table?.name}</div>
                    {table?.columns?.map((column) => (
                      <div key={column} className="text-muted-foreground ml-2">
                        • {column}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            {mockQuizAssignment?.questions?.map((question, index) => (
              <div key={question?.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h5 className="font-medium mb-3">{question?.question}</h5>
                    
                    {question?.type === 'multiple-choice' && (
                      <div className="space-y-2">
                        {question?.options?.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${question?.id}`}
                              value={optionIndex}
                              onChange={(e) => setQuizAnswers(prev => ({
                                ...prev,
                                [question?.id]: parseInt(e?.target?.value)
                              }))}
                              className="text-primary"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {question?.type === 'multiple-select' && (
                      <div className="space-y-2">
                        {question?.options?.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              value={optionIndex}
                              onChange={(e) => {
                                const currentAnswers = quizAnswers?.[question?.id] || [];
                                const newAnswers = e?.target?.checked
                                  ? [...currentAnswers, optionIndex]
                                  : currentAnswers?.filter(a => a !== optionIndex);
                                setQuizAnswers(prev => ({
                                  ...prev,
                                  [question?.id]: newAnswers
                                }));
                              }}
                              className="text-primary"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {question?.type === 'text' && (
                      <textarea
                        placeholder="Type your answer here..."
                        maxLength={question?.maxLength}
                        onChange={(e) => setQuizAnswers(prev => ({
                          ...prev,
                          [question?.id]: e?.target?.value
                        }))}
                        className="w-full h-24 p-3 bg-muted border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div>Workspace not available for this assignment type.</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-1/2 min-w-[600px] glass-lg border-l border-white/20 z-30 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold">{currentAssignment?.title}</h3>
            <p className="text-sm text-muted-foreground">
              {currentAssignment?.points} points • {attempts}/{currentAssignment?.maxAttempts} attempts
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right text-sm">
            <div className="text-muted-foreground">Due in</div>
            <div className="font-medium text-warning">
              {formatTimeRemaining(86400)} {/* 24 hours */}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-smooth ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'instructions' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{currentAssignment?.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm">{currentAssignment?.instructions}</pre>
              </div>
            </div>
            
            {currentAssignment?.files && currentAssignment?.files?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Starter Files</h4>
                <div className="space-y-2">
                  {currentAssignment?.files?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="File" size={16} />
                        <span className="text-sm">{file?.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Icon name="Download" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workspace' && renderWorkspace()}

        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Test Cases</h4>
              <Button 
                variant="outline" 
                onClick={handleRunTests}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Run Tests
              </Button>
            </div>
            
            <div className="space-y-3">
              {(testResults || currentAssignment?.testCases)?.map((test, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  test?.passed === true ? 'border-success/20 bg-success/5' :
                  test?.passed === false ? 'border-error/20 bg-error/5': 'border-white/10 bg-muted/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={
                          test?.passed === true ? 'CheckCircle' :
                          test?.passed === false ? 'XCircle': 'Circle'
                        } 
                        size={16}
                        className={
                          test?.passed === true ? 'text-success' :
                          test?.passed === false ? 'text-error': 'text-muted-foreground'
                        }
                      />
                      <span className="text-sm font-medium">Test {index + 1}</span>
                    </div>
                    {test?.passed !== null && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        test?.passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        {test?.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div><strong>Input:</strong> {test?.input}</div>
                    <div><strong>Expected:</strong> {test?.expected}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4">
            <h4 className="font-medium">Hints</h4>
            <div className="space-y-3">
              {currentAssignment?.hints?.map((hint, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <Icon name="Lightbulb" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{hint}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef?.current?.click()}
            >
              <Icon name="Upload" size={14} className="mr-1" />
              Upload Files
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Save" size={14} className="mr-1" />
              Save Draft
            </Button>
          </div>
          
          <Button
            variant="default"
            onClick={handleSubmitAssignment}
            disabled={isSubmitting || attempts >= currentAssignment?.maxAttempts}
            loading={isSubmitting}
          >
            Submit Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPanel;