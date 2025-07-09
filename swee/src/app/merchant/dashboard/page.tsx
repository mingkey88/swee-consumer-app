'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star,
  ShoppingBag,
  Clock
} from 'lucide-react';

export default function MerchantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/merchant/auth/signin');
      return;
    }
    
    // Check if user has merchant role
    if (session.user?.role !== 'MERCHANT') {
      router.push('/merchant/auth/signup');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'MERCHANT') {
    return null;
  }

  return (
    <div className="p-6">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Good morning, {session.user?.name?.split(' ')[0]}!</h2>
              <p className="text-slate-200 opacity-90 mb-4">
                Here&apos;s what&apos;s happening with your business today
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-slate-200 opacity-80">Today&apos;s appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$340</div>
                  <div className="text-sm text-slate-200 opacity-80">Today&apos;s revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm text-slate-200 opacity-80">New messages</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => router.push('/merchant/calendar')}
              >
                View Calendar
              </Button>
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => router.push('/merchant/services')}
              >
                Manage Services
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">$2,450</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+12.5%</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">23</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+3</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from yesterday</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Trust Score</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">4.8</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>127 reviews</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">89</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+7</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">new this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800 hover:scale-105"
                onClick={() => router.push('/merchant/services')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-amber-600 to-orange-700 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Manage Services</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Add, edit, or remove services</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800 hover:scale-105"
                onClick={() => router.push('/merchant/calendar')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">View Calendar</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Manage appointments & availability</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800 hover:scale-105"
                onClick={() => router.push('/merchant/payments')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Track earnings & performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your latest bookings and business updates
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">New booking from Sarah Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hair Cut & Style • Tomorrow 2:00 PM</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">2h ago</div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">Payment received</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">$85.00 for Facial Treatment</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">5h ago</div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">New 5-star review</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">From Maria Rodriguez</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1d ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
