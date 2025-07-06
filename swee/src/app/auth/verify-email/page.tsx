'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Check your email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            <p className="text-gray-600">
              We've sent you a magic link to sign in to your account.
            </p>
            <p className="text-sm text-gray-500">
              Click the link in your email to continue. The link will expire in 10 minutes.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>Didn't receive the email?</strong><br />
              Check your spam folder or try signing in again.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/signin" className="w-full">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Back to Sign In
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
