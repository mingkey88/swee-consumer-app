'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Clock, User, Mail, CheckCircle, XCircle, AlertCircle, ChevronDown, List, Grid, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar, dateFnsLocalizer, NavigateAction } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, addDays, addWeeks, subMonths, subDays, subWeeks } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useTheme } from '@/contexts/ThemeContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-dark.css';
import './calendar-text-fix.css';
import './view-toggle.css';
import './calendar-navigation.css';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Create a proper date-fns localizer for react-big-calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: string;
  datetime: string;
  status: string;
  notes?: string;
  totalAmount?: number;
  user: {
    name: string;
    email: string;
  };
  service: {
    title: string;
    duration: number;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  booking: Booking;
}

export default function MerchantCalendar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { darkMode: isDarkMode } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Generate dummy bookings if none exist
  const generateDummyBookings = () => {
    const dummyBookings: Booking[] = [];
    const serviceTypes = [
      { title: 'Haircut & Style', duration: 60 },
      { title: 'Manicure', duration: 45 },
      { title: 'Facial Treatment', duration: 90 },
      { title: 'Massage Therapy', duration: 60 },
      { title: 'Hair Coloring', duration: 120 }
    ];
    
    const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    const customerNames = ['John Smith', 'Emily Johnson', 'Michael Wong', 'Sophia Chen', 'James Lee'];
    
    // Generate bookings for the current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 15; i++) {
      const bookingDate = new Date(startOfWeek);
      bookingDate.setDate(startOfWeek.getDate() + Math.floor(i / 3));
      
      // Random time between 9AM and 5PM
      const hour = 9 + Math.floor(Math.random() * 8);
      const minute = Math.random() > 0.5 ? 30 : 0;
      bookingDate.setHours(hour, minute, 0, 0);
      
      const serviceIndex = Math.floor(Math.random() * serviceTypes.length);
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const customerIndex = Math.floor(Math.random() * customerNames.length);
      
      dummyBookings.push({
        id: `booking-${i}`,
        datetime: bookingDate.toISOString(),
        status: statuses[statusIndex],
        notes: Math.random() > 0.7 ? 'Customer requested extra attention on specific areas.' : undefined,
        totalAmount: Math.floor(Math.random() * 15000) + 5000, // $50-$200
        user: {
          name: customerNames[customerIndex],
          email: `${customerNames[customerIndex].toLowerCase().replace(' ', '.')}@example.com`
        },
        service: serviceTypes[serviceIndex]
      });
    }
    
    return dummyBookings;
  };

  // Navigation handlers
  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const navigatePrevious = () => {
    if (currentView === 'month') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else if (currentView === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else if (currentView === 'day') {
      setCurrentDate(prev => subDays(prev, 1));
    }
  };

  const navigateNext = () => {
    if (currentView === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else if (currentView === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else if (currentView === 'day') {
      setCurrentDate(prev => addDays(prev, 1));
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'MERCHANT') {
      router.push('/merchant/auth/signin');
      return;
    }

    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Normally would fetch from API, but let's use dummy data
      setTimeout(() => {
        const dummyData = generateDummyBookings();
        setBookings(dummyData);
        setLoading(false);
      }, 500);
    } catch (e) {
      console.error("Error fetching bookings:", e);
      setError('Failed to load bookings');
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/merchant/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      fetchBookings();
    } catch (e) {
      console.error("Error updating booking status:", e);
      setError('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      case 'NO_SHOW': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading calendar...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'MERCHANT') {
    return null;
  }

  // Convert bookings to calendar events
  const calendarEvents = bookings.map(booking => {
    const startDate = new Date(booking.datetime);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + booking.service.duration);
    
    return {
      id: booking.id,
      title: `${booking.service.title} - ${booking.user.name}`,
      start: startDate,
      end: endDate,
      status: booking.status,
      booking: booking
    };
  });
  
  // Get status-based colors for events
  const eventStyleGetter = (event: {status: string}) => {
    let backgroundColor;
    let borderColor;
    
    switch (event.status) {
      case 'PENDING':
        backgroundColor = 'rgba(251, 191, 36, 0.2)';
        borderColor = '#F59E0B';
        break;
      case 'CONFIRMED':
        backgroundColor = 'rgba(96, 165, 250, 0.2)';
        borderColor = '#3B82F6';
        break;
      case 'COMPLETED':
        backgroundColor = 'rgba(52, 211, 153, 0.2)';
        borderColor = '#10B981';
        break;
      case 'CANCELLED':
        backgroundColor = 'rgba(239, 68, 68, 0.2)';
        borderColor = '#EF4444';
        break;
      case 'NO_SHOW':
        backgroundColor = 'rgba(156, 163, 175, 0.2)';
        borderColor = '#6B7280';
        break;
      default:
        backgroundColor = 'rgba(156, 163, 175, 0.2)';
        borderColor = '#6B7280';
    }
    
    return {
      style: {
        backgroundColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '4px',
        color: '#000',
        display: 'block',
        padding: '2px 5px'
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Calendar
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Type Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-24 justify-between items-center">
                    {currentView === 'month' ? 'Month' : currentView === 'week' ? 'Week' : 'Day'}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCurrentView('month')}>
                    Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('week')}>
                    Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('day')}>
                    Day
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Calendar/List View Toggle */}
              <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 view-toggle-group">
                <Button 
                  variant="ghost"
                  className={`rounded-none h-9 px-4 view-toggle-button ${viewMode === 'calendar' ? 'bg-blue-600 text-white hover:bg-blue-700 active' : 'bg-transparent'}`}
                  onClick={() => setViewMode('calendar')}
                  aria-label="Calendar view"
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost"
                  className={`rounded-none h-9 px-4 view-toggle-button ${viewMode === 'list' ? 'bg-blue-600 text-white hover:bg-blue-700 active' : 'bg-transparent'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <Card className="mb-8">
            <CardContent className="p-4">
              {/* Navigation Controls */}
              <div className="flex items-center mb-4 justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    className="rounded-full h-9 px-4 today-button dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    onClick={navigateToday}
                  >
                    Today
                  </Button>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-9 h-9 flex items-center justify-center nav-button"
                      onClick={navigatePrevious}
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-9 h-9 flex items-center justify-center nav-button"
                      onClick={navigateNext}
                      aria-label="Next"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="ml-4 text-gray-700 dark:text-gray-200 font-medium">
                    {format(currentDate, currentView === 'month' ? 'MMMM yyyy' : currentView === 'week' ? "'Week of' MMM d, yyyy" : 'EEEE, MMMM d, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="h-[700px]">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  views={{
                    month: true,
                    week: true,
                    day: true
                  }}
                  view={currentView}
                  date={currentDate}
                  onNavigate={(date) => setCurrentDate(date)}
                  onView={(newView) => {
                    if (newView === 'month' || newView === 'week' || newView === 'day') {
                      setCurrentView(newView);
                    }
                  }}
                  toolbar={false}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={(event) => {
                    setSelectedDate(event.start.toISOString().split('T')[0]);
                    setViewMode('list');
                  }}
                  className={isDarkMode ? 'rbc-calendar-dark' : ''}
                  dayPropGetter={(date) => {
                    const today = new Date();
                    if (
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear()
                    ) {
                      return {
                        style: {
                          backgroundColor: 'rgba(249, 115, 22, 0.1)', // Light orange for today
                        },
                      };
                    }
                    return {};
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {/* Date Header */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {formatDate(selectedDate)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {bookings.filter(b => b.datetime.startsWith(selectedDate)).length} appointments scheduled
              </p>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {bookings.filter(b => b.datetime.startsWith(selectedDate)).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No appointments scheduled
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You don&apos;t have any appointments for this date.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                bookings.filter(b => b.datetime.startsWith(selectedDate)).map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-lg font-semibold">
                              {formatTime(booking.datetime)}
                            </span>
                            <Badge className={`${getStatusColor(booking.status)} border-0`}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(booking.status)}
                                <span>{booking.status}</span>
                              </span>
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-1">
                            {booking.service.title}
                          </CardTitle>
                          <CardDescription>
                            Duration: {booking.service.duration} minutes
                            {booking.totalAmount && (
                              <span className="ml-4">
                                Amount: ${(booking.totalAmount / 100).toFixed(2)}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            Customer Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{booking.user.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{booking.user.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            Actions
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {booking.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                                >
                                  Mark Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateBookingStatus(booking.id, 'NO_SHOW')}
                                >
                                  No Show
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
