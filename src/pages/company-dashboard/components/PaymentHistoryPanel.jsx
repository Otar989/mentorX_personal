import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PaymentHistoryPanel = ({ onManagePayment = () => {} }) => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const periodOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const paymentHistory = [
    {
      id: 'INV-2025-001',
      date: '2025-08-15',
      amount: 89000,
      currency: '₽',
      status: 'paid',
      description: 'Monthly subscription - Enterprise Plan',
      method: 'YooKassa',
      seats: 200,
      period: '2025-08-15 to 2025-09-15',
      fiscalReceipt: 'FR-2025-08-001'
    },
    {
      id: 'INV-2025-002',
      date: '2025-07-15',
      amount: 89000,
      currency: '₽',
      status: 'paid',
      description: 'Monthly subscription - Enterprise Plan',
      method: 'YooKassa',
      seats: 200,
      period: '2025-07-15 to 2025-08-15',
      fiscalReceipt: 'FR-2025-07-001'
    },
    {
      id: 'INV-2025-003',
      date: '2025-06-15',
      amount: 89000,
      currency: '₽',
      status: 'paid',
      description: 'Monthly subscription - Enterprise Plan',
      method: 'YooKassa',
      seats: 200,
      period: '2025-06-15 to 2025-07-15',
      fiscalReceipt: 'FR-2025-06-001'
    },
    {
      id: 'INV-2025-004',
      date: '2025-05-20',
      amount: 25000,
      currency: '₽',
      status: 'refunded',
      description: 'Additional seats purchase',
      method: 'YooKassa',
      seats: 50,
      period: 'One-time purchase',
      fiscalReceipt: 'FR-2025-05-002'
    },
    {
      id: 'INV-2025-005',
      date: '2025-09-15',
      amount: 89000,
      currency: '₽',
      status: 'pending',
      description: 'Monthly subscription - Enterprise Plan',
      method: 'YooKassa',
      seats: 200,
      period: '2025-09-15 to 2025-10-15',
      fiscalReceipt: null
    }
  ];

  const subscriptionInfo = {
    currentPlan: 'Enterprise',
    nextBilling: '2025-09-15',
    autoRenewal: true,
    paymentMethod: 'YooKassa',
    totalSpent: 445000,
    currency: '₽'
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      failed: 'bg-error/10 text-error',
      refunded: 'bg-muted text-muted-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      paid: 'CheckCircle',
      pending: 'Clock',
      failed: 'XCircle',
      refunded: 'RotateCcw'
    };
    return icons?.[status] || 'Circle';
  };

  const filteredPayments = paymentHistory?.filter(payment => {
    const matchesPeriod = filterPeriod === 'all' || 
      (filterPeriod === 'month' && new Date(payment.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (filterPeriod === 'quarter' && new Date(payment.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ||
      (filterPeriod === 'year' && new Date(payment.date) >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
    
    const matchesStatus = filterStatus === 'all' || payment?.status === filterStatus;
    
    return matchesPeriod && matchesStatus;
  });

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Payment & Billing</h2>
            <p className="text-sm text-muted-foreground">
              Manage your subscription and view payment history
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              iconName="Settings"
              iconPosition="left"
              iconSize={16}
              onClick={() => onManagePayment('settings')}
            >
              Billing Settings
            </Button>
            <Button
              variant="default"
              iconName="CreditCard"
              iconPosition="left"
              iconSize={16}
              onClick={() => onManagePayment('upgrade')}
            >
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Current Subscription */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Crown" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{subscriptionInfo?.currentPlan}</p>
                <p className="text-sm text-muted-foreground">Current Plan</p>
              </div>
            </div>
          </div>
          
          <div className="bg-success/5 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} className="text-success" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatDate(subscriptionInfo?.nextBilling)}</p>
                <p className="text-sm text-muted-foreground">Next Billing</p>
              </div>
            </div>
          </div>
          
          <div className="bg-accent/5 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="RefreshCw" size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {subscriptionInfo?.autoRenewal ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-sm text-muted-foreground">Auto Renewal</p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/5 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {formatAmount(subscriptionInfo?.totalSpent, subscriptionInfo?.currency)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment History */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
          
          <div className="flex items-center gap-3">
            <Select
              options={periodOptions}
              value={filterPeriod}
              onChange={setFilterPeriod}
              className="w-40"
            />
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-40"
            />
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              onClick={() => onManagePayment('export')}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Payment Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 font-medium text-foreground">Invoice</th>
                <th className="text-left p-3 font-medium text-foreground">Date</th>
                <th className="text-left p-3 font-medium text-foreground">Description</th>
                <th className="text-left p-3 font-medium text-foreground">Amount</th>
                <th className="text-left p-3 font-medium text-foreground">Status</th>
                <th className="text-left p-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments?.map((payment) => (
                <tr key={payment?.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-foreground">{payment?.id}</p>
                      {payment?.fiscalReceipt && (
                        <p className="text-xs text-muted-foreground">
                          Fiscal: {payment?.fiscalReceipt}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground">{formatDate(payment?.date)}</span>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="text-sm text-foreground">{payment?.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment?.seats} seats • {payment?.period}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-foreground">
                      {formatAmount(payment?.amount, payment?.currency)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={getStatusIcon(payment?.status)} 
                        size={16} 
                        className={payment?.status === 'paid' ? 'text-success' : 
                                  payment?.status === 'pending' ? 'text-warning' :
                                  payment?.status === 'failed' ? 'text-error' : 'text-muted-foreground'}
                      />
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment?.status)}`}>
                        {payment?.status?.charAt(0)?.toUpperCase() + payment?.status?.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Eye"
                        iconSize={16}
                        onClick={() => onManagePayment('view', payment?.id)}
                        title="View Details"
                      />
                      {payment?.status === 'paid' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="Download"
                          iconSize={16}
                          onClick={() => onManagePayment('download', payment?.id)}
                          title="Download Invoice"
                        />
                      )}
                      {payment?.fiscalReceipt && (
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="Receipt"
                          iconSize={16}
                          onClick={() => onManagePayment('receipt', payment?.fiscalReceipt)}
                          title="Download Fiscal Receipt"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No payments found</h3>
            <p className="text-muted-foreground">
              {filterPeriod !== 'all' || filterStatus !== 'all' ?'Try adjusting your filter criteria' :'Your payment history will appear here'
              }
            </p>
          </div>
        )}

        {/* Payment Summary */}
        {filteredPayments?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {filteredPayments?.filter(p => p?.status === 'paid')?.length}
                </p>
                <p className="text-sm text-muted-foreground">Successful Payments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {formatAmount(
                    filteredPayments?.filter(p => p?.status === 'paid')?.reduce((sum, p) => sum + p?.amount, 0),
                    '₽'
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Total Paid</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(
                    filteredPayments?.filter(p => p?.status === 'paid')?.reduce((sum, p) => sum + p?.amount, 0) / 12
                  )?.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-sm text-muted-foreground">Monthly Average</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPanel;