'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MerchantSidebar from './MerchantSidebar';

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/merchant/auth/signin');
      return;
    }
    
    if (session.user?.role !== 'MERCHANT') {
      router.push('/merchant/auth/signin');
      return;
    }
  }, [session, status, router]);

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

  if (!session || session.user?.role !== 'MERCHANT') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MerchantSidebar />
      <main className="flex-1 md:ml-64">
        {children}
      </main>
    </div>
  );
}
