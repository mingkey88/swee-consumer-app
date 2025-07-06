'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  Building,
  Shield,
  Lock,
  CheckCircle,
  Info,
  Star,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface BookingDetails {
  provider: string;
  providerName: string;
  service: string;
  serviceName: string;
  date: string;
  time: string;
  price: string;
  duration: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  popular?: boolean;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    saveCard: false
  });

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    provider: '',
    providerName: 'The Hair Lounge',
    service: '',
    serviceName: 'Haircut & Style',
    date: '',
    time: '',
    price: '85',
    duration: '45 min'
  });

  useEffect(() => {
    if (searchParams) {
      setBookingDetails({
        provider: searchParams.get('provider') || 'hair-lounge-singapore',
        providerName: searchParams.get('providerName') || 'The Hair Lounge',
        service: searchParams.get('service') || 'haircut-style',
        serviceName: searchParams.get('serviceName') || 'Haircut & Style',
        date: searchParams.get('date') || new Date().toISOString().split('T')[0],
        time: searchParams.get('time') || '2:00 PM',
        price: searchParams.get('price') || '85',
        duration: searchParams.get('duration') || '45 min'
      });
    }
  }, [searchParams]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Visa, Mastercard, American Express',
      popular: true
    },
    {
      id: 'paynow',
      name: 'PayNow',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'QR code payment via banking app'
    },
    {
      id: 'grabpay',
      name: 'GrabPay',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Pay with GrabPay wallet'
    },
    {
      id: 'bank',
      name: 'Online Banking',
      icon: <Building className="h-5 w-5" />,
      description: 'DBS, OCBC, UOB, and more'
    }
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(bookingDetails.price);
    const serviceFee = basePrice * 0.05; // 5% service fee
    const gst = (basePrice + serviceFee) * 0.09; // 9% GST
    return {
      basePrice,
      serviceFee,
      gst,
      total: basePrice + serviceFee + gst
    };
  };

  const handleCardInputChange = (field: string, value: string | boolean) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setLoading(false);
    setPaymentCompleted(true);
    
    // Redirect to success page after a delay
    setTimeout(() => {
      router.push('/booking/success');
    }, 2000);
  };

  const pricing = calculateTotal();

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your booking has been confirmed. Redirecting you to the confirmation page...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
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
            <Link href="/booking/confirm">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment</h1>
              <p className="text-gray-600 dark:text-gray-400">Complete your booking payment</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="ml-2"
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3 p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-gray-600 dark:text-gray-400">{method.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </label>
                              {method.popular && (
                                <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details */}
            {selectedPaymentMethod === 'card' && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => handleCardInputChange('number', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => handleCardInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={cardDetails.saveCard}
                      onChange={(e) => handleCardInputChange('saveCard', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="saveCard" className="text-sm">
                      Save this card for future payments
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Notice */}
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-200">Secure Escrow Payment</h4>
                    <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                      Your payment is held securely until service completion. This protects you from hard-selling tactics and ensures service quality.
                    </p>
                    <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                      <li>• Payment released only after service completion</li>
                      <li>• Merchants focus on quality, not upselling</li>
                      <li>• Full refund if service is not delivered</li>
                      <li>• Industry-standard encryption protects your data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{bookingDetails.serviceName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bookingDetails.duration}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{bookingDetails.providerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{formatDate(bookingDetails.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{bookingDetails.time}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Service fee</span>
                    <span>${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform fee</span>
                    <span>${pricing.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (9%)</span>
                    <span>${pricing.gst.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <Button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Secure Payment...
                    </div>
                  ) : (
                    `Pay $${pricing.total.toFixed(2)} (Held in Escrow)`
                  )}
                </Button>

                {/* Escrow Explanation */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div className="text-xs text-orange-800 dark:text-orange-200">
                      <p className="font-medium mb-1">How Swee Protects You</p>
                      <p>Payment is held securely until service completion. Merchant receives payment only after you confirm satisfaction, preventing hard-selling and ensuring quality service.</p>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>
                    By completing this payment, you agree to our{' '}
                    <Link href="/terms" className="text-orange-600 dark:text-orange-400 hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-orange-600 dark:text-orange-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
