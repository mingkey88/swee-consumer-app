'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Star, 
  Heart, 
  MapPin, 
  Clock, 
  Phone,
  Globe,
  Check,
  ChevronRight,
  User,
  Award,
  Shield,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: string;
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    initial: string;
  };
  rating: number;
  comment: string;
  date: string;
  service: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const mockServices: Service[] = [
  {
    id: 'haircut-style',
    name: 'Haircut & Style',
    description: 'Professional haircut with wash and styling',
    duration: '45 min',
    price: 85,
    category: 'Hair Services'
  },
  {
    id: 'hair-color',
    name: 'Hair Color',
    description: 'Full color service with consultation',
    duration: '2 hr',
    price: 150,
    category: 'Hair Services'
  },
  {
    id: 'highlights',
    name: 'Highlights',
    description: 'Partial or full highlights',
    duration: '2.5 hr',
    price: 180,
    category: 'Hair Services'
  },
  {
    id: 'hair-treatment',
    name: 'Hair Treatment',
    description: 'Deep conditioning treatment',
    duration: '30 min',
    price: 65,
    category: 'Treatments'
  },
  {
    id: 'blowdry',
    name: 'Blowdry',
    description: 'Wash and professional blowdry',
    duration: '30 min',
    price: 45,
    category: 'Styling'
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2d5c8aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      initial: 'S'
    },
    rating: 5,
    comment: 'Amazing service! My hair looks absolutely gorgeous. The stylist really listened to what I wanted and delivered perfectly.',
    date: '2 days ago',
    service: 'Haircut & Style'
  },
  {
    id: '2',
    user: {
      name: 'Michelle Wong',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      initial: 'M'
    },
    rating: 5,
    comment: 'Great experience from start to finish. The salon is clean, modern, and the staff is very professional.',
    date: '1 week ago',
    service: 'Hair Color'
  },
  {
    id: '3',
    user: {
      name: 'Jennifer Lim',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      initial: 'J'
    },
    rating: 4,
    comment: 'Love the results! Will definitely be coming back. The highlights look natural and beautiful.',
    date: '2 weeks ago',
    service: 'Highlights'
  }
];

const timeSlots: TimeSlot[] = [
  { time: '9:00 AM', available: false },
  { time: '9:30 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '2:00 PM', available: true },
  { time: '2:30 PM', available: true },
  { time: '3:00 PM', available: true },
  { time: '3:30 PM', available: false },
  { time: '4:00 PM', available: true },
  { time: '4:30 PM', available: true },
  { time: '5:00 PM', available: true }
];

export default function ProviderDetailPage() {
  const params = useParams();
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const provider = {
    id: params.id,
    name: 'The Hair Lounge',
    category: 'Hair & Beauty',
    rating: 4.8,
    reviewCount: 324,
    address: '277A Holland Avenue, Singapore 278624',
    phone: '+65 6123 4567',
    website: 'www.thehairlounge.sg',
    description: 'Award-winning hair salon specializing in modern cuts, colors, and treatments. Our experienced stylists use premium products to deliver exceptional results.',
    isOpen: true,
    openingHours: {
      'Mon-Fri': '9:00 AM - 8:00 PM',
      'Sat': '9:00 AM - 6:00 PM',
      'Sun': '10:00 AM - 5:00 PM'
    },
    amenities: ['Wi-Fi', 'Refreshments', 'Parking', 'Card Payment', 'Online Booking'],
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ]
  };

  const handleBooking = () => {
    if (!selectedService || !selectedTime) {
      alert('Please select a service and time slot');
      return;
    }
    
    // Navigate to booking confirmation
    const service = mockServices.find(s => s.id === selectedService);
    const bookingParams = new URLSearchParams({
      provider: provider.id as string,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      price: service?.price.toString() || '0'
    });
    
    window.location.href = `/booking/confirm?${bookingParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to search
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{provider.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{provider.category}</p>
            </div>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={provider.images[0]} 
                  alt={`${provider.name} - Main view`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-2 gap-4">
                {provider.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${provider.name} - View ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{provider.rating}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{provider.reviewCount} reviews</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years experience</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction guarantee</div>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {provider.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{provider.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{provider.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{provider.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{provider.website}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Opening Hours</h4>
                    <div className="space-y-1">
                      {Object.entries(provider.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServices.map((service) => (
                    <div 
                      key={service.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedService === service.id 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span>{service.duration}</span>
                            </div>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">${service.price}</div>
                          {selectedService === service.id && (
                            <Check className="h-5 w-5 text-orange-500 mt-1 ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews ({provider.reviewCount})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.slice(0, showAllReviews ? mockReviews.length : 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>{review.user.initial}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.user.name}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{review.service}</span>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!showAllReviews && mockReviews.length > 3 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllReviews(true)}
                      className="w-full"
                    >
                      Show all {mockReviews.length} reviews
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Service */}
                {selectedService && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {mockServices.find(s => s.id === selectedService)?.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {mockServices.find(s => s.id === selectedService)?.duration}
                        </p>
                      </div>
                      <div className="text-xl font-bold">
                        ${mockServices.find(s => s.id === selectedService)?.price}
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Available Times</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`${
                          selectedTime === slot.time 
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : ''
                        } ${
                          !slot.available 
                            ? 'opacity-50 cursor-not-allowed' 
                            : ''
                        }`}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
                  onClick={handleBooking}
                  disabled={!selectedService || !selectedTime}
                >
                  Book Appointment
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>

                {/* Contact Options */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {provider.phone}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Message Provider
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
