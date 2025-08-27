import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuizInterface = ({ 
  assignment = {},
  onSubmit = () => {},
  onSave = () => {},
  className = ''
}) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Mock assignment data
  const mockAssignment = {
    id: 1,
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of React concepts, hooks, and best practices",
    timeLimit: 45, // minutes
    totalQuestions: 15,
    passingScore: 70,
    maxAttempts: 2,
    currentAttempt: 1,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: "What is the primary purpose of React hooks?",
        options: [
          "To replace class components entirely",
          "To allow state and lifecycle methods in functional components",
          "To improve performance of React applications",
          "To handle routing in React applications"
        ],
        correctAnswer: 1,
        points: 2,
        explanation: "React hooks allow you to use state and other React features in functional components without writing a class."
      },
      {
        id: 2,
        type: 'multiple_choice',
        question: "Which hook is used for managing component state?",
        options: [
          "useEffect",
          "useState",
          "useContext",
          "useReducer"
        ],
        correctAnswer: 1,
        points: 2,
        explanation: "useState is the hook specifically designed for managing local component state."
      },
      {
        id: 3,
        type: 'code_completion',
        question: "Complete the following React component to display a counter:",
        codeTemplate: `import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = _____(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        _____
      </button>
    </div>
  );
};`,
        blanks: ['useState', 'Increment'],
        points: 3,
        explanation: "useState hook initializes state, and the button should have descriptive text."
      },
      {
        id: 4,
        type: 'true_false',
        question: "useEffect runs after every render by default.",
        correctAnswer: true,
        points: 1,
        explanation: "useEffect runs after every completed render, unless you provide a dependency array."
      },
      {
        id: 5,
        type: 'multiple_select',
        question: "Which of the following are valid React hook rules? (Select all that apply)",
        options: [
          "Only call hooks at the top level",
          "Only call hooks from React functions",
          "Hooks can be called inside loops",
          "Hooks can be called conditionally",
          "Custom hooks must start with 'use'"
        ],
        correctAnswers: [0, 1, 4],
        points: 3,
        explanation: "Hooks must be called at the top level, only from React functions, and custom hooks must start with 'use'."
      },
      {
        id: 6,
        type: 'short_answer',
        question: "Explain the difference between props and state in React (max 100 words):",
        maxLength: 100,
        points: 4,
        sampleAnswer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component that can trigger re-renders when changed."
      }
    ]
  };

  const assignment_data = assignment?.id ? assignment : mockAssignment;

  // Initialize timer
  useEffect(() => {
    setTimeRemaining(assignment_data?.timeLimit * 60); // Convert to seconds
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleAutoSubmit();
    }
  }, [timeRemaining]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (Object.keys(answers)?.length > 0) {
        handleAutoSave();
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [answers]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setLastSaved(new Date());
      setIsAutoSaving(false);
      onSave({ answers, currentQuestion, timeRemaining });
    }, 500);
  };

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < assignment_data?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(questionId)) {
        newSet?.delete(questionId);
      } else {
        newSet?.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = (isAutoSubmit = false) => {
    const totalPoints = assignment_data?.questions?.reduce((sum, q) => sum + q?.points, 0);
    const answeredQuestions = Object.keys(answers)?.length;
    const completionRate = (answeredQuestions / assignment_data?.questions?.length) * 100;

    onSubmit({
      answers,
      totalQuestions: assignment_data?.questions?.length,
      answeredQuestions,
      completionRate,
      timeSpent: (assignment_data?.timeLimit * 60) - timeRemaining,
      isAutoSubmit,
      attempt: assignment_data?.currentAttempt
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers)?.length;
  };

  const renderQuestion = (question) => {
    const answer = answers?.[question?.id];

    switch (question?.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question?.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-3 border border-white/10 rounded-lg hover:bg-muted/30 cursor-pointer transition-smooth"
              >
                <input
                  type="radio"
                  name={`question_${question?.id}`}
                  value={index}
                  checked={answer === index}
                  onChange={(e) => handleAnswerChange(question?.id, parseInt(e?.target?.value))}
                  className="mt-1"
                />
                <span className="flex-1">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple_select':
        return (
          <div className="space-y-3">
            {question?.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-3 border border-white/10 rounded-lg hover:bg-muted/30 cursor-pointer transition-smooth"
              >
                <input
                  type="checkbox"
                  value={index}
                  checked={answer && answer?.includes(index)}
                  onChange={(e) => {
                    const currentAnswers = answer || [];
                    const newAnswers = e?.target?.checked
                      ? [...currentAnswers, index]
                      : currentAnswers?.filter(a => a !== index);
                    handleAnswerChange(question?.id, newAnswers);
                  }}
                  className="mt-1"
                />
                <span className="flex-1">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-3">
            {['True', 'False']?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 border border-white/10 rounded-lg hover:bg-muted/30 cursor-pointer transition-smooth"
              >
                <input
                  type="radio"
                  name={`question_${question?.id}`}
                  value={index === 0}
                  checked={answer === (index === 0)}
                  onChange={(e) => handleAnswerChange(question?.id, e?.target?.value === 'true')}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'short_answer':
        return (
          <div className="space-y-3">
            <textarea
              value={answer || ''}
              onChange={(e) => handleAnswerChange(question?.id, e?.target?.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 p-3 border border-white/10 rounded-lg bg-background resize-none"
              maxLength={question?.maxLength}
            />
            <div className="text-sm text-muted-foreground text-right">
              {(answer || '')?.length}/{question?.maxLength} characters
            </div>
          </div>
        );

      case 'code_completion':
        return (
          <div className="space-y-4">
            <pre className="p-4 bg-muted/50 border border-white/10 rounded-lg font-mono text-sm overflow-x-auto">
              {question?.codeTemplate}
            </pre>
            <div className="space-y-3">
              {question?.blanks?.map((blank, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">
                    Blank {index + 1}:
                  </label>
                  <Input
                    type="text"
                    value={(answer && answer?.[index]) || ''}
                    onChange={(e) => {
                      const newAnswer = answer || [];
                      newAnswer[index] = e?.target?.value;
                      handleAnswerChange(question?.id, [...newAnswer]);
                    }}
                    placeholder={`Fill in blank ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const currentQuestionData = assignment_data?.questions?.[currentQuestion];

  return (
    <div className={`quiz-interface h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="FileQuestion" size={20} className="text-primary" />
            <h3 className="font-semibold">{assignment_data?.title}</h3>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Clock" size={16} />
              {formatTime(timeRemaining)}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="FileText" size={16} />
              {getAnsweredCount()}/{assignment_data?.questions?.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReview(!showReview)}
            iconName="List"
            iconPosition="left"
            iconSize={16}
          >
            Review
          </Button>
        </div>
      </div>
      <div className="flex-1 flex">
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col">
          {/* Progress Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {assignment_data?.questions?.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentQuestionData?.points} points
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="progress-ambient h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / assignment_data?.questions?.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-semibold flex-1 pr-4">
                  {currentQuestionData?.question}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFlag(currentQuestionData?.id)}
                  className={flaggedQuestions?.has(currentQuestionData?.id) ? 'text-warning' : ''}
                >
                  <Icon name="Flag" size={20} />
                </Button>
              </div>

              {renderQuestion(currentQuestionData)}
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                iconName="ChevronLeft"
                iconPosition="left"
                iconSize={16}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {answers?.[currentQuestionData?.id] !== undefined ? 'Answered' : 'Not answered'}
                </span>
                {flaggedQuestions?.has(currentQuestionData?.id) && (
                  <Icon name="Flag" size={16} className="text-warning" />
                )}
              </div>

              {currentQuestion === assignment_data?.questions?.length - 1 ? (
                <Button
                  variant="default"
                  onClick={() => handleSubmit()}
                  iconName="Send"
                  iconPosition="right"
                  iconSize={16}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  iconName="ChevronRight"
                  iconPosition="right"
                  iconSize={16}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Review Panel */}
        {showReview && (
          <div className="w-80 border-l border-white/10 bg-muted/30">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Question Overview</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReview(false)}
                  className="h-6 w-6"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {assignment_data?.questions?.map((question, index) => (
                <button
                  key={question?.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-full p-3 rounded-lg border transition-smooth text-left ${
                    index === currentQuestion
                      ? 'border-primary bg-primary/10'
                      : answers?.[question?.id] !== undefined
                      ? 'border-success/50 bg-success/5' :'border-white/10 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q{index + 1}</span>
                    <div className="flex items-center gap-1">
                      {flaggedQuestions?.has(question?.id) && (
                        <Icon name="Flag" size={14} className="text-warning" />
                      )}
                      {answers?.[question?.id] !== undefined ? (
                        <Icon name="CheckCircle" size={14} className="text-success" />
                      ) : (
                        <Icon name="Circle" size={14} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 truncate">
                    {question?.question}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {question?.points} points
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Answered:</span>
                  <span className="font-medium">
                    {getAnsweredCount()}/{assignment_data?.questions?.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Flagged:</span>
                  <span className="font-medium">{flaggedQuestions?.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Time Left:</span>
                  <span className={`font-medium ${timeRemaining < 300 ? 'text-error' : ''}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;