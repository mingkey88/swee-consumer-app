'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Building, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/merchant/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Profile',
    href: '/merchant/profile',
    icon: Building
  },
  {
    title: 'Services',
    href: '/merchant/services',
    icon: ShoppingBag
  },
  {
    title: 'Calendar',
    href: '/merchant/calendar',
    icon: Calendar
  },
  {
    title: 'Payments',
    href: '/merchant/payments',
    icon: CreditCard
  }
];

export default function MerchantSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!session || session.user?.role !== 'MERCHANT') {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white dark:bg-gray-800 shadow-lg border-gray-200 dark:border-gray-700"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-slate-700 to-slate-800">
            <Link href="/merchant/dashboard" className="text-2xl font-bold text-white">
              Swee Business
            </Link>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {session.user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {session.user?.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Business Owner
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-500/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                  {item.title}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Quick Stats Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Trust Score</div>
                </div>
              </CardContent>
            </Card>

            {/* Back to Main Site Button */}
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeft className="w-5 h-5 mr-3" />
                Back to Main Site
              </Button>
            </Link>

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}