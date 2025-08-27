import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeManagementTable = ({ onBulkAction = () => {} }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const employees = [
    {
      id: 1,
      name: "Александр Петров",
      email: "a.petrov@company.ru",
      department: "IT Development",
      enrolledCourses: 5,
      completedCourses: 3,
      progress: 85,
      status: "active",
      lastActivity: "2025-08-26",
      role: "Senior Developer"
    },
    {
      id: 2,
      name: "Мария Иванова",
      email: "m.ivanova@company.ru",
      department: "Marketing",
      enrolledCourses: 3,
      completedCourses: 2,
      progress: 67,
      status: "active",
      lastActivity: "2025-08-25",
      role: "Marketing Manager"
    },
    {
      id: 3,
      name: "Дмитрий Сидоров",
      email: "d.sidorov@company.ru",
      department: "Sales",
      enrolledCourses: 4,
      completedCourses: 1,
      progress: 25,
      status: "inactive",
      lastActivity: "2025-08-20",
      role: "Sales Representative"
    },
    {
      id: 4,
      name: "Елена Козлова",
      email: "e.kozlova@company.ru",
      department: "HR",
      enrolledCourses: 6,
      completedCourses: 5,
      progress: 92,
      status: "active",
      lastActivity: "2025-08-26",
      role: "HR Specialist"
    },
    {
      id: 5,
      name: "Андрей Морозов",
      email: "a.morozov@company.ru",
      department: "Finance",
      enrolledCourses: 2,
      completedCourses: 0,
      progress: 15,
      status: "pending",
      lastActivity: "2025-08-24",
      role: "Financial Analyst"
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-error/10 text-error',
      pending: 'bg-warning/10 text-warning'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const filteredEmployees = employees?.filter(emp => {
      const matchesSearch = emp?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           emp?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           emp?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || emp?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      if (sortConfig?.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees?.map(emp => emp?.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId, checked) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev?.filter(id => id !== employeeId));
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const isAllSelected = selectedEmployees?.length === filteredEmployees?.length && filteredEmployees?.length > 0;
  const isIndeterminate = selectedEmployees?.length > 0 && selectedEmployees?.length < filteredEmployees?.length;

  return (
    <div className="glass rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Employee Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage employee enrollments and track learning progress
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            iconName="Upload"
            iconPosition="left"
            iconSize={16}
            onClick={() => onBulkAction('upload')}
          >
            Import CSV
          </Button>
          <Button
            variant="default"
            iconName="UserPlus"
            iconPosition="left"
            iconSize={16}
            onClick={() => onBulkAction('invite')}
          >
            Invite Employee
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedEmployees?.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg mb-4">
          <span className="text-sm font-medium">
            {selectedEmployees?.length} employee{selectedEmployees?.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              iconSize={14}
              onClick={() => onBulkAction('email', selectedEmployees)}
            >
              Send Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="BookOpen"
              iconSize={14}
              onClick={() => onBulkAction('assign', selectedEmployees)}
            >
              Assign Course
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconSize={14}
              onClick={() => onBulkAction('export', selectedEmployees)}
            >
              Export
            </Button>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
              </th>
              <th 
                className="text-left p-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Employee</span>
                  <Icon 
                    name={sortConfig?.key === 'name' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </div>
              </th>
              <th className="text-left p-3 font-medium text-foreground">Department</th>
              <th className="text-left p-3 font-medium text-foreground">Courses</th>
              <th 
                className="text-left p-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Progress</span>
                  <Icon 
                    name={sortConfig?.key === 'progress' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </div>
              </th>
              <th className="text-left p-3 font-medium text-foreground">Status</th>
              <th className="text-left p-3 font-medium text-foreground">Last Activity</th>
              <th className="text-left p-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((employee) => (
              <tr key={employee?.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => handleSelectEmployee(employee?.id, e?.target?.checked)}
                    className="rounded border-white/20 bg-white/10"
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {employee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{employee?.name}</p>
                      <p className="text-sm text-muted-foreground">{employee?.email}</p>
                      <p className="text-xs text-muted-foreground">{employee?.role}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-sm text-foreground">{employee?.department}</span>
                </td>
                <td className="p-3">
                  <div className="text-sm">
                    <span className="text-foreground font-medium">{employee?.completedCourses}</span>
                    <span className="text-muted-foreground">/{employee?.enrolledCourses}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{employee?.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="progress-ambient h-2 rounded-full transition-all duration-500"
                        style={{ width: `${employee?.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee?.status)}`}>
                    {employee?.status?.charAt(0)?.toUpperCase() + employee?.status?.slice(1)}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-muted-foreground">{employee?.lastActivity}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Eye"
                      iconSize={16}
                      onClick={() => console.log('View employee', employee?.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Edit"
                      iconSize={16}
                      onClick={() => console.log('Edit employee', employee?.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="MoreHorizontal"
                      iconSize={16}
                      onClick={() => console.log('More actions', employee?.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredEmployees?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'Start by inviting employees to join your training program'}
          </p>
          <Button
            variant="default"
            iconName="UserPlus"
            iconPosition="left"
            iconSize={16}
            onClick={() => onBulkAction('invite')}
          >
            Invite First Employee
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementTable;