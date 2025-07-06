'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
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
import { User, Settings, LogOut, Shield, Database, TrendingUp } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import Link from 'next/link';

export default function AuthNavigation() {
  const { data: session, status } = useSession();
  const { isAdmin, adminUser, logoutAdmin } = useAdmin();

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

  // Regular authenticated user
  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                <AvatarFallback>
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
                <Settings className="mr-2 h-4 w-4" />
                <span>My Bookings</span>
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
