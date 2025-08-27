import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentManagement = ({ className = '' }) => {
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-001',
      userId: 1,
      userName: 'Александр Петров',
      userEmail: 'a.petrov@example.com',
      amount: 15000,
      currency: 'RUB',
      status: 'completed',
      paymentMethod: 'card',
      courseTitle: 'React Fundamentals',
      transactionDate: '2024-08-26T10:30:00',
      fiscalReceipt: 'FR-2024-001',
      yookassaId: 'YK-ABC123'
    },
    {
      id: 'TXN-002',
      userId: 2,
      userName: 'Мария Иванова',
      userEmail: 'm.ivanova@company.ru',
      amount: 45000,
      currency: 'RUB',
      status: 'pending',
      paymentMethod: 'bank_transfer',
      courseTitle: 'Corporate Training Package',
      transactionDate: '2024-08-26T09:15:00',
      fiscalReceipt: null,
      yookassaId: 'YK-DEF456'
    },
    {
      id: 'TXN-003',
      userId: 3,
      userName: 'Дмитрий Сидоров',
      userEmail: 'd.sidorov@gmail.com',
      amount: 25000,
      currency: 'RUB',
      status: 'failed',
      paymentMethod: 'card',
      courseTitle: 'Advanced JavaScript',
      transactionDate: '2024-08-25T16:45:00',
      fiscalReceipt: null,
      yookassaId: 'YK-GHI789'
    },
    {
      id: 'TXN-004',
      userId: 4,
      userName: 'Елена Козлова',
      userEmail: 'e.kozlova@tech.com',
      amount: 30000,
      currency: 'RUB',
      status: 'refunded',
      paymentMethod: 'card',
      courseTitle: 'Data Science Essentials',
      transactionDate: '2024-08-24T14:20:00',
      fiscalReceipt: 'FR-2024-002',
      yookassaId: 'YK-JKL012'
    },
    {
      id: 'TXN-005',
      userId: 5,
      userName: 'Игорь Морозов',
      userEmail: 'i.morozov@dev.ru',
      amount: 12000,
      currency: 'RUB',
      status: 'completed',
      paymentMethod: 'wallet',
      courseTitle: 'Python для начинающих',
      transactionDate: '2024-08-23T11:10:00',
      fiscalReceipt: 'FR-2024-003',
      yookassaId: 'YK-MNO345'
    }
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const paymentMethodOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'card', label: 'Bank Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'wallet', label: 'Digital Wallet' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      failed: 'bg-error/10 text-error',
      refunded: 'bg-secondary/10 text-secondary'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: 'CreditCard',
      bank_transfer: 'Building2',
      wallet: 'Wallet'
    };
    return icons?.[method] || 'DollarSign';
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterTransactions(query, statusFilter, paymentMethodFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterTransactions(searchQuery, status, paymentMethodFilter);
  };

  const handlePaymentMethodFilter = (method) => {
    setPaymentMethodFilter(method);
    filterTransactions(searchQuery, statusFilter, method);
  };

  const filterTransactions = (query, status, method) => {
    let filtered = transactions;

    if (query) {
      filtered = filtered?.filter(transaction =>
        transaction?.userName?.toLowerCase()?.includes(query?.toLowerCase()) ||
        transaction?.userEmail?.toLowerCase()?.includes(query?.toLowerCase()) ||
        transaction?.id?.toLowerCase()?.includes(query?.toLowerCase()) ||
        transaction?.courseTitle?.toLowerCase()?.includes(query?.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered?.filter(transaction => transaction?.status === status);
    }

    if (method !== 'all') {
      filtered = filtered?.filter(transaction => transaction?.paymentMethod === method);
    }

    setFilteredTransactions(filtered);
  };

  const handleRefund = (transactionId) => {
    setSelectedTransaction(transactions?.find(t => t?.id === transactionId));
    setShowRefundModal(true);
  };

  const processRefund = () => {
    if (selectedTransaction) {
      setTransactions(prev => prev?.map(transaction =>
        transaction?.id === selectedTransaction?.id
          ? { ...transaction, status: 'refunded' }
          : transaction
      ));
      setFilteredTransactions(prev => prev?.map(transaction =>
        transaction?.id === selectedTransaction?.id
          ? { ...transaction, status: 'refunded' }
          : transaction
      ));
    }
    setShowRefundModal(false);
    setSelectedTransaction(null);
  };

  const generateFiscalReceipt = (transactionId) => {
    const receiptId = `FR-2024-${String(Math.floor(Math.random() * 1000))?.padStart(3, '0')}`;
    setTransactions(prev => prev?.map(transaction =>
      transaction?.id === transactionId
        ? { ...transaction, fiscalReceipt: receiptId }
        : transaction
    ));
    setFilteredTransactions(prev => prev?.map(transaction =>
      transaction?.id === transactionId
        ? { ...transaction, fiscalReceipt: receiptId }
        : transaction
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalRevenue = transactions?.filter(t => t?.status === 'completed')?.reduce((sum, t) => sum + t?.amount, 0);

  const pendingAmount = transactions?.filter(t => t?.status === 'pending')?.reduce((sum, t) => sum + t?.amount, 0);

  const refundedAmount = transactions?.filter(t => t?.status === 'refunded')?.reduce((sum, t) => sum + t?.amount, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-muted-foreground">
            YooKassa integration with 54-FZ compliance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export Report
          </Button>
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
          >
            Sync YooKassa
          </Button>
        </div>
      </div>
      {/* Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold">₽{totalRevenue?.toLocaleString('ru-RU')}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {transactions?.filter(t => t?.status === 'completed')?.length} completed transactions
          </p>
        </div>

        <div className="glass-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-warning" />
            </div>
            <div>
              <h3 className="font-semibold">Pending</h3>
              <p className="text-2xl font-bold">₽{pendingAmount?.toLocaleString('ru-RU')}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {transactions?.filter(t => t?.status === 'pending')?.length} pending transactions
          </p>
        </div>

        <div className="glass-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="RotateCcw" size={24} className="text-error" />
            </div>
            <div>
              <h3 className="font-semibold">Refunded</h3>
              <p className="text-2xl font-bold">₽{refundedAmount?.toLocaleString('ru-RU')}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {transactions?.filter(t => t?.status === 'refunded')?.length} refunded transactions
          </p>
        </div>
      </div>
      {/* Filters */}
      <div className="glass-lg rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e?.target?.value)}
            className="md:col-span-2"
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusFilter}
            placeholder="Filter by status"
          />
          
          <Select
            options={paymentMethodOptions}
            value={paymentMethodFilter}
            onChange={handlePaymentMethodFilter}
            placeholder="Filter by method"
          />
        </div>
      </div>
      {/* Transactions Table */}
      <div className="glass-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left p-4 font-semibold">Transaction</th>
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Course</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Method</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.map((transaction) => (
                <tr key={transaction?.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{transaction?.id}</div>
                      <div className="text-sm text-muted-foreground">
                        YK: {transaction?.yookassaId}
                      </div>
                      {transaction?.fiscalReceipt && (
                        <div className="text-xs text-success">
                          Receipt: {transaction?.fiscalReceipt}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{transaction?.userName}</div>
                      <div className="text-sm text-muted-foreground">{transaction?.userEmail}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-sm line-clamp-2">
                      {transaction?.courseTitle}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">
                      ₽{transaction?.amount?.toLocaleString('ru-RU')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon name={getPaymentMethodIcon(transaction?.paymentMethod)} size={16} />
                      <span className="text-sm capitalize">
                        {transaction?.paymentMethod?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                      {transaction?.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {formatDate(transaction?.transactionDate)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {transaction?.status === 'completed' && !transaction?.fiscalReceipt && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generateFiscalReceipt(transaction?.id)}
                          className="h-8 w-8"
                          title="Generate Fiscal Receipt"
                        >
                          <Icon name="Receipt" size={14} />
                        </Button>
                      )}
                      {transaction?.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRefund(transaction?.id)}
                          className="h-8 w-8 text-error hover:text-error"
                          title="Process Refund"
                        >
                          <Icon name="RotateCcw" size={14} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="View Details"
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions?.length === 0 && (
          <div className="p-12 text-center">
            <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-lg rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                <Icon name="RotateCcw" size={24} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Process Refund</h3>
                <p className="text-sm text-muted-foreground">Transaction: {selectedTransaction?.id}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>User:</span>
                <span className="font-medium">{selectedTransaction?.userName}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">₽{selectedTransaction?.amount?.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex justify-between">
                <span>Course:</span>
                <span className="font-medium text-sm">{selectedTransaction?.courseTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRefundModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={processRefund}
                className="flex-1"
              >
                Process Refund
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;