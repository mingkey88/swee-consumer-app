'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Building,
  Eye
} from 'lucide-react';

interface HardSellMetrics {
  totalReports: number;
  recentReports: number;
  topOffendingMerchants: Array<{
    id: number;
    name: string;
    reportCount: number;
    trustScore: number;
    lastReportDate: string;
  }>;
  reportsByMonth: Array<{
    month: string;
    count: number;
  }>;
}

interface AdminDashboardProps {
  isAdmin?: boolean;
}

export default function AdminDashboard({ isAdmin = false }: AdminDashboardProps) {
  const [metrics, setMetrics] = useState<HardSellMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchMetrics();
    }
  }, [isAdmin]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/hard-sell-metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError(data.error || 'Failed to load metrics');
      }
    } catch (err) {
      setError('Network error loading metrics');
      console.error('Admin metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockMetrics: HardSellMetrics = {
    totalReports: 47,
    recentReports: 8,
    topOffendingMerchants: [
      {
        id: 1,
        name: 'Pushy Beauty Studio',
        reportCount: 12,
        trustScore: 45.2,
        lastReportDate: '2025-01-03'
      },
      {
        id: 2,
        name: 'Aggressive Nails',
        reportCount: 8,
        trustScore: 58.1,
        lastReportDate: '2025-01-02'
      },
      {
        id: 3,
        name: 'Hard Sell Salon',
        reportCount: 6,
        trustScore: 62.3,
        lastReportDate: '2024-12-30'
      }
    ],
    reportsByMonth: [
      { month: 'Nov', count: 12 },
      { month: 'Dec', count: 15 },
      { month: 'Jan', count: 8 }
    ]
  };

  const displayMetrics = metrics || mockMetrics;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor trust & safety metrics</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{displayMetrics.totalReports}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{displayMetrics.recentReports}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Merchants</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Offending Merchants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Merchants with Hard-Sell Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayMetrics.topOffendingMerchants.map((merchant) => (
                  <div key={merchant.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{merchant.name}</p>
                      <p className="text-sm text-gray-600">
                        Last reported: {new Date(merchant.lastReportDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive">
                        {merchant.reportCount} reports
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${
                          merchant.trustScore < 60 
                            ? 'border-red-300 text-red-700' 
                            : 'border-yellow-300 text-yellow-700'
                        }`}
                      >
                        {merchant.trustScore.toFixed(1)} trust
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reports Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Hard-Sell Reports Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayMetrics.reportsByMonth.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{data.month} 2024</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(data.count / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{data.count}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Good news:</strong> Hard-sell reports decreased by 47% compared to last month, 
                  showing our trust score system is working effectively.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Flagged Merchants
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Shield className="h-4 w-4 mr-2" />
              Update Trust Scores
            </Button>
            <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
              <Users className="h-4 w-4 mr-2" />
              Send Safety Reminders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
