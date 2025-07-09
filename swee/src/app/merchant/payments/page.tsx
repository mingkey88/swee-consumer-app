'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Download,
  AlertCircle,
  CreditCard,
  Wallet
} from 'lucide-react';

interface PaymentData {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
  recentTransactions: Transaction[];
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  booking: {
    service: {
      title: string;
    };
    user: {
      name: string;
    };
  };
}

export default function MerchantPayments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'MERCHANT') {
      router.push('/merchant/auth/signin');
      return;
    }

    fetchPaymentData();
  }, [session, status, router]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/merchant/payments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment data');
      }

      const data = await response.json();
      setPaymentData(data);
    } catch (err) {
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'RELEASED': return 'bg-blue-100 text-blue-800';
      case 'REFUNDED': return 'bg-red-100 text-red-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading payments...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'MERCHANT') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Payments & Analytics
              </h1>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {paymentData && (
          <>
            {/* Payment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(paymentData.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All-time earnings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(paymentData.monthlyRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className={`flex items-center ${paymentData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {paymentData.monthlyGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(paymentData.monthlyGrowth)}% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(paymentData.pendingPayments)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    In escrow
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(paymentData.completedPayments)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Released to account
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Escrow Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Escrow Protection
                </CardTitle>
                <CardDescription>
                  How Swee's escrow system protects both you and your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    Escrow Payment Flow
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Customer pays upfront when booking</li>
                    <li>• Funds are held in escrow until service completion</li>
                    <li>• Payment is released to you after service is confirmed</li>
                    <li>• No hard-selling pressure - payment is guaranteed</li>
                    <li>• Refunds processed automatically for cancellations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest payment activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentData.recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  ) : (
                    paymentData.recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.booking.service.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.booking.user.name} • {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getStatusColor(transaction.status)} border-0`}>
                            {transaction.status}
                          </Badge>
                          <span className="font-semibold">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
