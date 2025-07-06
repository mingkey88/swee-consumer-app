'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  Star, 
  Heart, 
  Filter, 
  Clock, 
  DollarSign,
  ChevronDown,
  Map,
  List,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import AuthNavigation from '@/components/AuthNavigation';
import TrustScore from '@/components/TrustScore';
import MapView from '@/components/MapView';
import { useTheme } from '@/contexts/ThemeContext';

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

const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Bella Beauty Studio',
    category: 'Hair & Beauty',
    rating: 4.8,
    reviewCount: 324,
    address: '123 Orchard Road, #02-45, Singapore 238858',
    distance: '0.5 km',
    priceRange: '$45 - $180',
    nextAvailable: 'Today 2:30 PM',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    services: ['Hair Cut & Style', 'Hair Color', 'Highlights', 'Hair Treatment', 'Blowdry', 'Keratin Treatment', 'Hair Extensions', 'Bridal Hair'],
    isOpen: true,
    featured: true,
    trustScore: 96.2,
    lat: 1.304833,
    lng: 103.831833
  },
  {
    id: 'hair-lounge-singapore',
    name: 'The Hair Lounge',
    category: 'Hair & Beauty',
    rating: 4.8,
    reviewCount: 324,
    address: '277A Holland Avenue, Singapore 278624',
    distance: '0.8 km',
    priceRange: '$50 - $150',
    nextAvailable: 'Today 3:00 PM',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Hair Cut', 'Hair Color', 'Styling', 'Treatment'],
    isOpen: true,
    featured: true,
    trustScore: 92.5
  },
  {
    id: 'zen-wellness-spa',
    name: 'Zen Wellness Spa',
    category: 'Massage & Spa',
    rating: 4.9,
    reviewCount: 456,
    address: '123 Orchard Road, Singapore 238858',
    distance: '1.2 km',
    priceRange: '$80 - $200',
    nextAvailable: 'Tomorrow 10:00 AM',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Hot Stone Massage', 'Aromatherapy', 'Deep Tissue', 'Reflexology'],
    isOpen: true,
    featured: false,
    trustScore: 95.0
  },
  {
    id: 'perfect-nails-studio',
    name: 'Perfect Nails Studio',
    category: 'Nails',
    rating: 4.7,
    reviewCount: 289,
    address: '456 Bugis Street, Singapore 188867',
    distance: '2.1 km',
    priceRange: '$30 - $80',
    nextAvailable: 'Today 5:30 PM',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Manicure', 'Pedicure', 'Gel Polish', 'Nail Art'],
    isOpen: false,
    featured: false,
    trustScore: 87.3
  },
  {
    id: 'fit-zone-gym',
    name: 'FitZone Personal Training',
    category: 'Fitness',
    rating: 4.6,
    reviewCount: 167,
    address: '789 Marina Bay, Singapore 018956',
    distance: '3.5 km',
    priceRange: '$60 - $120',
    nextAvailable: 'Tomorrow 7:00 AM',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Personal Training', 'HIIT Classes', 'Strength Training', 'Nutrition Coaching'],
    isOpen: true,
    featured: true,
    trustScore: 89.8
  },
  {
    id: 'glow-skincare-clinic',
    name: 'Glow Skincare Clinic',
    category: 'Skincare',
    rating: 4.9,
    reviewCount: 412,
    address: '321 Somerset Road, Singapore 238865',
    distance: '1.5 km',
    priceRange: '$90 - $250',
    nextAvailable: 'Today 4:15 PM',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['HydraFacial', 'Chemical Peel', 'Microneedling', 'LED Therapy'],
    isOpen: true,
    featured: true,
    trustScore: 96.2
  },
  {
    id: 'bliss-massage-therapy',
    name: 'Bliss Massage Therapy',
    category: 'Massage & Spa',
    rating: 4.5,
    reviewCount: 203,
    address: '88 Tanjong Pagar Road, Singapore 088488',
    distance: '2.8 km',
    priceRange: '$60 - $140',
    nextAvailable: 'Tomorrow 2:00 PM',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Swedish Massage', 'Deep Tissue', 'Prenatal Massage', 'Couple Massage'],
    isOpen: true,
    featured: false,
    trustScore: 82.1
  },
  {
    id: 'urban-cuts-barbershop',
    name: 'Urban Cuts Barbershop',
    category: 'Hair & Beauty',
    rating: 4.6,
    reviewCount: 156,
    address: '45 Club Street, Singapore 069419',
    distance: '1.8 km',
    priceRange: '$25 - $65',
    nextAvailable: 'Today 6:00 PM',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Haircut', 'Beard Trim', 'Hair Wash', 'Styling'],
    isOpen: true,
    featured: false,
    trustScore: 78.6
  },
  {
    id: 'pure-yoga-studio',
    name: 'Pure Yoga Studio',
    category: 'Fitness',
    rating: 4.4,
    reviewCount: 98,
    address: '67 Tras Street, Singapore 079008',
    distance: '2.3 km',
    priceRange: '$20 - $50',
    nextAvailable: 'Tomorrow 9:00 AM',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Hatha Yoga', 'Vinyasa', 'Meditation', 'Private Sessions'],
    isOpen: false,
    featured: false,
    trustScore: 73.4
  },
  {
    id: 'luxe-beauty-bar',
    name: 'Luxe Beauty Bar',
    category: 'Hair & Beauty',
    rating: 4.8,
    reviewCount: 267,
    address: '12 Ann Siang Road, Singapore 069692',
    distance: '1.4 km',
    priceRange: '$70 - $200',
    nextAvailable: 'Today 7:30 PM',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Hair Styling', 'Makeup', 'Bridal Package', 'Extensions'],
    isOpen: true,
    featured: true,
    trustScore: 91.7
  },
  {
    id: 'serenity-wellness-center',
    name: 'Serenity Wellness Center',
    category: 'Health & Wellness',
    rating: 4.7,
    reviewCount: 189,
    address: '90 Boat Quay, Singapore 049849',
    distance: '3.1 km',
    priceRange: '$50 - $180',
    nextAvailable: 'Tomorrow 1:00 PM',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    services: ['Acupuncture', 'Physiotherapy', 'Cupping', 'Wellness Consultation'],
    isOpen: true,
    featured: false,
    trustScore: 85.9
  }
];

