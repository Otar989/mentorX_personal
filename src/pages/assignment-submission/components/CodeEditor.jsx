import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CodeEditor = ({ 
  assignment = {},
  onSubmit = () => {},
  onSave = () => {},
  className = ''
}) => {
  const [code, setCode] = useState(assignment?.starterCode || '');
  const [language, setLanguage] = useState(assignment?.language || 'javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const editorRef = useRef(null);
  const autoSaveRef = useRef(null);

  // Mock assignment data
  const mockAssignment = {
    id: 1,
    title: "React Component Implementation",
    description: "Create a functional React component that manages state and handles user interactions",
    language: "javascript",
    difficulty: "intermediate",
    maxAttempts: 3,
    currentAttempt: 1,
    timeLimit: 120, // minutes
    starterCode: `import React, { useState } from 'react';

// TODO: Implement a Counter component
// Requirements:
// 1. Display current count
// 2. Increment and decrement buttons
// 3. Reset functionality
// 4. Prevent negative values

const Counter = () => {
  // Your code here
  
  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
};

export default Counter;`,
    testCases: [
      { id: 1, name: "Component renders without errors", passed: false },
      { id: 2, name: "Increment button increases count", passed: false },
      { id: 3, name: "Decrement button decreases count", passed: false },
      { id: 4, name: "Reset button sets count to zero", passed: false },
      { id: 5, name: "Count cannot go below zero", passed: false }
    ],
    hints: [
      "Start by setting up the useState hook for managing the count state",
      "Create handler functions for increment, decrement, and reset operations",
      "Add conditional logic to prevent negative values",
      "Make sure to bind event handlers properly in your JSX"
    ]
  };

  const assignment_data = assignment?.id ? assignment : mockAssignment;

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveRef?.current) {
      clearTimeout(autoSaveRef?.current);
    }
    
    autoSaveRef.current = setTimeout(() => {
      if (code !== assignment_data?.starterCode) {
        handleAutoSave();
      }
    }, 3000);

    return () => {
      if (autoSaveRef?.current) {
        clearTimeout(autoSaveRef?.current);
      }
    };
  }, [code]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    // Simulate auto-save
    setTimeout(() => {
      setLastSaved(new Date());
      setIsAutoSaving(false);
      onSave({ code, language });
    }, 500);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setErrors([]);
    
    // Simulate code execution
    setTimeout(() => {
      // Mock syntax checking
      const syntaxErrors = [];
      if (!code?.includes('useState')) {
        syntaxErrors?.push({
          line: 1,
          message: "useState hook is required for this assignment",
          type: "warning"
        });
      }
      
      if (!code?.includes('return')) {
        syntaxErrors?.push({
          line: 10,
          message: "Component must return JSX",
          type: "error"
        });
      }

      setErrors(syntaxErrors);
      
      // Mock test results
      const results = assignment_data?.testCases?.map(test => ({
        ...test,
        passed: Math.random() > 0.3 // Random pass/fail for demo
      }));
      
      setTestResults(results);
      
      const passedTests = results?.filter(test => test?.passed)?.length;
      setOutput(`Code executed successfully!\n\nTest Results: ${passedTests}/${results?.length} tests passed\n\nOutput:\nComponent rendered without errors.`);
      
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    const passedTests = testResults?.filter(test => test?.passed)?.length;
    const totalTests = testResults?.length;
    
    onSubmit({
      code,
      language,
      testResults,
      score: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      attempt: assignment_data?.currentAttempt
    });
  };

  const getNextHint = () => {
    if (currentHint < assignment_data?.hints?.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    if (diff < 60) return `Saved ${diff}s ago`;
    return `Saved ${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className={`code-editor h-full flex flex-col ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Code" size={20} className="text-primary" />
            <h3 className="font-semibold">{assignment_data?.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Attempt {assignment_data?.currentAttempt}/{assignment_data?.maxAttempts}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          
          {lastSaved && !isAutoSaving && (
            <span className="text-sm text-muted-foreground">
              {formatLastSaved()}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHints(!showHints)}
            iconName="Lightbulb"
            iconPosition="left"
            iconSize={16}
          >
            Hints
          </Button>
        </div>
      </div>
      {/* Assignment Description */}
      <div className="p-4 bg-muted/50 border-b border-white/10">
        <p className="text-sm text-muted-foreground mb-2">
          {assignment_data?.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="Target" size={14} />
            {assignment_data?.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="Timer" size={14} />
            {assignment_data?.timeLimit} minutes
          </span>
        </div>
      </div>
      <div className="flex-1 flex">
        {/* Code Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between p-2 border-b border-white/10 bg-muted/30">
            <div className="flex items-center gap-2">
              <select 
                value={language}
                onChange={(e) => setLanguage(e?.target?.value)}
                className="px-2 py-1 bg-background border border-white/20 rounded text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon name="Undo" size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon name="Redo" size={16} />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning}
                iconName={isRunning ? "Loader2" : "Play"}
                iconPosition="left"
                iconSize={16}
                className={isRunning ? "animate-spin" : ""}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e?.target?.value)}
              className="w-full h-full p-4 bg-background font-mono text-sm resize-none border-none outline-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />
            
            {/* Line numbers overlay */}
            <div className="absolute left-0 top-0 p-4 pointer-events-none text-muted-foreground font-mono text-sm">
              {code?.split('\n')?.map((_, index) => (
                <div key={index} className="h-5 leading-5">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {errors?.length > 0 && (
            <div className="border-t border-white/10 p-4 bg-error/5">
              <h4 className="font-medium text-error mb-2 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                Issues Found
              </h4>
              <div className="space-y-1">
                {errors?.map((error, index) => (
                  <div key={index} className="text-sm flex items-start gap-2">
                    <span className="text-muted-foreground">Line {error?.line}:</span>
                    <span className={error?.type === 'error' ? 'text-error' : 'text-warning'}>
                      {error?.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l border-white/10 flex flex-col">
          {/* Hints Panel */}
          {showHints && (
            <div className="p-4 border-b border-white/10 bg-accent/5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Icon name="Lightbulb" size={16} className="text-accent" />
                  Hints
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHints(false)}
                  className="h-6 w-6"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
              
              <div className="space-y-3">
                {assignment_data?.hints?.slice(0, currentHint + 1)?.map((hint, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg border border-white/10">
                    <div className="flex items-start gap-2">
                      <Icon name="Info" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{hint}</p>
                    </div>
                  </div>
                ))}
                
                {currentHint < assignment_data?.hints?.length - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={getNextHint}
                    className="w-full"
                  >
                    Get Next Hint ({currentHint + 2}/{assignment_data?.hints?.length})
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Test Results */}
          <div className="flex-1 p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Icon name="CheckSquare" size={16} className="text-success" />
              Test Results
            </h4>
            
            {testResults?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Play" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Run your code to see test results</p>
              </div>
            ) : (
              <div className="space-y-2">
                {testResults?.map((test) => (
                  <div
                    key={test?.id}
                    className={`p-3 rounded-lg border ${
                      test?.passed
                        ? 'bg-success/5 border-success/20' :'bg-error/5 border-error/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon
                        name={test?.passed ? "CheckCircle" : "XCircle"}
                        size={16}
                        className={test?.passed ? "text-success" : "text-error"}
                      />
                      <span className="text-sm">{test?.name}</span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Score:</span>
                    <span className="font-medium">
                      {testResults?.filter(t => t?.passed)?.length}/{testResults?.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Console */}
          {output && (
            <div className="border-t border-white/10 p-4 bg-muted/30">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Icon name="Terminal" size={16} />
                Output
              </h4>
              <pre className="text-xs bg-background p-3 rounded border border-white/10 overflow-auto max-h-32 whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          )}

          {/* Submit Button */}
          <div className="p-4 border-t border-white/10">
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={testResults?.length === 0 || isRunning}
              className="w-full"
              iconName="Send"
              iconPosition="right"
              iconSize={16}
            >
              Submit Assignment
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {assignment_data?.maxAttempts - assignment_data?.currentAttempt} attempts remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;