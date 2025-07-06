'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Eye, Database, Settings, TrendingUp, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/hooks/useAdmin';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { loginAsAdmin } = useAdmin();
  const router = useRouter();

  const handleLogin = () => {
    // Simple password check for demo purposes
    if (password === 'admin123' || password === 'swee2025') {
      setIsAuthenticated(true);
      // Use the hook to login as admin
      loginAsAdmin({
        name: 'Admin User',
        email: 'admin@swee.com',
        role: 'ADMIN'
      });
    } else {
      alert('Invalid password. Try: admin123 or swee2025');
    }
  };

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter admin password to access all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="text-center"
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
            >
              Access Admin Panel
            </Button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Demo passwords:</p>
              <p className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mt-1">admin123</p>
              <p className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mt-1">swee2025</p>
            </div>
            <div className="text-center">
              <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                ← Back to homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="absolute top-0 right-0"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Access Granted
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Full access to all Swee platform features and admin tools
            </p>
            <Badge className="mt-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
              Administrator
            </Badge>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Data Management */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage('/admin/seed')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Database className="h-8 w-8 text-blue-600" />
                  <Badge variant="outline">Setup</Badge>
                </div>
                <CardTitle className="text-lg">Populate Sample Data</CardTitle>
                <CardDescription>
                  Create merchants, services, and test users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Setup Data
                </Button>
              </CardContent>
            </Card>

            {/* Admin Dashboard */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage('/admin')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <Badge variant="outline">Analytics</Badge>
                </div>
                <CardTitle className="text-lg">Admin Dashboard</CardTitle>
                <CardDescription>
                  View metrics, hard-sell reports, and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  View Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Platform Status */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage('/status')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Eye className="h-8 w-8 text-purple-600" />
                  <Badge variant="outline">Monitor</Badge>
                </div>
                <CardTitle className="text-lg">Platform Status</CardTitle>
                <CardDescription>
                  Feature completion and system overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Check Status
                </Button>
              </CardContent>
            </Card>

            {/* User Experience */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage('/quiz')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <User className="h-8 w-8 text-orange-600" />
                  <Badge variant="outline">Test</Badge>
                </div>
                <CardTitle className="text-lg">Take Quiz</CardTitle>
                <CardDescription>
                  Test the intelligent onboarding system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            {/* Search & Browse */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage('/search')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Settings className="h-8 w-8 text-red-600" />
                  <Badge variant="outline">Browse</Badge>
                </div>
                <CardTitle className="text-lg">Search Services</CardTitle>
                <CardDescription>
                  Browse merchants and test trust scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Search Now
                </Button>
              </CardContent>
            </Card>

            {/* Rewards System */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage('/rewards')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                  <Badge variant="outline">Rewards</Badge>
                </div>
                <CardTitle className="text-lg">Points & Rewards</CardTitle>
                <CardDescription>
                  Test the gamification system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  View Rewards
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Testing Flow */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Recommended Testing Flow
              </CardTitle>
              <CardDescription>
                Follow this sequence to test all major features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold text-sm">1</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Populate Sample Data</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create merchants, services, and test users</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold text-sm">2</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Take the Quiz</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Test the intelligent onboarding system</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold text-sm">3</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Browse Services</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Search and view personalized recommendations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold text-sm">4</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Check Admin Dashboard</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View analytics and hard-sell metrics</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold text-sm">5</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Review Platform Status</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verify all features are working</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  Back to Homepage
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  localStorage.removeItem('adminAccess');
                  localStorage.removeItem('adminUser');
                  setIsAuthenticated(false);
                }}
                variant="ghost"
              >
                Logout Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
