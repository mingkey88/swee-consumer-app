'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Moon, Sun, Menu, X, User, Settings, LogOut, Shield, Database, TrendingUp, Heart, Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode: isDarkMode, toggleDarkMode } = useTheme();
  const { isAdmin, adminUser, logoutAdmin } = useAdmin();
  const { data: session, status } = useSession();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (location) params.set('location', location);
    
    const searchUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    window.location.href = searchUrl;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderAuthSection = () => {
    if (status === 'loading') {
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      );
    }

    // Admin mode
    if (isAdmin && adminUser) {
      return (
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
            <Shield className="h-3 w-3 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-orange-800 dark:text-orange-300">Admin</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                  <AvatarFallback className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                    {adminUser.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{adminUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminUser.email}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Shield className="h-3 w-3 text-orange-600" />
                    <span className="text-xs text-orange-600 font-medium">Administrator</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/seed">
                  <Database className="mr-2 h-4 w-4" />
                  <span>Populate Data</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/status">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Platform Status</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  logoutAdmin();
                  window.location.reload();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout Admin</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    // Regular authenticated user
    if (session) {
      return (
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                  <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                  <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bookings">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/rewards">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Rewards</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    // Unauthenticated user
    return (
      <div className="flex items-center space-x-3">
        <Link href="/auth/signin">
          <Button variant="ghost" className="hidden sm:inline-flex text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Sign in
          </Button>
        </Link>
        <Link href="/quiz">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
            Sign up
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Swee</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/search" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Browse
            </Link>
            <Link 
              href="/rewards" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Rewards
            </Link>
            <Link 
              href="#" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Business
            </Link>
            <Link 
              href="#" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Help
            </Link>
          </div>

          {/* Search Bar - Hidden on smaller screens */}
          <div className="hidden lg:flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-2 max-w-md flex-1 mx-8">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            />
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <MapPin className="h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-sm w-24"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Admin Login Link for Non-Admin Users */}
            {!isAdmin && (
              <Link 
                href="/admin/login" 
                className="hidden md:inline-flex text-sm text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Admin
              </Link>
            )}

            {/* Auth Section */}
            {renderAuthSection()}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-sm flex-1"
                />
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-sm flex-1"
                />
              </div>
              
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/search" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse
                </Link>
                <Link 
                  href="/rewards" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rewards
                </Link>
                <Link 
                  href="#" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Business
                </Link>
                <Link 
                  href="#" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Help
                </Link>
                
                {/* Admin Link for Mobile */}
                {!isAdmin && (
                  <Link 
                    href="/admin/login" 
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
