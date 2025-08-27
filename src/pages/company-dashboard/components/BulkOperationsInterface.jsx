import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkOperationsInterface = ({ onBulkOperation = () => {} }) => {
  const [activeOperation, setActiveOperation] = useState('invite');
  const [csvFile, setCsvFile] = useState(null);
  const [emailList, setEmailList] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState(null);

  const operations = [
    { id: 'invite', label: 'Bulk Invite', icon: 'UserPlus', description: 'Invite multiple employees via CSV or email list' },
    { id: 'assign', label: 'Course Assignment', icon: 'BookOpen', description: 'Assign courses to multiple users' },
    { id: 'role', label: 'Role Management', icon: 'Shield', description: 'Update user roles in bulk' },
    { id: 'export', label: 'Data Export', icon: 'Download', description: 'Export user data and progress reports' }
  ];

  const courseOptions = [
    { value: 'react-fundamentals', label: 'React Fundamentals' },
    { value: 'javascript-advanced', label: 'Advanced JavaScript' },
    { value: 'typescript-basics', label: 'TypeScript Basics' },
    { value: 'node-backend', label: 'Node.js Backend Development' },
    { value: 'database-design', label: 'Database Design & SQL' }
  ];

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'curator', label: 'Curator' },
    { value: 'admin', label: 'Administrator' }
  ];

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file && file?.type === 'text/csv') {
      setCsvFile(file);
      // Simulate file validation
      setTimeout(() => {
        setValidationResults({
          totalRows: 25,
          validRows: 23,
          invalidRows: 2,
          errors: [
            'Row 5: Invalid email format (john.doe@)',
            'Row 12: Missing required field (department)'
          ]
        });
      }, 1000);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const handleProcessOperation = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const operationData = {
      type: activeOperation,
      csvFile,
      emailList,
      selectedCourse,
      selectedRole,
      validationResults
    };
    
    onBulkOperation(operationData);
    setIsProcessing(false);
    
    // Reset form
    setCsvFile(null);
    setEmailList('');
    setValidationResults(null);
  };

  const downloadTemplate = (type) => {
    const templates = {
      invite: 'name,email,department,role\nИван Петров,ivan@company.ru,IT,student\nМария Иванова,maria@company.ru,Marketing,student',
      assign: 'email,course_id,deadline\nivan@company.ru,react-fundamentals,2025-12-31\nmaria@company.ru,javascript-advanced,2025-12-31',
      role: 'email,current_role,new_role\nivan@company.ru,student,curator\nmaria@company.ru,student,admin'
    };
    
    const blob = new Blob([templates[type] || templates.invite], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Bulk Operations</h2>
          <p className="text-sm text-muted-foreground">
            Manage multiple users and assignments efficiently
          </p>
        </div>
      </div>
      {/* Operation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {operations?.map((operation) => (
          <button
            key={operation?.id}
            onClick={() => setActiveOperation(operation?.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              activeOperation === operation?.id
                ? 'border-primary bg-primary/10' :'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon 
                name={operation?.icon} 
                size={20} 
                className={activeOperation === operation?.id ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="font-medium text-foreground">{operation?.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{operation?.description}</p>
          </button>
        ))}
      </div>
      {/* Operation Content */}
      <div className="space-y-6">
        {/* Bulk Invite */}
        {activeOperation === 'invite' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CSV Upload */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">CSV Upload</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </label>
                  </div>
                  
                  {csvFile && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="FileText" size={16} className="text-success" />
                        <span className="text-sm font-medium text-foreground">{csvFile?.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCsvFile(null)}
                          className="h-6 w-6 ml-auto"
                        >
                          <Icon name="X" size={12} />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => downloadTemplate('invite')}
                    fullWidth
                  >
                    Download CSV Template
                  </Button>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Manual Entry</h3>
                <div className="space-y-4">
                  <Input
                    label="Email Addresses"
                    description="Enter email addresses separated by commas or new lines"
                    value={emailList}
                    onChange={(e) => setEmailList(e?.target?.value)}
                    placeholder="ivan@company.ru, maria@company.ru"
                    className="h-32"
                  />
                  
                  <Select
                    label="Default Role"
                    options={roleOptions}
                    value={selectedRole}
                    onChange={setSelectedRole}
                  />
                </div>
              </div>
            </div>

            {/* Validation Results */}
            {validationResults && (
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Validation Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{validationResults?.totalRows}</p>
                    <p className="text-sm text-muted-foreground">Total Rows</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{validationResults?.validRows}</p>
                    <p className="text-sm text-muted-foreground">Valid Rows</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-error">{validationResults?.invalidRows}</p>
                    <p className="text-sm text-muted-foreground">Invalid Rows</p>
                  </div>
                </div>
                
                {validationResults?.errors?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Errors to Fix:</h4>
                    {validationResults?.errors?.map((error, index) => (
                      <div key={index} className="p-2 bg-error/10 border border-error/20 rounded text-sm text-error">
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Course Assignment */}
        {activeOperation === 'assign' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Course Selection</h3>
                <Select
                  label="Select Course"
                  options={courseOptions}
                  value={selectedCourse}
                  onChange={setSelectedCourse}
                  searchable
                />
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Assignment Details</h3>
                <div className="space-y-4">
                  <Input
                    label="Deadline"
                    type="date"
                    defaultValue="2025-12-31"
                  />
                  <Input
                    label="Custom Message"
                    placeholder="Optional message for learners"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Role Management */}
        {activeOperation === 'role' && (
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Role Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Current Role"
                options={roleOptions}
                placeholder="Filter by current role"
              />
              <Select
                label="New Role"
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
              />
            </div>
          </div>
        )}

        {/* Data Export */}
        {activeOperation === 'export' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'User Data', description: 'Export all user information and profiles', icon: 'Users' },
              { title: 'Progress Reports', description: 'Export learning progress and completion data', icon: 'BarChart3' },
              { title: 'Assessment Results', description: 'Export quiz and assignment scores', icon: 'FileText' },
              { title: 'Engagement Analytics', description: 'Export user activity and engagement metrics', icon: 'TrendingUp' },
              { title: 'Certificate Records', description: 'Export issued certificates and achievements', icon: 'Award' },
              { title: 'Billing History', description: 'Export payment and subscription data', icon: 'CreditCard' }
            ]?.map((exportType, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name={exportType?.icon} size={20} className="text-primary" />
                  <h4 className="font-medium text-foreground">{exportType?.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{exportType?.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                  onClick={() => onBulkOperation({ type: 'export', category: exportType?.title?.toLowerCase()?.replace(' ', '_') })}
                >
                  Export
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="text-sm text-muted-foreground">
            {activeOperation === 'invite' && (csvFile || emailList) && (
              <span>Ready to process {validationResults ? validationResults?.validRows : 'entries'}</span>
            )}
            {activeOperation === 'assign' && selectedCourse && (
              <span>Course assignment ready</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setCsvFile(null);
                setEmailList('');
                setValidationResults(null);
              }}
            >
              Reset
            </Button>
            <Button
              variant="default"
              loading={isProcessing}
              disabled={
                (activeOperation === 'invite' && !csvFile && !emailList) ||
                (activeOperation === 'assign' && !selectedCourse) ||
                isProcessing
              }
              onClick={handleProcessOperation}
            >
              {isProcessing ? 'Processing...' : 'Execute Operation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsInterface;