'use client';

import { useSession, signOut } from 'next-auth/react';
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
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Database, 
  TrendingUp, 
  Calendar,
  Heart,
  CreditCard,
  FileText,
  ShoppingBag,
  HelpCircle,
  Download,
  Globe,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import Link from 'next/link';

export default function AuthNavigation() {
  const { data: session, status } = useSession();
  const { isAdmin, adminUser, logoutAdmin } = useAdmin();

  // Mock user for demonstration (remove this in production)
  const mockUser = {
    name: "Bella Chen",
    email: "bella.chen@example.com",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-20 h-9 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-9 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  // Admin mode
  if (isAdmin && adminUser) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
          <Shield className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">Admin Mode</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border-2 border-orange-200">
                <AvatarFallback className="bg-orange-100 text-orange-600">
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

  // Regular authenticated user (or mock user for demo)
  if (session || true) { // Show mock user for demonstration
    return (
      <div className="flex items-center space-x-4">
        <Link href="/for-business">
          <Button variant="outline" className="hidden sm:inline-flex bg-white hover:bg-gray-50 border-gray-200 text-gray-700">
            List your business
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 px-3 py-2 rounded-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 transition-all">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={mockUser.image} 
                    alt={mockUser.name} 
                  />
                  <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                    B
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mockUser.email}
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
              <Link href="/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Appointments</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/wallet">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Wallet</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/favorites">
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/forms">
                <FileText className="mr-2 h-4 w-4" />
                <span>Forms</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Product orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/download">
                <Download className="mr-2 h-4 w-4" />
                <span>Download the app</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/support">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help and support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/language">
                <Globe className="mr-2 h-4 w-4" />
                <span>English</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/for-business" className="text-orange-600 hover:text-orange-700">
                <span>For businesses</span>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/auth/signin">
        <Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
      </Link>
      <Link href="/quiz">
        <Button className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500">
          Sign up
        </Button>
      </Link>
    </div>
  );
}
