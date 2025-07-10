'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Star, 
  ChevronRight,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

interface Service {
  id: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  tags: string[];
}

interface SelectedService {
  id: number;
  title: string;
  duration: number;
  price: number;
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

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    name: string;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

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

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { darkMode: isDarkMode, toggleDarkMode } = useTheme();
  
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const response = await fetch(`/api/merchants/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch merchant data');
        }
        const data = await response.json();
        setMerchant(data);
        
        // Set pre-selected service from URL params
        const serviceId = searchParams.get('service');
        if (serviceId && data.services) {
          const service = data.services.find((s: Service) => s.id === parseInt(serviceId));
          if (service) {
            setSelectedServices([{
              id: service.id,
              title: service.title,
              duration: service.duration,
              price: service.price
            }]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [params.id, searchParams]);

  // Helper functions for service management
  const addService = (service: Service) => {
    const existingIndex = selectedServices.findIndex(s => s.id === service.id);
    if (existingIndex >= 0) {
      // Service already selected, do nothing (since quantity is always 1)
      return;
    } else {
      // Add new service
      setSelectedServices([...selectedServices, {
        id: service.id,
        title: service.title,
        duration: service.duration,
        price: service.price
      }]);
    }
  };

  const removeService = (serviceId: number) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  // Calculate totals (no quantities, so each service counts as 1)
  const totalDuration = selectedServices.reduce((total, service) => 
    total + service.duration, 0);
  
  const totalPrice = selectedServices.reduce((total, service) => 
    total + service.price, 0);

  const handleBooking = () => {
    if (selectedServices.length === 0 || !selectedTime || !selectedDate) {
      alert('Please select at least one service, date, and time');
      return;
    }

    const bookingData = {
      merchantId: merchant?.id,
      merchantName: merchant?.name,
      services: selectedServices,
      date: selectedDate,
      time: selectedTime,
      totalPrice: totalPrice,
      totalDuration: totalDuration,
    };

    // Store booking data and navigate to confirmation
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Navigate with proper URL parameters
    const priceInDollars = (totalPrice / 100).toFixed(0);
    const serviceNames = selectedServices.map(s => s.title).join(', ');
    const confirmUrl = `/booking/confirm?provider=${encodeURIComponent(merchant?.name || '')}&service=${encodeURIComponent(serviceNames)}&date=${selectedDate}&time=${encodeURIComponent(selectedTime)}&price=${priceInDollars}`;
    window.location.href = confirmUrl;
  };

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

  // Generate next 7 days for date selection
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

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
              <Link href={`/providers/${params.id}`}>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {merchant.name}
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
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm" className="font-bold text-orange-600 dark:text-orange-400">
                  Swee
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Service</span>
            </div>
            <div className={`h-px w-12 ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium">Date & Time</span>
            </div>
            <div className={`h-px w-12 ${currentStep >= 3 ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}`}>
                {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
              </div>
              <span className="ml-2 text-sm font-medium">Confirm</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Flow */}
            <div className="lg:col-span-2">
              {/* Service Selection */}
              {currentStep === 1 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Choose Services</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Select one or more services for your appointment</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {merchant.services.map((service) => {
                      const selectedService = selectedServices.find(s => s.id === service.id);
                      const isSelected = !!selectedService;
                      
                      return (
                        <div key={service.id}>
                          <div
                            className={`p-4 border rounded-lg transition-all ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{service.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatDuration(service.duration)}</span>
                                  <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                                </div>
                              </div>
                              <div className="text-right ml-6">
                                <div className="font-bold text-lg text-gray-900 dark:text-white">
                                  {formatPrice(service.price)}
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                  {isSelected ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeService(service.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Remove Service
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() => addService(service)}
                                      variant="outline"
                                      size="sm"
                                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                                    >
                                      Add Service
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Continue Button */}
                    {selectedServices.length > 0 && (
                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={() => setCurrentStep(2)}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Continue: Select Date & Time
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Date & Time Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">Select Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-2">
                        {dates.map((date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          const isSelected = selectedDate === dateStr;
                          const isToday = date.toDateString() === new Date().toDateString();
                          
                          return (
                            <div
                              key={dateStr}
                              className={`p-3 text-center rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-orange-500 text-white'
                                  : 'border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
                              }`}
                              onClick={() => setSelectedDate(dateStr)}
                            >
                              <div className="text-xs font-medium">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="text-sm font-bold">
                                {date.getDate()}
                              </div>
                              {isToday && (
                                <div className="text-xs text-orange-600 dark:text-orange-400">
                                  Today
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">Select Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            className={`p-3 text-sm rounded-lg border transition-all ${
                              !slot.available
                                ? 'border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                                : selectedTime === slot.time
                                ? 'border-orange-500 bg-orange-500 text-white'
                                : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
                            }`}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between pt-6">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(3)}
                          disabled={!selectedDate || !selectedTime}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Next: Confirm Booking
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Confirmation */}
              {currentStep === 3 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Confirm Your Booking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Details</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 dark:text-gray-300 block mb-2">Services:</span>
                          <div className="space-y-2">
                            {selectedServices.map((service) => (
                              <div key={service.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">{service.title}</span>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {formatDuration(service.duration)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {formatPrice(service.price)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Date:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Time:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Total Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatDuration(totalDuration)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                          <span className="text-gray-600 dark:text-gray-300">Total Cost:</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleBooking}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Merchant Info */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-lg font-bold">
                        {merchant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{merchant.name}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-medium text-gray-900 dark:text-white">{merchant.averageRating}</span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">({merchant.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{merchant.address}</p>
                  
                  {selectedServices.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Services</h4>
                      <div className="space-y-3">
                        {selectedServices.map((service) => (
                          <div key={service.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="font-medium text-gray-900 dark:text-white">{service.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {formatDuration(service.duration)}
                            </div>
                            <div className="font-bold text-orange-600 dark:text-orange-400">
                              {formatPrice(service.price)}
                            </div>
                          </div>
                        ))}
                        
                        {/* Total Summary */}
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Total Duration:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(totalDuration)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Total Cost:</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">{formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
