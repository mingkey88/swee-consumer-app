'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface SelectedService {
  id: number;
  title: string;
  duration: number;
  price: number;
}

interface BookingData {
  merchantId: number;
  merchantName: string;
  services: SelectedService[];
  date: string;
  time: string;
  totalPrice: number;
  totalDuration: number;
}

interface BookingDetails {
  provider: string;
  service: string;
  date: string;
  time: string;
  price: string;
}

export default function BookingConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [fallbackBookingDetails, setFallbackBookingDetails] = useState<BookingDetails>({
    provider: '',
    service: '',
    date: '',
    time: '',
    price: '85'
  });

  useEffect(() => {
    // First try to get booking data from localStorage (new multi-service flow)
    const storedBookingData = localStorage.getItem('bookingData');
    if (storedBookingData) {
      try {
        const parsedData = JSON.parse(storedBookingData);
        setBookingData(parsedData);
        return;
      } catch (error) {
        console.error('Error parsing booking data:', error);
      }
    }

    // Fallback to URL parameters (legacy single service flow)
    if (searchParams) {
      const priceParam = searchParams.get('price');
      setFallbackBookingDetails({
        provider: searchParams.get('provider') || '',
        service: searchParams.get('service') || '',
        date: searchParams.get('date') || '',
        time: searchParams.get('time') || '',
        price: (priceParam && priceParam !== '0') ? priceParam : '85'
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setConfirmed(true);
  };

  // Helper functions to get booking information
  const getProviderName = () => {
    return bookingData?.merchantName || fallbackBookingDetails.provider || '';
  };

  const getServicesDisplay = () => {
    if (bookingData?.services) {
      return bookingData.services.map(service => service.title).join(', ');
    }
    return serviceNames[fallbackBookingDetails.service] || fallbackBookingDetails.service;
  };

  const getDate = () => {
    return bookingData?.date || fallbackBookingDetails.date;
  };

  const getTime = () => {
    return bookingData?.time || fallbackBookingDetails.time;
  };

  const getTotalPrice = () => {
    if (bookingData?.totalPrice) {
      return (bookingData.totalPrice / 100).toFixed(0);
    }
    return fallbackBookingDetails.price;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const serviceNames: Record<string, string> = {
    'haircut-style': 'Haircut & Style',
    'hair-color': 'Hair Color',
    'highlights': 'Highlights',
    'hair-treatment': 'Hair Treatment',
    'blowdry': 'Blowdry'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your appointment has been successfully booked. You&apos;ll receive a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
                onClick={() => router.push('/bookings')}
              >
                View My Bookings
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/search')}
              >
                Book Another Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/providers/${getProviderName()}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Confirm Booking</h1>
            <div className="flex-1"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="ml-auto"
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
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{getProviderName()}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>277A Holland Avenue, Singapore 278624</span>
                    </div>
                    {bookingData?.services ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span>Services:</span>
                        </div>
                        {bookingData.services.map((service) => (
                          <div key={service.id} className="ml-6 text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                            <div className="font-medium">{service.title}</div>
                            <div className="text-gray-600 dark:text-gray-300">
                              {formatDuration(service.duration)}
                              {' • '}${(service.price / 100).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        <div className="ml-6 text-sm font-medium border-t pt-2">
                          Total Duration: {formatDuration(bookingData.totalDuration)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{getServicesDisplay()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{formatDate(getDate())}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{getTime()}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-200">Booking Policy</p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Free cancellation up to 24 hours before your appointment. 
                        Late cancellations may incur a 50% charge.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                      placeholder="Any special requests or notes for the provider"
                      rows={3}
                    />
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4">
                    <h4 className="font-semibold mb-3">Secure Payment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                        <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium">Pay securely online</span>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-xs text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">Swee Booking Policy</p>
                            <p>Your payment is held securely until service completion. This ensures merchants focus on service quality, not upselling, protecting you from hard-selling tactics.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href={`/booking/payment?provider=${encodeURIComponent(getProviderName())}&service=${encodeURIComponent(getServicesDisplay())}&date=${getDate()}&time=${encodeURIComponent(getTime())}&price=${getTotalPrice()}`}>
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
                    >
                      Proceed to Secure Payment
                    </Button>
                  </Link>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
