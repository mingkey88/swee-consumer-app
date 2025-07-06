'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const errorMessages = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please check your credentials.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The verification token has expired or has already been used.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error') || 'Default';
  
  const error = errorMessages[errorType as keyof typeof errorMessages] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            {error.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600">
            {error.description}
          </p>

          <div className="space-y-3">
            <Link href="/auth/signin" className="w-full">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Need help? Contact support at help@swee.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
