'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, DollarSign, Target, TrendingUp, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RecommendedService {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  merchant: {
    id: number;
    name: string;
    address: string;
    trustScore: number;
  };
  score: number;
  reasons: string[];
  matchPercentage: number;
}

interface PersonalizedRecommendationsProps {
  limit?: number;
  showHeader?: boolean;
}

export default function PersonalizedRecommendations({ 
  limit = 6, 
  showHeader = true 
}: PersonalizedRecommendationsProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<RecommendedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations.slice(0, limit));
      } else {
        // Handle authentication error gracefully
        if (data.error === 'Authentication required') {
          setError('Sign in to see personalized recommendations');
        } else {
          setError(data.error || 'Failed to load recommendations');
        }
      }
    } catch (err) {
      setError('Network error loading recommendations');
      console.error('Recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (serviceId: number, merchantId: number) => {
    router.push(`/providers/${merchantId}?serviceId=${serviceId}`);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Personalized for You</h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    // Handle authentication error gracefully
    if (error.includes('Authentication required') || error.includes('Sign in')) {
      return (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Sign in to see personalized recommendations</p>
          <p className="text-sm text-gray-500 mb-4">
            Get AI-powered service recommendations based on your preferences
          </p>
          <Button 
            onClick={() => router.push('/api/auth/signin')} 
            className="mr-2"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => router.push('/quiz')} 
            variant="outline"
          >
            Browse Services
          </Button>
        </div>
      );
    }
    
    // Other errors
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">{error}</div>
        <Button onClick={fetchRecommendations} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No personalized recommendations available</p>
        <p className="text-sm text-gray-500">
          Complete your profile quiz to get personalized service recommendations
        </p>
        <Button 
          onClick={() => router.push('/quiz')} 
          className="mt-4"
          variant="outline"
        >
          Take Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Personalized for You</h2>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            AI Matched
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{service.title}</CardTitle>
                  <p className="text-sm text-gray-600 mb-2">{service.merchant.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{service.merchant.address}</span>
                  </div>
                </div>
                <Badge className={getMatchColor(service.matchPercentage)}>
                  {service.matchPercentage}% match
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">${(service.price / 100).toFixed(0)}</span>
                  </div>
                  {service.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{service.duration}min</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className={getTrustScoreColor(service.merchant.trustScore)}>
                    {service.merchant.trustScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {service.reasons.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                    <Heart className="h-3 w-3 text-pink-500" />
                    <span>Why this matches you:</span>
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {service.reasons.slice(0, 2).map((reason, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => handleBookService(service.id, service.merchant.id)}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length >= limit && (
        <div className="text-center">
          <Button 
            onClick={() => router.push('/search?personalized=true')} 
            variant="outline"
          >
            View All Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
