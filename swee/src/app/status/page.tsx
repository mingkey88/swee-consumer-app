'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Database,
  Users,
  Star,
  DollarSign,
  Shield,
  Target,
  TrendingUp,
  Settings,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface FeatureStatus {
  name: string;
  status: 'complete' | 'in-progress' | 'pending';
  description: string;
  route?: string;
  api?: string;
  component?: string;
  details?: string[];
}

const features: FeatureStatus[] = [
  {
    name: 'Intelligent Quiz Onboarding',
    status: 'complete',
    description: 'Multi-step conditional quiz that adapts based on service type selection',
    route: '/quiz',
    api: '/api/quiz',
    component: 'Quiz.tsx',
    details: [
      'Service type selection (Hair/Facial/Brows & Lashes)',
      'Conditional questions based on selection',
      'Budget and lifestyle preferences',
      'Saves to UserProfile schema',
      'Awards 100 points for completion'
    ]
  },
  {
    name: 'Google OAuth Authentication',
    status: 'complete',
    description: 'NextAuth.js integration with Google OAuth provider',
    api: '/api/auth/[...nextauth]',
    details: [
      'Google OAuth login',
      'Session management',
      'User profile creation',
      'Role-based access control'
    ]
  },
  {
    name: 'Swee Points & Gamification',
    status: 'complete',
    description: 'Comprehensive points system with rewards and level progression',
    route: '/rewards',
    api: '/api/rewards',
    details: [
      'Points for quiz completion (100 pts)',
      'Points for bookings (200 pts)',
      'Points for reviews (50 pts)',
      'Level system with perks',
      'Points history tracking'
    ]
  },
  {
    name: 'Hard-Sell Reporting System',
    status: 'complete',
    description: 'Post-booking review system with hard-sell detection and reporting',
    component: 'PostBookingReview.tsx',
    api: '/api/reviews',
    details: [
      'Post-booking review prompt',
      'Hard-sell detection question',
      'Saves to HardSellReports table',
      'Updates merchant trust score',
      'Admin dashboard metrics'
    ]
  },
  {
    name: 'Escrow Payment System',
    status: 'complete',
    description: 'Payment protection with funds held until service completion',
    component: 'ServiceCompletion.tsx',
    api: '/api/payments',
    details: [
      'Payment stored in pending_payments',
      'Service completion confirmation',
      'Automatic payout to merchants',
      'Payment status tracking',
      'Stripe/PayNow integration ready'
    ]
  },
  {
    name: 'Personalized Recommendations',
    status: 'complete',
    description: 'AI-powered service matching based on user quiz answers',
    component: 'PersonalizedRecommendations.tsx',
    api: '/api/recommendations',
    details: [
      'Rules-based recommendation engine',
      'Matches quiz answers with service tags',
      'Budget and location filtering',
      'Match percentage display',
      'Integrated on homepage'
    ]
  },
  {
    name: 'Merchant Trust Score',
    status: 'complete',
    description: 'Dynamic trust scoring system for service providers',
    component: 'TrustScore.tsx',
    details: [
      'Base score of 100 points',
      'Dynamic updates based on reviews',
      '+5 per 5-star review',
      '-10 per hard-sell report',
      'Color-coded badges on listings'
    ]
  },
  {
    name: 'Admin Dashboard',
    status: 'complete',
    description: 'Comprehensive admin interface for monitoring and analytics',
    route: '/admin',
    api: '/api/admin/hard-sell-metrics',
    details: [
      'Hard-sell metrics tracking',
      'Trust score monitoring',
      'User engagement analytics',
      'Merchant performance overview'
    ]
  },
  {
    name: 'Service Search & Discovery',
    status: 'complete',
    description: 'Advanced search with filters and recommendations',
    route: '/search',
    details: [
      'Service and location search',
      'Filter by category, price, rating',
      'Trust score display',
      'Availability indicators',
      'Map and list views'
    ]
  },
  {
    name: 'Sample Data Population',
    status: 'complete',
    description: 'Comprehensive sample data for testing and demonstration',
    route: '/admin/seed',
    api: '/api/seed',
    details: [
      '24 service tags for matching',
      '3 sample merchants with trust scores',
      '6 services with tag associations',
      'Demo user with quiz answers',
      'One-click data population'
    ]
  }
];

const nextSteps = [
  {
    title: 'Live Payment Integration',
    description: 'Implement live Stripe/PayNow payment processing',
    priority: 'high'
  },
  {
    title: 'Advanced ML Recommendations',
    description: 'Upgrade from rules-based to machine learning recommendations',
    priority: 'medium'
  },
  {
    title: 'Real-time Notifications',
    description: 'Push notifications for bookings, reminders, and updates',
    priority: 'medium'
  },
  {
    title: 'Mobile App Development',
    description: 'React Native mobile app for iOS and Android',
    priority: 'low'
  },
  {
    title: 'Multi-language Support',
    description: 'Internationalization for Singapore market',
    priority: 'low'
  }
];

export default function StatusPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completeFeatures = features.filter(f => f.status === 'complete').length;
  const totalFeatures = features.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧼 Swee Platform Status
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Trust-First Beauty Booking Platform - Implementation Overview
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {completeFeatures}/{totalFeatures} Features Complete
              </Badge>
              <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800">
                MVP Ready
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/admin/seed">
              <Button className="w-full h-16 flex flex-col items-center justify-center">
                <Database className="h-6 w-6 mb-1" />
                <span>Populate Data</span>
              </Button>
            </Link>
            <Link href="/quiz">
              <Button className="w-full h-16 flex flex-col items-center justify-center" variant="outline">
                <Target className="h-6 w-6 mb-1" />
                <span>Take Quiz</span>
              </Button>
            </Link>
            <Link href="/search">
              <Button className="w-full h-16 flex flex-col items-center justify-center" variant="outline">
                <Search className="h-6 w-6 mb-1" />
                <span>Search Services</span>
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="w-full h-16 flex flex-col items-center justify-center" variant="outline">
                <TrendingUp className="h-6 w-6 mb-1" />
                <span>Admin Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(feature.status)}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status === 'complete' ? 'Complete' : 
                       feature.status === 'in-progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Action Links */}
                    <div className="flex flex-wrap gap-2">
                      {feature.route && (
                        <Link href={feature.route}>
                          <Button size="sm" variant="outline" className="text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Page
                          </Button>
                        </Link>
                      )}
                      {feature.api && (
                        <Badge variant="outline" className="text-xs">
                          API: {feature.api}
                        </Badge>
                      )}
                      {feature.component && (
                        <Badge variant="outline" className="text-xs">
                          Component: {feature.component}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Feature Details */}
                    {feature.details && (
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => setSelectedFeature(
                            selectedFeature === feature.name ? null : feature.name
                          )}
                        >
                          {selectedFeature === feature.name ? 'Hide' : 'Show'} Details
                        </Button>
                        
                        {selectedFeature === feature.name && (
                          <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            {feature.details.map((detail, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Next Steps & Roadmap
              </CardTitle>
              <CardDescription>
                Future enhancements to continue building on the MVP foundation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <Badge className={getPriorityColor(step.priority)}>
                      {step.priority.charAt(0).toUpperCase() + step.priority.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 pt-8 border-t">
            <p className="text-gray-600">
              🧼 Swee Platform - Trust & Intelligence Layer Complete
            </p>
            <p className="text-sm text-gray-500 mt-2">
              All major MVP features implemented and ready for production deployment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
