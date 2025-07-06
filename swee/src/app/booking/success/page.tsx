'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Star,
  Home,
  Shield,
  QrCode,
  Smartphone,
  AlertTriangle,
  FileText,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

export default function BookingSuccessPage() {
  const [bookingId] = useState('SWE-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const { darkMode, toggleDarkMode } = useTheme();
  
  const bookingDetails = {
    id: bookingId,
    service: 'Haircut & Style',
    provider: 'The Hair Lounge',
    date: 'Monday, July 7, 2025',
    time: '2:00 PM',
    duration: '45 min',
    address: '277A Holland Avenue, Singapore 278624',
    phone: '+65 6123 4567',
    total: '$92.65',
    paymentMethod: 'Card ending in 3456'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="absolute right-0 top-0"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Your appointment has been successfully booked</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Details</CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Confirmed
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Booking ID: {bookingDetails.id}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Star className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{bookingDetails.service}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{bookingDetails.duration}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{bookingDetails.total}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{bookingDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{bookingDetails.time}</p>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              <div className="border-t dark:border-gray-700 pt-6">
                <h4 className="font-semibold mb-3">Provider Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">{bookingDetails.provider}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bookingDetails.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm">{bookingDetails.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Codes for Service Verification */}
          <Card>              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Service Verification Codes
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present these QR codes to your service provider</p>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* Check-in QR Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center space-y-3">
                  <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <div className="w-32 h-32 bg-white dark:bg-gray-900 border rounded-lg flex items-center justify-center mx-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({length: 64}).map((_, i) => (
                            <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400">Check-In QR Code</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Show this when you arrive</p>
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-500 mt-1">ID: CHK-{bookingDetails.id.slice(-6)}</p>
                  </div>
                </div>

                {/* Service Completion QR Code */}
                <div className="text-center space-y-3">
                  <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <div className="w-32 h-32 bg-white dark:bg-gray-900 border rounded-lg flex items-center justify-center mx-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({length: 64}).map((_, i) => (
                            <div key={i} className={`w-1 h-1 ${Math.random() > 0.3 ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400">Service Completion QR Code</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Show this after service completion</p>
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-500 mt-1">ID: CMP-{bookingDetails.id.slice(-6)}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200">How to Use Your QR Codes</h4>
                    <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                      <div className="flex items-start gap-2">
                        <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                        <p><strong>Upon Arrival:</strong> Show the green Check-In QR code to your service provider to confirm your appointment</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                        <p><strong>After Service:</strong> Show the blue Service Completion QR code to confirm service was provided</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                        <p><strong>Payment Release:</strong> Your payment will be released to the merchant after QR code verification</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-gray-600">{bookingDetails.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Amount Secured</p>
                    <p className="text-lg font-bold text-blue-600">{bookingDetails.total}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="text-xs text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Secure Escrow Payment</p>
                      <p>Your payment is held securely and will be released to the merchant only after service completion and your confirmation. This ensures quality service without hard-selling pressure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Confirmation Email Sent</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Check your email for appointment details and directions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Arrive 15 Minutes Early</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please arrive 15 minutes before your appointment time
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Enjoy Your Service</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Relax and enjoy your appointment without any sales pressure
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Confirm Service Completion</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      After your service, confirm completion to release payment to the merchant
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hard-Selling Protection */}
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-200">
                <Shield className="h-5 w-5" />
                Swee Protection Against Hard-Selling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-200">Important Reminder</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    After your service, you'll receive a quick survey asking about your experience. 
                    Please report if the service provider attempted any hard-selling or pressured you 
                    to purchase additional services not originally booked.
                  </p>
                  <div className="bg-orange-100 dark:bg-orange-800/50 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-orange-700 dark:text-orange-300" />
                      <span className="text-sm font-medium text-orange-900 dark:text-orange-200">Post-Service Survey Topics:</span>
                    </div>
                    <ul className="text-xs text-orange-800 dark:text-orange-300 space-y-1 ml-6">
                      <li>• Service quality and satisfaction</li>
                      <li>• Any attempts at upselling or hard-selling</li>
                      <li>• Pressure to buy additional products/services</li>
                      <li>• Overall experience and recommendations</li>
                    </ul>
                  </div>
                  <p className="text-xs text-orange-700 dark:text-orange-400 italic">
                    Your feedback helps us maintain service quality and protect future customers from unwanted sales pressure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support */}
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200">Need Help?</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                    If you need to reschedule or have any questions, contact us:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-800 dark:text-blue-300">📞 +65 6123 4567</p>
                    <p className="text-blue-800 dark:text-blue-300">✉️ support@swee.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
