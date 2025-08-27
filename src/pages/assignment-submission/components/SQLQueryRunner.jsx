import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SQLQueryRunner = ({ 
  assignment = {},
  onSubmit = () => {},
  onSave = () => {},
  className = ''
}) => {
  const [query, setQuery] = useState(assignment?.starterQuery || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [rowsAffected, setRowsAffected] = useState(0);
  const [errors, setErrors] = useState([]);
  const [showSchema, setShowSchema] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Mock assignment data
  const mockAssignment = {
    id: 1,
    title: "Database Query Optimization",
    description: "Write efficient SQL queries to retrieve customer order data with proper joins and aggregations",
    database: "ecommerce_db",
    maxAttempts: 5,
    currentAttempt: 2,
    timeLimit: 90,
    starterQuery: `-- Write a query to find the top 5 customers by total order value
-- Include customer name, email, and total spent
-- Order by total spent in descending order

SELECT 
  -- Your query here
FROM customers c
-- Add your joins and conditions here
`,
    expectedColumns: ['customer_name', 'email', 'total_spent'],
    testQueries: [
      { id: 1, name: "Returns correct columns", passed: false },
      { id: 2, name: "Proper JOIN usage", passed: false },
      { id: 3, name: "Correct aggregation", passed: false },
      { id: 4, name: "Proper ORDER BY clause", passed: false },
      { id: 5, name: "LIMIT clause applied", passed: false }
    ]
  };

  const assignment_data = assignment?.id ? assignment : mockAssignment;

  // Mock database schema
  const databaseSchema = {
    customers: {
      columns: [
        { name: 'customer_id', type: 'INT', key: 'PRIMARY' },
        { name: 'first_name', type: 'VARCHAR(50)', key: '' },
        { name: 'last_name', type: 'VARCHAR(50)', key: '' },
        { name: 'email', type: 'VARCHAR(100)', key: 'UNIQUE' },
        { name: 'phone', type: 'VARCHAR(20)', key: '' },
        { name: 'created_at', type: 'TIMESTAMP', key: '' }
      ],
      rowCount: 1250
    },
    orders: {
      columns: [
        { name: 'order_id', type: 'INT', key: 'PRIMARY' },
        { name: 'customer_id', type: 'INT', key: 'FOREIGN' },
        { name: 'order_date', type: 'DATE', key: '' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', key: '' },
        { name: 'status', type: 'VARCHAR(20)', key: '' }
      ],
      rowCount: 5430
    },
    order_items: {
      columns: [
        { name: 'item_id', type: 'INT', key: 'PRIMARY' },
        { name: 'order_id', type: 'INT', key: 'FOREIGN' },
        { name: 'product_id', type: 'INT', key: 'FOREIGN' },
        { name: 'quantity', type: 'INT', key: '' },
        { name: 'unit_price', type: 'DECIMAL(8,2)', key: '' }
      ],
      rowCount: 12890
    },
    products: {
      columns: [
        { name: 'product_id', type: 'INT', key: 'PRIMARY' },
        { name: 'product_name', type: 'VARCHAR(100)', key: '' },
        { name: 'category', type: 'VARCHAR(50)', key: '' },
        { name: 'price', type: 'DECIMAL(8,2)', key: '' },
        { name: 'stock_quantity', type: 'INT', key: '' }
      ],
      rowCount: 890
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (query !== assignment_data?.starterQuery) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [query]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setLastSaved(new Date());
      setIsAutoSaving(false);
      onSave({ query });
    }, 500);
  };

  const executeQuery = async () => {
    setIsExecuting(true);
    setErrors([]);
    setResults([]);
    
    const startTime = Date.now();
    
    // Add to query history
    setQueryHistory(prev => [{
      id: Date.now(),
      query: query?.trim(),
      timestamp: new Date()
    }, ...prev?.slice(0, 9)]);

    // Simulate query execution
    setTimeout(() => {
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      // Mock validation
      const queryErrors = [];
      const queryLower = query?.toLowerCase();
      
      if (!queryLower?.includes('select')) {
        queryErrors?.push({
          line: 1,
          message: "Query must contain a SELECT statement",
          type: "error"
        });
      }
      
      if (!queryLower?.includes('join') && queryLower?.includes('from')) {
        queryErrors?.push({
          line: 3,
          message: "Consider using JOIN for better performance",
          type: "warning"
        });
      }

      if (queryErrors?.length > 0) {
        setErrors(queryErrors);
        setIsExecuting(false);
        return;
      }

      // Mock successful results
      const mockResults = [
        { customer_name: 'John Smith', email: 'john.smith@email.com', total_spent: 2450.75 },
        { customer_name: 'Sarah Johnson', email: 'sarah.j@email.com', total_spent: 1890.50 },
        { customer_name: 'Mike Wilson', email: 'mike.wilson@email.com', total_spent: 1675.25 },
        { customer_name: 'Emily Davis', email: 'emily.davis@email.com', total_spent: 1520.00 },
        { customer_name: 'David Brown', email: 'david.brown@email.com', total_spent: 1445.80 }
      ];

      setResults(mockResults);
      setRowsAffected(mockResults?.length);
      setIsExecuting(false);
    }, 1500);
  };

  const handleSubmit = () => {
    const testResults = assignment_data?.testQueries?.map(test => ({
      ...test,
      passed: Math.random() > 0.2 // Mock test results
    }));

    const passedTests = testResults?.filter(test => test?.passed)?.length;
    const score = (passedTests / testResults?.length) * 100;

    onSubmit({
      query,
      results,
      testResults,
      score,
      executionTime,
      attempt: assignment_data?.currentAttempt
    });
  };

  const insertTableName = (tableName) => {
    const textarea = document.querySelector('.sql-editor');
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const newQuery = query?.substring(0, start) + tableName + query?.substring(end);
    setQuery(newQuery);
    
    // Reset cursor position
    setTimeout(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + tableName?.length, start + tableName?.length);
    }, 0);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    if (diff < 60) return `Saved ${diff}s ago`;
    return `Saved ${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className={`sql-query-runner h-full flex ${className}`}>
      {/* Schema Browser */}
      {showSchema && (
        <div className="w-80 border-r border-white/10 flex flex-col bg-muted/30">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name="Database" size={20} className="text-primary" />
                {assignment_data?.database}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSchema(false)}
                className="h-6 w-6"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {Object.entries(databaseSchema)?.map(([tableName, tableInfo]) => (
                <div key={tableName} className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSelectedTable(selectedTable === tableName ? null : tableName)}
                    className="w-full p-3 bg-background hover:bg-muted/50 transition-smooth flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="Table" size={16} className="text-accent" />
                      <span className="font-medium">{tableName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {tableInfo?.rowCount} rows
                      </span>
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`transition-transform ${selectedTable === tableName ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {selectedTable === tableName && (
                    <div className="border-t border-white/10">
                      <div className="p-2 space-y-1">
                        {tableInfo?.columns?.map((column) => (
                          <div
                            key={column?.name}
                            className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer"
                            onClick={() => insertTableName(column?.name)}
                          >
                            <div className="flex items-center gap-2">
                              <Icon 
                                name={column?.key === 'PRIMARY' ? 'Key' : column?.key === 'FOREIGN' ? 'Link' : 'Minus'} 
                                size={12} 
                                className={
                                  column?.key === 'PRIMARY' ? 'text-warning' :
                                  column?.key === 'FOREIGN'? 'text-primary' : 'text-muted-foreground'
                                }
                              />
                              <span className="text-sm font-mono">{column?.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{column?.type}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-2 border-t border-white/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => insertTableName(tableName)}
                          className="w-full justify-start text-xs"
                          iconName="Plus"
                          iconPosition="left"
                          iconSize={12}
                        >
                          Insert table name
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Main Query Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Database" size={20} className="text-primary" />
              <h3 className="font-semibold">{assignment_data?.title}</h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>Attempt {assignment_data?.currentAttempt}/{assignment_data?.maxAttempts}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showSchema && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSchema(true)}
                iconName="Database"
                iconPosition="left"
                iconSize={16}
              >
                Schema
              </Button>
            )}

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
          </div>
        </div>

        {/* Assignment Description */}
        <div className="p-4 bg-muted/50 border-b border-white/10">
          <p className="text-sm text-muted-foreground mb-2">
            {assignment_data?.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Timer" size={14} />
              {assignment_data?.timeLimit} minutes
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Columns" size={14} />
              Expected: {assignment_data?.expectedColumns?.join(', ')}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Query Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-white/10 bg-muted/30">
              <div className="flex items-center gap-2">
                <Icon name="FileText" size={16} />
                <span className="text-sm font-medium">SQL Query</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={executeQuery}
                  disabled={isExecuting || !query?.trim()}
                  iconName={isExecuting ? "Loader2" : "Play"}
                  iconPosition="left"
                  iconSize={16}
                  className={isExecuting ? "animate-spin" : ""}
                >
                  {isExecuting ? 'Executing...' : 'Execute Query'}
                </Button>
              </div>
            </div>

            <div className="flex-1 relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e?.target?.value)}
                className="sql-editor w-full h-full p-4 bg-background font-mono text-sm resize-none border-none outline-none"
                placeholder="Write your SQL query here..."
                spellCheck={false}
              />
              
              {/* Line numbers */}
              <div className="absolute left-0 top-0 p-4 pointer-events-none text-muted-foreground font-mono text-sm">
                {query?.split('\n')?.map((_, index) => (
                  <div key={index} className="h-5 leading-5">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors?.length > 0 && (
            <div className="border-t border-white/10 p-4 bg-error/5">
              <h4 className="font-medium text-error mb-2 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                Query Issues
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

          {/* Results Display */}
          {results?.length > 0 && (
            <div className="border-t border-white/10 flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h4 className="font-medium flex items-center gap-2">
                  <Icon name="Table" size={16} className="text-success" />
                  Query Results
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{rowsAffected} rows</span>
                  <span>{executionTime}ms</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {Object.keys(results?.[0] || {})?.map((column) => (
                          <th key={column} className="px-4 py-2 text-left text-sm font-medium border-b border-white/10">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results?.map((row, index) => (
                        <tr key={index} className="hover:bg-muted/30">
                          {Object.values(row)?.map((value, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 text-sm border-b border-white/10">
                              {typeof value === 'number' ? value?.toLocaleString() : value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Panel */}
        <div className="border-t border-white/10 p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {assignment_data?.maxAttempts - assignment_data?.currentAttempt} attempts remaining
            </div>
            
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={results?.length === 0 || isExecuting}
              iconName="Send"
              iconPosition="right"
              iconSize={16}
            >
              Submit Query
            </Button>
          </div>
        </div>
      </div>
      {/* Query History Sidebar */}
      {queryHistory?.length > 0 && (
        <div className="w-64 border-l border-white/10 bg-muted/30">
          <div className="p-4 border-b border-white/10">
            <h4 className="font-medium flex items-center gap-2">
              <Icon name="History" size={16} />
              Query History
            </h4>
          </div>
          
          <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
            {queryHistory?.map((historyItem) => (
              <button
                key={historyItem?.id}
                onClick={() => setQuery(historyItem?.query)}
                className="w-full p-2 text-left hover:bg-background rounded border border-white/10 transition-smooth"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {historyItem?.timestamp?.toLocaleTimeString()}
                </div>
                <div className="text-xs font-mono truncate">
                  {historyItem?.query?.split('\n')?.[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SQLQueryRunner;