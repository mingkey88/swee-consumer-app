'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import MerchantSidebar from './MerchantSidebar';

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on an auth page
  const isAuthPage = pathname?.includes('/merchant/auth/');

  useEffect(() => {
    if (status === 'loading') return;
    
    // Don't redirect if we're on auth pages
    if (isAuthPage) return;
    
    if (!session) {
      router.push('/merchant/auth/signin');
      return;
    }
    
    if (session.user?.role !== 'MERCHANT') {
      router.push('/merchant/auth/signin');
      return;
    }
  }, [session, status, router, isAuthPage]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // For auth pages, don't show sidebar and don't require authentication
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  // For non-auth pages, require merchant authentication
  if (!session || session.user?.role !== 'MERCHANT') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MerchantSidebar />
      <main className="flex-1 md:ml-72">
        {children}
      </main>
    </div>
  );
}
