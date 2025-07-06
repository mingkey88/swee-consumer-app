'use client';

import { Badge } from '@/components/ui/badge';
import { Shield, Star, AlertTriangle, CheckCircle } from 'lucide-react';

interface TrustScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function TrustScore({ 
  score, 
  size = 'md', 
  showLabel = true,
  className = ''
}: TrustScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-3 w-3" />;
    if (score >= 80) return <Shield className="h-3 w-3" />;
    if (score >= 70) return <Star className="h-3 w-3" />;
    return <AlertTriangle className="h-3 w-3" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-3 py-2';
      default:
        return 'text-xs px-2 py-1';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <Badge 
        variant="outline" 
        className={`${getScoreColor(score)} ${getSizeClasses(size)} border font-medium`}
      >
        <div className="flex items-center space-x-1">
          {getScoreIcon(score)}
          <span>{score.toFixed(1)}</span>
          {showLabel && size !== 'sm' && (
            <span className="ml-1">{getScoreLabel(score)}</span>
          )}
        </div>
      </Badge>
    </div>
  );
}

// Component for detailed trust score breakdown
export function TrustScoreDetails({ 
  score, 
  reviewCount = 0, 
  hardSellReports = 0,
  averageRating = 0
}: {
  score: number;
  reviewCount?: number;
  hardSellReports?: number;
  averageRating?: number;
}) {
  const trustFactors = [
    {
      label: 'Customer Reviews',
      value: `${reviewCount} reviews`,
      impact: reviewCount > 10 ? 'positive' : reviewCount > 5 ? 'neutral' : 'negative',
      description: 'Based on customer feedback and ratings'
    },
    {
      label: 'Average Rating',
      value: averageRating > 0 ? `${averageRating.toFixed(1)} stars` : 'No ratings',
      impact: averageRating >= 4.5 ? 'positive' : averageRating >= 3.5 ? 'neutral' : 'negative',
      description: 'Overall customer satisfaction'
    },
    {
      label: 'Hard-Sell Reports',
      value: `${hardSellReports} reports`,
      impact: hardSellReports === 0 ? 'positive' : hardSellReports <= 2 ? 'neutral' : 'negative',
      description: 'Customer reports of pushy sales tactics'
    },
    {
      label: 'Swee Standards',
      value: score >= 85 ? 'Meets standards' : 'Below standards',
      impact: score >= 85 ? 'positive' : score >= 70 ? 'neutral' : 'negative',
      description: 'Adherence to Swee quality and trust guidelines'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Star className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Trust Score Breakdown</h3>
        <TrustScore score={score} size="lg" />
      </div>

      <div className="space-y-3">
        {trustFactors.map((factor, index) => (
          <div key={index} className="flex items-start space-x-3">
            {getImpactIcon(factor.impact)}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{factor.label}</span>
                <span className={`text-sm font-medium ${getImpactColor(factor.impact)}`}>
                  {factor.value}
                </span>
              </div>
              <p className="text-xs text-gray-600">{factor.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Trust Score:</strong> Our AI-powered system evaluates providers based on customer feedback, 
          service quality, and adherence to Swee's standards to help you make informed decisions.
        </p>
      </div>
    </div>
  );
}
