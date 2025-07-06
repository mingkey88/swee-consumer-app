'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, AlertCircle, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignInPage() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorType = searchParams.get('error');

  useEffect(() => {
    const loadProviders = async () => {
      const availableProviders = await getProviders();
      if (availableProviders) {
        setProviders(availableProviders);
      }
    };
    loadProviders();
  }, []);

  useEffect(() => {
    if (errorType) {
      switch (errorType) {
        case 'Configuration':
          setError('There is a problem with the server configuration.');
          break;
        case 'AccessDenied':
          setError('Access denied. Please check your credentials.');
          break;
        case 'Verification':
          setError('The verification token has expired or has already been used.');
          break;
        default:
          setError('An error occurred during sign in. Please try again.');
      }
    }
  }, [errorType]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // Email sign-in disabled for Google OAuth only setup
    setError('Email sign-in is not available. Please use Google OAuth.');
  };

  const handleProviderSignIn = async (providerId: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(providerId, {
        callbackUrl,
      });
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
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
          <CardTitle className="text-xl text-gray-700 dark:text-gray-300">
            Sign in to your Swee account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* OAuth Providers */}
          <div className="space-y-3">
            {Object.values(providers).map((provider) => {
              if (provider.type === 'oauth') {
                return (
                  <Button
                    key={provider.id}
                    variant="outline"
                    className="w-full"
                    onClick={() => handleProviderSignIn(provider.id)}
                    disabled={isLoading}
                  >
                    {provider.id === 'google' && (
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    {provider.id === 'github' && <Github className="h-4 w-4 mr-2" />}
                    Continue with {provider.name}
                  </Button>
                );
              }
              return null;
            })}
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/quiz" className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">
                Sign up with our quick quiz
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
