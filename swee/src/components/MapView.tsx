'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, DollarSign, Heart, Navigation, Plus, Minus } from 'lucide-react';
import TrustScore from '@/components/TrustScore';

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance: string;
  priceRange: string;
  nextAvailable: string;
  image: string;
  services: string[];
  isOpen: boolean;
  featured: boolean;
  trustScore: number;
  lat?: number;
  lng?: number;
}

interface MapViewProps {
  providers: ServiceProvider[];
  selectedProvider?: ServiceProvider | null;
  onProviderSelect: (provider: ServiceProvider) => void;
}

export default function MapView({ providers, selectedProvider, onProviderSelect }: MapViewProps) {
  const [zoom, setZoom] = useState(12);

  // Simple dummy marker positions
  const dummyMarkers = [
    { x: 25, y: 30, provider: providers[0] },
    { x: 60, y: 45, provider: providers[1] },
    { x: 40, y: 60, provider: providers[2] },
    { x: 70, y: 25, provider: providers[3] },
    { x: 35, y: 75, provider: providers[4] },
  ].filter(marker => marker.provider); // Only include if provider exists

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hair & Beauty': return 'bg-purple-500';
      case 'Massage & Spa': return 'bg-blue-500';
      case 'Fitness': return 'bg-green-500';
      case 'Nails': return 'bg-pink-500';
      case 'Skincare': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Dummy Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
        {/* Map grid pattern */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Dummy streets/roads */}
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-400 dark:bg-gray-500 opacity-70"></div>
        <div className="absolute top-3/4 left-0 w-full h-1 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
        
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gray-300 dark:bg-gray-600 opacity-60"></div>
        <div className="absolute top-0 left-1/2 w-2 h-full bg-gray-400 dark:bg-gray-500 opacity-70"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-gray-300 dark:bg-gray-600 opacity-60"></div>
        
        {/* Dummy landmarks/areas */}
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-green-200 dark:bg-green-800 rounded-full opacity-50"></div>
        <div className="absolute top-2/3 left-2/3 w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-10 bg-yellow-200 dark:bg-yellow-800 rounded-lg opacity-50"></div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 z-10">
        <div className="flex items-center space-x-2">
          <Navigation className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Singapore</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <Button
          size="sm"
          variant="outline"
          className="bg-white dark:bg-gray-800 w-8 h-8 p-0"
          onClick={() => setZoom(Math.min(zoom + 1, 18))}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white dark:bg-gray-800 w-8 h-8 p-0"
          onClick={() => setZoom(Math.max(zoom - 1, 8))}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Results Counter */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 z-10">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {providers.length} results found
        </span>
      </div>

      {/* Provider Markers */}
      {dummyMarkers.map((marker, index) => {
        const isSelected = selectedProvider?.id === marker.provider.id;
        
        return (
          <div
            key={marker.provider.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 ${
              isSelected ? 'scale-110' : 'hover:scale-105'
            }`}
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
            }}
            onClick={() => onProviderSelect(marker.provider)}
          >
            {/* Marker Pin */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getCategoryColor(marker.provider.category)} ${
                isSelected ? 'ring-4 ring-orange-300' : ''
              }`}>
                <span className="text-white font-bold text-xs">
                  {marker.provider.name.charAt(0)}
                </span>
              </div>
              
              {/* Trust Score Badge */}
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center ${getTrustScoreColor(marker.provider.trustScore)}`}>
                <span className="text-white font-bold text-xs">
                  {Math.round(marker.provider.trustScore)}
                </span>
              </div>

              {/* Featured Badge */}
              {marker.provider.featured && (
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <Star className="h-2 w-2 text-white fill-current" />
                </div>
              )}

              {/* Price Range (on hover/selection) */}
              {isSelected && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-md border dark:border-gray-700 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {marker.provider.priceRange}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 z-10 max-w-48">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Trust Score 90+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Trust Score 80-89</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Trust Score 70-79</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-3 w-3 text-orange-500 fill-current" />
            <span className="text-gray-600 dark:text-gray-400">Featured</span>
          </div>
        </div>
      </div>

      {/* Map Style Indicator */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 z-10">
        <span className="text-xs text-gray-500 dark:text-gray-400">Map View</span>
      </div>
    </div>
  );
}
