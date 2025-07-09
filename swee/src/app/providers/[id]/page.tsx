'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Star, 
  Heart, 
  MapPin, 
  Phone,
  Globe,
  Check,
  Shield,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Service {
  id: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  tags: string[];
}

interface Review {
  id: string;
  user: {
    name: string;
    initial: string;
  };
  rating: number;
  comment: string;
  date: string;
  service: string;
}

interface MerchantData {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  trustScore: number;
  averageRating: number;
  reviewCount: number;
  services: Service[];
  reviews: Review[];
}

export default function ProviderPage() {
  const params = useParams();
  const { darkMode: isDarkMode, toggleDarkMode } = useTheme();
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const response = await fetch(`/api/merchants/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch merchant data');
        }
        const data = await response.json();
        setMerchant(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error || 'Merchant not found'}</p>
          <Link href="/search">
            <Button variant="outline" className="mt-4">
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section - Fresha Style */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {/* Hero Images */}
          <div className="relative h-80 bg-gray-100 dark:bg-gray-700">
            <Image 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              alt={`${merchant.name} - Main salon view`}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Provider Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{merchant.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{merchant.averageRating}</span>
                    <span>rating with {merchant.reviewCount} reviews</span>
                  </div>
                  <span>•</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Open today</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{merchant.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{merchant.trustScore}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Trust Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section - Fresha Style with Book Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Services</h2>
              <div className="space-y-4">
                {merchant.services.slice(0, 6).map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{service.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDuration(service.duration)}</span>
                        <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-6">
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900 dark:text-white">
                          {formatPrice(service.price)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDuration(service.duration)}
                        </div>
                      </div>
                      <Link href={`/providers/${merchant.id}/booking?service=${service.id}`}>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2">
                          Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {merchant.services.length > 6 && (
                  <div className="text-center pt-4">
                    <Link href={`/providers/${merchant.id}/booking`}>
                      <Button variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                        See all {merchant.services.length} services
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section - Enhanced with Dummy Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold text-gray-900 dark:text-white">{merchant.averageRating}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">({merchant.reviewCount + 8} reviews)</span>
                </div>
              </div>
              <div className="space-y-6">
                {/* Dummy Reviews */}
                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">
                        S
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Sarah L.</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        Absolutely loved my experience at Bella Beauty Studio! The facial treatment was amazing and the staff was so professional. My skin feels incredible and the results lasted for weeks. Will definitely be returning!
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                        <span>2 days ago</span>
                        <span>•</span>
                        <span>Hydrating Facial Deluxe</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Michelle T.</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        Best hair salon in Singapore! The stylists really listen to what you want and deliver amazing results. My hair color turned out exactly as I envisioned. The salon is also very clean and modern.
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                        <span>1 week ago</span>
                        <span>•</span>
                        <span>Premium Hair Coloring</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                        J
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Jessica W.</span>
                        <div className="flex items-center">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        Great experience overall! The massage was very relaxing and therapeutic. The therapist was skilled and professional. Only minor point is that the room could be a bit quieter, but that&apos;s a small detail.
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                        <span>2 weeks ago</span>
                        <span>•</span>
                        <span>Massage Therapy</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Existing reviews */}
                {merchant.reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">
                          {review.user.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">{review.user.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{review.comment}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                          <span>{formatDate(review.date)}</span>
                          <span>•</span>
                          <span>{review.service}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  See all reviews
                </Button>
              </div>
            </div>

            {/* Other locations - Fresha Style */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Other locations</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image 
                        src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                        alt="Bella Beauty Studio - Orchard"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Bella Beauty Studio - Orchard</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">313 Orchard Road, Singapore 238895</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">4.7</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1.2km away</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image 
                        src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                        alt="Bella Beauty Studio - Marina Bay"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Bella Beauty Studio - Marina Bay</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">10 Bayfront Avenue, Singapore 018956</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">4.8</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2.8km away</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    View
                  </Button>
                </div>
              </div>
            </div>

            {/* Venues nearby - Fresha Style */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Venues nearby</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image 
                        src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                        alt="Serenity Spa & Wellness"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Serenity Spa & Wellness</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Spa • Wellness • Massage</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">4.6</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">0.5km away</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image 
                        src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                        alt="Elite Hair Studio"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Elite Hair Studio</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Hair Salon • Styling • Coloring</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">4.5</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">0.8km away</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image 
                        src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                        alt="Luxe Nail Bar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Luxe Nail Bar</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Nail Salon • Manicure • Pedicure</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">4.4</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1.1km away</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                {merchant.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">{merchant.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">{merchant.phone}</span>
                </div>
                {merchant.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={merchant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Opening Hours */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Opening times</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Monday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tuesday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Wednesday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Thursday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Friday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                    <span className="text-gray-900 dark:text-white">10:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Additional information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Instant Confirmation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Escrow Payment Protection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">No Hidden Upsells</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
