'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, User, Mail, Calendar, Award, TrendingUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/hooks/useAdmin';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const { isAdmin, adminUser } = useAdmin();

  useEffect(() => {
    if (isAdmin && adminUser) {
      setUser(adminUser);
    }
  }, [isAdmin, adminUser]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please login to view your profile</p>
          <Link href="/admin/login">
            <Button>Login as Admin</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your account and preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-[3px] border-orange-500 transition-colors duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Avatar className="h-24 w-24 border-4 border-orange-200 dark:border-orange-300">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} />
                      <AvatarFallback className="bg-orange-100 dark:bg-orange-200 text-orange-600 dark:text-orange-700 text-2xl">
                        {user.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">{user.name}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">{user.email}</CardDescription>
                  {isAdmin && (
                    <Badge className="mt-2 bg-orange-100 dark:bg-orange-200 text-orange-800 dark:text-orange-700">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrator
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Joined July 2025</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Role: {user.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Stats */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-[3px] border-orange-500 transition-colors duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-white">Platform Status</CardTitle>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 mb-1">11/11</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Features Complete</p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-[3px] border-orange-500 transition-colors duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-white">Admin Level</CardTitle>
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 mb-1">Full Access</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">All permissions</p>
                  </CardContent>
                </Card>

              </div>

              {/* Admin Actions */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-[3px] border-orange-500 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Actions
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Quick access to admin tools and features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/admin/seed">
                      <Button className="w-full" variant="outline">
                        Populate Sample Data
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button className="w-full" variant="outline">
                        Admin Dashboard
                      </Button>
                    </Link>
                    <Link href="/status">
                      <Button className="w-full" variant="outline">
                        Platform Status
                      </Button>
                    </Link>
                    <Link href="/quiz">
                      <Button className="w-full" variant="outline">
                        Test Quiz System
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-[3px] border-orange-500 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Your recent actions on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Admin access granted</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Platform status reviewed</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Features tested</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
