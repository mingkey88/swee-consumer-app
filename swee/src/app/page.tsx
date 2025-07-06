'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Calendar, Star, Heart, Sparkles, Moon, Sun } from 'lucide-react';
import AuthNavigation from '@/components/AuthNavigation';
import AISearch from '@/components/AISearch';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/hooks/useAdmin';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showAISearch, setShowAISearch] = useState(false);
  const { darkMode: isDarkMode, toggleDarkMode } = useTheme();
  const { isAdmin } = useAdmin();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (location) params.set('location', location);
    
    const searchUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    window.location.href = searchUrl;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Swee</h1>
            <nav className="hidden md:flex space-x-6">
              <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Browse</Link>
              <Link href="/rewards" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Rewards</Link>
              <Link href="/merchant/auth/signin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Business</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {/* Mobile Business Button */}
            <Link 
              href="/merchant/auth/signin" 
              className="md:hidden"
            >
              <Button size="sm" variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Business
              </Button>
            </Link>
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Admin Links - Only visible to admin users */}
            {isAdmin && (
              <>
                <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm">
                  Admin
                </Link>
                <Link href="/status" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Status
                </Link>
              </>
            )}
            
            {/* Non-admin users see login link */}
            {!isAdmin && (
              <Link href="/admin/login" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm">
                Admin Login
              </Link>
            )}
            
            <AuthNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Beauty services without the sales pressure
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto transition-colors duration-300">
            Discover trusted beauty professionals through AI-powered matching. 
            Transparent pricing, no pushy packages, just pure relaxation.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 max-w-4xl mx-auto relative overflow-hidden transition-colors duration-300">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-100/50 to-orange-100/50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-orange-900/20 opacity-50 animate-pulse"></div>
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300" />
                  <Input 
                    placeholder="Location" 
                    className="pl-10 border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-12 group-hover:bg-white dark:group-hover:bg-gray-600 transition-all duration-300 hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  {/* Input field glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="relative group">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300" />
                  <Input 
                    placeholder="Service or business" 
                    className="pl-10 border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-12 group-hover:bg-white dark:group-hover:bg-gray-600 transition-all duration-300 hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300" />
                  <Input 
                    placeholder="Date" 
                    className="pl-10 border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-12 group-hover:bg-white dark:group-hover:bg-gray-600 transition-all duration-300 hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-500"
                    onKeyPress={handleKeyPress}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <Button 
                  size="lg" 
                  className="h-12 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 dark:from-orange-600 dark:to-red-500 dark:hover:from-orange-700 dark:hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse text-white"
                  onClick={handleSearch}
                  style={{ animationDuration: '3s' }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {/* Enhanced AI Search Alternative */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 relative transition-colors duration-300">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <span className="text-sm">Don&apos;t know what you want?</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAISearch(true)}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 p-2 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Sparkles className="h-4 w-4 mr-1 group-hover:animate-spin transition-transform duration-500" />
                    <span className="relative z-10">Let AI help you decide</span>
                  </Button>
                </div>
                
                {/* Subtle pulsing indicator */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-400 dark:via-purple-500 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Finally, beauty services you can trust
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
              Say goodbye to surprise charges and aggressive sales tactics. 
              Swee&apos;s intelligent platform protects your wallet and your peace of mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-300">Escrow Protection</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Your payment is held securely until service completion. No more paying for disappointing treatments.</p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-300">No Hidden Upsells</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">What you book is what you pay. Our anti-hard-selling pledge ensures transparent pricing always.</p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-300">AI-Powered Matching</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Smart recommendations based on your preferences, not what generates the highest commission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white transition-colors duration-300">Explore by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Hair & Beauty', icon: '💇‍♀️', color: 'bg-orange-100 dark:bg-orange-900/30', searchCategory: 'Hair & Beauty' },
            { name: 'Health & Wellness', icon: '🏥', color: 'bg-blue-100 dark:bg-blue-900/30', searchCategory: 'Health & Wellness' },
            { name: 'Fitness', icon: '�', color: 'bg-green-100 dark:bg-green-900/30', searchCategory: 'Fitness' },
            { name: 'Massage & Spa', icon: '🧘‍♀️', color: 'bg-pink-100 dark:bg-pink-900/30', searchCategory: 'Massage & Spa' },
            { name: 'Nails', icon: '�', color: 'bg-red-100 dark:bg-red-900/30', searchCategory: 'Nails' },
            { name: 'Skincare', icon: '🧴', color: 'bg-purple-100 dark:bg-purple-900/30', searchCategory: 'Skincare' },
          ].map((category, index) => (
            <Link 
              key={index} 
              href={`/search?category=${encodeURIComponent(category.searchCategory)}`}
              className="block"
            >
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-all duration-300`}>
                    {category.icon}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{category.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalized Recommendations - Temporarily hidden */}
      {/* <section className="container mx-auto px-4 py-16 bg-gray-50/50">
        <PersonalizedRecommendations limit={3} />
      </section> */}

      {/* Featured Businesses */}
      <section className="container mx-auto px-4 py-16 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Popular near you</h2>
          <Link href="/search">
            <Button variant="outline" className="border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 dark:bg-gray-800 transition-colors duration-300">View all</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Bella Beauty Studio',
              category: 'Beauty Salon',
              rating: 4.8,
              reviews: 1,
              price: 'From $65',
              distance: '0.3 km away',
              tags: ['Hair', 'Facial', 'Brows'],
              image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
              searchCategory: 'Hair & Beauty',
              searchQuery: 'bella beauty studio',
              id: 1 // Add ID to link to our seeded data
            },
            {
              name: 'ZenFit Wellness',
              category: 'Spa & Fitness',
              rating: 4.8,
              reviews: 89,
              price: 'From $80',
              distance: '1.2 km away',
              tags: ['Massage', 'Yoga', 'Sauna'],
              image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
              searchCategory: 'Massage & Spa',
              searchQuery: 'spa wellness'
            },
            {
              name: 'Urban Cuts Barbershop',
              category: 'Barber Shop',
              rating: 4.7,
              reviews: 203,
              price: 'From $25',
              distance: '0.5 km away',
              tags: ['Haircut', 'Beard', 'Styling'],
              image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
              searchCategory: 'Hair & Beauty',
              searchQuery: 'barbershop'
            },
          ].map((business, index) => (
            <Link 
              key={index} 
              href={business.id ? `/providers/${business.id}` : `/search?category=${encodeURIComponent(business.searchCategory)}&query=${encodeURIComponent(business.searchQuery)}`}
              className="block"
            >
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={business.image} 
                    alt={business.name}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors duration-300">
                      <Heart className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-colors duration-300">{business.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-gray-900 dark:text-white">{business.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{business.rating}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({business.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">
                    <MapPin className="h-4 w-4" />
                    <span>{business.distance}</span>
                    <span>•</span>
                    <span className="font-medium text-gray-900 dark:text-white">{business.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white transition-colors duration-300">How Swee protects your beauty journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'AI-Powered Matching',
              description: 'Our intelligent onboarding quiz learns your preferences and matches you with verified professionals who align with your style.',
              icon: Star,
            },
            {
              step: '2',
              title: 'Transparent Booking',
              description: 'See real prices upfront with our escrow payment system. No hidden fees, no surprise upsells during your appointment.',
              icon: Search,
            },
            {
              step: '3',
              title: 'Pressure-Free Experience',
              description: 'Enjoy your service knowing our anti-hard-selling protection ensures you only pay for what you originally booked.',
              icon: Calendar,
            },
            {
              step: '4',
              title: 'Trust-Based Reviews',
              description: 'Rate your experience honestly. Our trust scoring system helps future customers while rewarding genuine service providers.',
              icon: Heart,
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-400 dark:from-orange-600 dark:to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full transition-colors duration-300">
                  Step {item.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto transition-colors duration-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-orange-400/80 to-red-300/80 dark:from-orange-500/70 dark:to-red-400/70 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">94%</div>
              <div className="text-orange-50 dark:text-orange-100">No Upselling Experienced</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2.8M</div>
              <div className="text-orange-50 dark:text-orange-100">Protected in Escrow</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">89%</div>
              <div className="text-orange-50 dark:text-orange-100">Perfect AI Matches</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-orange-50 dark:text-orange-100">Trust Score Average</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Call-to-Action Section */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Grow Your Beauty Business with Swee
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of beauty professionals who trust Swee to connect them with quality clients. 
              Our merchant platform helps you manage bookings, track payments, and build lasting customer relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/merchant/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold">
                  Join as a Merchant
                </Button>
              </Link>
              <Link href="/merchant/auth/signin">
                <Button variant="outline" size="lg" className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3 text-lg font-semibold">
                  Access Dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">Zero Commission</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Keep 100% of your earnings</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">Smart Matching</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI connects you with ideal clients</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">Easy Management</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streamlined booking & payments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Swee</h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-300">
                Beauty services built on trust, transparency, and authentic recommendations. 
                No sales pressure, just beautiful experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <li><a href="#" className="hover:text-white transition-colors">Browse Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Book Appointment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">My Bookings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Businesses</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <li><Link href="/merchant/auth/signup" className="hover:text-white transition-colors">List Your Business</Link></li>
                <li><Link href="/merchant/auth/signin" className="hover:text-white transition-colors">Business Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-gray-400 dark:text-gray-500 transition-colors duration-300">
            <p>&copy; 2025 Swee. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* AI Search Modal */}
      {showAISearch && (
        <AISearch onClose={() => setShowAISearch(false)} />
      )}
    </div>
  );
}