const categories = [
  'All Services',
  'Hair & Beauty',
  'Health & Wellness', 
  'Fitness',
  'Massage & Spa',
  'Nails',
  'Skincare'
];

const sortOptions = [
  'Recommended',
  'Distance',
  'Rating',
  'Price: Low to High',
  'Price: High to Low',
  'Availability'
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Singapore');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [sortBy, setSortBy] = useState('Recommended');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [providers] = useState<ServiceProvider[]>(mockProviders);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const { darkMode, toggleDarkMode } = useTheme();

  // Initialize search parameters from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const queryParam = searchParams.get('query');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.services.some(service => 
                           service.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'All Services' || 
                           provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Swee
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
              <AuthNavigation />
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            {/* Service Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Location */}
            <div className="relative md:w-64">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Search Button */}
            <Button 
              className="h-12 px-8 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 dark:from-orange-600 dark:to-red-500 dark:hover:from-orange-700 dark:hover:to-red-600 text-white"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white" : 
                    "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Filter className="h-4 w-4" />
                    {sortBy}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option}
                      onClick={() => setSortBy(option)}
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode */}
              <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-none ${viewMode === 'list' ? 
                    'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white' : 
                    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={`rounded-none ${viewMode === 'map' ? 
                    'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white' : 
                    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {filteredProviders.length} results in {location}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'map' ? (
          /* Map View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Map */}
            <div className="lg:col-span-2 h-full">
              <MapView 
                providers={filteredProviders}
                selectedProvider={selectedProvider}
                onProviderSelect={handleProviderSelect}
              />
            </div>

            {/* Selected Provider Detail or Provider List */}
            <div className="lg:col-span-1 h-full overflow-y-auto">
              {selectedProvider ? (
                /* Selected Provider Detail */
                <Card className="h-fit bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                    <Image 
                      src={selectedProvider.image} 
                      alt={selectedProvider.name}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProvider.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{selectedProvider.category}</p>
                      </div>
                      <TrustScore score={selectedProvider.trustScore} />
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{selectedProvider.rating}</span>
                        <span className="text-gray-500 dark:text-gray-400">({selectedProvider.reviewCount})</span>
                      </div>
                      <Badge variant={selectedProvider.isOpen ? "default" : "secondary"} className={selectedProvider.isOpen ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}>
                        {selectedProvider.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{selectedProvider.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <span className="text-sm">{selectedProvider.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">{selectedProvider.priceRange}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Next: {selectedProvider.nextAvailable}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Services</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProvider.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500">
                        Book Now
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Provider List */
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Select a provider on the map</h3>
                  {filteredProviders.slice(0, 5).map((provider) => (
                    <Card 
                      key={provider.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleProviderSelect(provider)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{provider.name}</h4>
                          <TrustScore score={provider.trustScore} showLabel={false} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{provider.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-900 dark:text-white">{provider.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{provider.distance}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Link key={provider.id} href={`/providers/${provider.id}`}>
              <Card className="hover:shadow-lg dark:hover:shadow-xl transition-shadow cursor-pointer group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                    <Image 
                      src={provider.image} 
                      alt={provider.name}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {provider.featured && (
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                      Featured
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
                  >
                    <Heart className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-gray-900 dark:text-white">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{provider.category}</p>
                    </div>

                    {/* Rating & Trust Score */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{provider.rating}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          ({provider.reviewCount} reviews)
                        </span>
                      </div>
                      <TrustScore score={provider.trustScore} size="sm" showLabel={false} />
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.address}</span>
                      <span className="font-medium">• {provider.distance}</span>
                    </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 3).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {service}
                        </Badge>
                      ))}
                      {provider.services.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          +{provider.services.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Price & Availability */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                        <DollarSign className="h-4 w-4" />
                        {provider.priceRange}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {provider.nextAvailable}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        provider.isOpen ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        provider.isOpen ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {provider.isOpen ? 'Open now' : 'Closed'}
                      </span>
                    </div>

                    {/* Trust Score */}
                    <div className="flex items-center gap-2">
                      <TrustScore score={provider.trustScore} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
        )}

        {/* No Results */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Services');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
