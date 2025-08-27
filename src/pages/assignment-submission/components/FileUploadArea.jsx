import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadArea = ({ 
  assignment = {},
  onFileUpload = () => {},
  onSubmit = () => {},
  className = ''
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [githubUrl, setGithubUrl] = useState('');
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const fileInputRef = useRef(null);

  // Mock assignment data
  const mockAssignment = {
    id: 1,
    title: "React Portfolio Project",
    description: "Build a complete portfolio website using React with responsive design and modern features",
    type: "project",
    maxFileSize: 50, // MB
    allowedTypes: ['.zip', '.rar', '.tar.gz', '.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.md'],
    maxFiles: 10,
    requiresGithub: true,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    submissionGuidelines: [
      "Include a README.md file with setup instructions",
      "Ensure all dependencies are listed in package.json",
      "Code should be well-commented and follow best practices",
      "Include screenshots of the final application",
      "Provide a live demo link if deployed"
    ]
  };

  const assignment_data = assignment?.id ? assignment : mockAssignment;

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      // Check file type
      const fileExtension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
      const isValidType = assignment_data?.allowedTypes?.some(type => 
        fileExtension === type || file?.type?.includes(type?.replace('.', ''))
      );
      
      // Check file size
      const isValidSize = file?.size <= assignment_data?.maxFileSize * 1024 * 1024;
      
      return isValidType && isValidSize;
    });

    if (validFiles?.length !== files?.length) {
      alert(`Some files were rejected. Please check file types and size limits.`);
    }

    // Check total file count
    if (uploadedFiles?.length + validFiles?.length > assignment_data?.maxFiles) {
      alert(`Maximum ${assignment_data?.maxFiles} files allowed.`);
      return;
    }

    // Simulate file upload
    validFiles?.forEach(file => {
      const fileId = Date.now() + Math.random();
      const fileData = {
        id: fileId,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        uploadedAt: new Date(),
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, fileData]);
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev?.[fileId] || 0;
          const newProgress = Math.min(currentProgress + Math.random() * 20, 100);
          
          if (newProgress >= 100) {
            clearInterval(uploadInterval);
            setUploadedFiles(prevFiles => 
              prevFiles?.map(f => 
                f?.id === fileId ? { ...f, status: 'completed' } : f
              )
            );
            onFileUpload(fileData);
          }
          
          return { ...prev, [fileId]: newProgress };
        });
      }, 200);
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev?.filter(f => f?.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress?.[fileId];
      return newProgress;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      'js': 'FileText',
      'jsx': 'FileText',
      'ts': 'FileText',
      'tsx': 'FileText',
      'css': 'Palette',
      'scss': 'Palette',
      'json': 'Braces',
      'md': 'FileText',
      'zip': 'Archive',
      'rar': 'Archive',
      'tar': 'Archive',
      'gz': 'Archive',
      'png': 'Image',
      'jpg': 'Image',
      'jpeg': 'Image',
      'gif': 'Image',
      'pdf': 'FileText'
    };
    return iconMap?.[extension] || 'File';
  };

  const connectGithub = async () => {
    if (!githubUrl?.trim()) return;
    
    setIsConnectingGithub(true);
    
    // Simulate GitHub connection
    setTimeout(() => {
      const repoData = {
        id: Date.now(),
        name: githubUrl?.split('/')?.pop(),
        url: githubUrl,
        type: 'github',
        uploadedAt: new Date(),
        status: 'completed'
      };
      
      setUploadedFiles(prev => [...prev, repoData]);
      setGithubUrl('');
      setIsConnectingGithub(false);
      onFileUpload(repoData);
    }, 2000);
  };

  const handleSubmit = () => {
    if (uploadedFiles?.length === 0) {
      alert('Please upload at least one file before submitting.');
      return;
    }

    const completedFiles = uploadedFiles?.filter(f => f?.status === 'completed');
    if (completedFiles?.length !== uploadedFiles?.length) {
      alert('Please wait for all files to finish uploading.');
      return;
    }

    onSubmit({
      files: uploadedFiles,
      githubIntegration: uploadedFiles?.some(f => f?.type === 'github'),
      submittedAt: new Date()
    });
  };

  const getDaysUntilDue = () => {
    const now = new Date();
    const due = new Date(assignment_data.dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`file-upload-area h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Upload" size={20} className="text-primary" />
            <h3 className="font-semibold">{assignment_data?.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Due in {getDaysUntilDue()} days</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {uploadedFiles?.length}/{assignment_data?.maxFiles} files
        </div>
      </div>
      {/* Assignment Description */}
      <div className="p-4 bg-muted/50 border-b border-white/10">
        <p className="text-sm text-muted-foreground mb-3">
          {assignment_data?.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Submission Guidelines:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {assignment_data?.submissionGuidelines?.map((guideline, index) => (
              <li key={index} className="flex items-start gap-2">
                <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                {guideline}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-1 flex">
        {/* Upload Area */}
        <div className="flex-1 p-6">
          {/* Drag and Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-primary bg-primary/5' :'border-white/20 hover:border-white/40'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragging ? 'Drop files here' : 'Upload Project Files'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="FolderOpen"
              iconPosition="left"
              iconSize={16}
            >
              Browse Files
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={assignment_data?.allowedTypes?.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Max file size: {assignment_data?.maxFileSize}MB</p>
              <p>Allowed types: {assignment_data?.allowedTypes?.join(', ')}</p>
            </div>
          </div>

          {/* GitHub Integration */}
          {assignment_data?.requiresGithub && (
            <div className="mt-6 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Github" size={20} />
                <h4 className="font-semibold">GitHub Repository</h4>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e?.target?.value)}
                  placeholder="https://github.com/username/repository"
                  className="flex-1 px-3 py-2 border border-white/20 rounded-lg bg-background"
                />
                <Button
                  variant="outline"
                  onClick={connectGithub}
                  disabled={!githubUrl?.trim() || isConnectingGithub}
                  iconName={isConnectingGithub ? "Loader2" : "Link"}
                  iconPosition="left"
                  iconSize={16}
                  className={isConnectingGithub ? "animate-spin" : ""}
                >
                  {isConnectingGithub ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Link your GitHub repository for version control integration
              </p>
            </div>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Files" size={16} />
                Uploaded Files ({uploadedFiles?.length})
              </h4>
              
              <div className="space-y-2">
                {uploadedFiles?.map((file) => (
                  <div
                    key={file?.id}
                    className="flex items-center gap-3 p-3 border border-white/10 rounded-lg bg-background"
                  >
                    <Icon 
                      name={file?.type === 'github' ? 'Github' : getFileIcon(file?.name)} 
                      size={20} 
                      className="text-primary flex-shrink-0" 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{file?.name}</span>
                        <div className="flex items-center gap-2">
                          {file?.status === 'uploading' && (
                            <span className="text-sm text-muted-foreground">
                              {Math.round(uploadProgress?.[file?.id] || 0)}%
                            </span>
                          )}
                          {file?.status === 'completed' && (
                            <Icon name="CheckCircle" size={16} className="text-success" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(file?.id)}
                            className="h-6 w-6 text-error hover:text-error"
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {file?.type !== 'github' && <span>{formatFileSize(file?.size)}</span>}
                        <span>•</span>
                        <span>{file?.uploadedAt?.toLocaleTimeString()}</span>
                      </div>
                      
                      {file?.status === 'uploading' && (
                        <div className="w-full bg-muted rounded-full h-1 mt-2">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress?.[file?.id] || 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submission Panel */}
        <div className="w-80 border-l border-white/10 bg-muted/30">
          <div className="p-4 border-b border-white/10">
            <h4 className="font-semibold">Submission Details</h4>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Files uploaded:</span>
                <span className="font-medium">{uploadedFiles?.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Total size:</span>
                <span className="font-medium">
                  {formatFileSize(uploadedFiles?.reduce((sum, f) => sum + (f?.size || 0), 0))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>GitHub linked:</span>
                <span className="font-medium">
                  {uploadedFiles?.some(f => f?.type === 'github') ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={14} />
                  <span>Due: {assignment_data?.dueDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={14} />
                  <span>Time left: {getDaysUntilDue()} days</span>
                </div>
              </div>
            </div>

            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={uploadedFiles?.length === 0}
              className="w-full"
              iconName="Send"
              iconPosition="right"
              iconSize={16}
            >
              Submit Project
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Make sure all files are uploaded before submitting
            </p>
          </div>

          {/* Plagiarism Check Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning mb-1">Plagiarism Check</p>
                <p className="text-muted-foreground">
                  All submissions are automatically checked for plagiarism and similarity with other students' work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;