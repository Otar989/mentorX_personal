import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagement = ({ className = '' }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Александр Петров",
      email: "a.petrov@example.com",
      role: "student",
      status: "active",
      registrationDate: "2024-01-15",
      lastActive: "2024-08-26",
      coursesCompleted: 5,
      totalSpent: 15000
    },
    {
      id: 2,
      name: "Мария Иванова",
      email: "m.ivanova@company.ru",
      role: "company",
      status: "active",
      registrationDate: "2024-02-20",
      lastActive: "2024-08-25",
      coursesCompleted: 12,
      totalSpent: 45000
    },
    {
      id: 3,
      name: "Дмитрий Сидоров",
      email: "d.sidorov@gmail.com",
      role: "student",
      status: "suspended",
      registrationDate: "2024-03-10",
      lastActive: "2024-08-20",
      coursesCompleted: 2,
      totalSpent: 8000
    },
    {
      id: 4,
      name: "Елена Козлова",
      email: "e.kozlova@admin.com",
      role: "admin",
      status: "active",
      registrationDate: "2024-01-01",
      lastActive: "2024-08-26",
      coursesCompleted: 0,
      totalSpent: 0
    },
    {
      id: 5,
      name: "Игорь Морозов",
      email: "i.morozov@tech.ru",
      role: "student",
      status: "inactive",
      registrationDate: "2024-04-05",
      lastActive: "2024-07-15",
      coursesCompleted: 8,
      totalSpent: 25000
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'student', label: 'Student' },
    { value: 'company', label: 'Company' },
    { value: 'admin', label: 'Administrator' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-primary/10 text-primary',
      company: 'bg-secondary/10 text-secondary',
      admin: 'bg-error/10 text-error'
    };
    return colors?.[role] || 'bg-muted text-muted-foreground';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-warning/10 text-warning',
      suspended: 'bg-error/10 text-error'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterUsers(query, roleFilter, statusFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterUsers(searchQuery, role, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterUsers(searchQuery, roleFilter, status);
  };

  const filterUsers = (query, role, status) => {
    let filtered = users;

    if (query) {
      filtered = filtered?.filter(user =>
        user?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(query?.toLowerCase())
      );
    }

    if (role !== 'all') {
      filtered = filtered?.filter(user => user?.role === role);
    }

    if (status !== 'all') {
      filtered = filtered?.filter(user => user?.status === status);
    }

    setFilteredUsers(filtered);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev?.includes(userId)
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers?.length === filteredUsers?.length
        ? []
        : filteredUsers?.map(user => user?.id)
    );
  };

  const handleBulkAction = (action) => {
    setIsLoading(true);
    console.log(`Performing ${action} on users:`, selectedUsers);
    
    setTimeout(() => {
      if (action === 'delete') {
        setUsers(prev => prev?.filter(user => !selectedUsers?.includes(user?.id)));
        setFilteredUsers(prev => prev?.filter(user => !selectedUsers?.includes(user?.id)));
      } else if (action === 'activate') {
        setUsers(prev => prev?.map(user =>
          selectedUsers?.includes(user?.id) ? { ...user, status: 'active' } : user
        ));
      } else if (action === 'suspend') {
        setUsers(prev => prev?.map(user =>
          selectedUsers?.includes(user?.id) ? { ...user, status: 'suspended' } : user
        ));
      }
      
      setSelectedUsers([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev?.filter(user => user?.id !== userId));
      setFilteredUsers(prev => prev?.filter(user => user?.id !== userId));
    }
  };

  useEffect(() => {
    filterUsers(searchQuery, roleFilter, statusFilter);
  }, [users]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage platform users and their permissions
          </p>
        </div>
        
        <Button
          variant="default"
          onClick={() => setShowUserModal(true)}
          iconName="UserPlus"
          iconPosition="left"
          iconSize={16}
        >
          Add User
        </Button>
      </div>
      {/* Filters and Search */}
      <div className="glass-lg rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e?.target?.value)}
            className="md:col-span-2"
          />
          
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={handleRoleFilter}
            placeholder="Filter by role"
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusFilter}
            placeholder="Filter by status"
          />
        </div>

        {/* Bulk Actions */}
        {selectedUsers?.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium">
              {selectedUsers?.length} user(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('activate')}
                disabled={isLoading}
                iconName="UserCheck"
                iconSize={14}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('suspend')}
                disabled={isLoading}
                iconName="UserX"
                iconSize={14}
              >
                Suspend
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                disabled={isLoading}
                iconName="Trash2"
                iconSize={14}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Users Table */}
      <div className="glass-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-white/20 bg-white/10"
                  />
                </th>
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Role</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Courses</th>
                <th className="text-left p-4 font-semibold">Spent</th>
                <th className="text-left p-4 font-semibold">Last Active</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => handleUserSelect(user?.id)}
                      className="rounded border-white/20 bg-white/10"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                      {user?.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user?.status)}`}>
                      {user?.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{user?.coursesCompleted}</td>
                  <td className="p-4 text-sm">₽{user?.totalSpent?.toLocaleString('ru-RU')}</td>
                  <td className="p-4 text-sm">{user?.lastActive}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user?.id)}
                        className="h-8 w-8 text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers?.length === 0 && (
          <div className="p-12 text-center">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers?.length} of {users?.length} users
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">1</span>
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;