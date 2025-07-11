'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Star, 
  Check,
  Calendar,
  CreditCard,
  TrendingUp,
  Shield,
  Users,
  BarChart,
  Smartphone,
  Sun,
  Moon,
  Play,
  Award
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ForBusinessPage() {
  const { darkMode: isDarkMode, toggleDarkMode } = useTheme();

  const testimonials = [
    {
      id: 1,
      name: "Sarah L.",
      role: "Salon Owner",
      location: "Marina Bay",
      rating: 5,
      comment: "Swee has transformed how I manage my salon. The anti-hard-selling approach means my clients trust the platform, and I've seen a 35% increase in bookings since joining.",
      avatar: "S"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Spa Manager",
      location: "Orchard Road",
      rating: 5,
      comment: "The trust-based system is exactly what the wellness industry needs. My clients appreciate the transparent pricing and genuine reviews. Revenue is up 40%.",
      avatar: "M"
    },
    {
      id: 3,
      name: "Jessica Wong",
      role: "Beauty Therapist",
      location: "Tampines",
      rating: 5,
      comment: "As an independent therapist, Swee's personalized approach helps me connect with clients who value quality over aggressive sales tactics. Perfect for my business model.",
      avatar: "J"
    }
  ];

  const businessTypes = [
    { name: "Hair Salon", icon: "💇‍♀️", color: "bg-pink-100 text-pink-600" },
    { name: "Nail Salon", icon: "💅", color: "bg-purple-100 text-purple-600" },
    { name: "Spa & Wellness", icon: "🧘‍♀️", color: "bg-blue-100 text-blue-600" },
    { name: "Massage Therapy", icon: "💆‍♀️", color: "bg-green-100 text-green-600" },
    { name: "Barbershop", icon: "✂️", color: "bg-orange-100 text-orange-600" },
    { name: "Beauty Clinic", icon: "✨", color: "bg-indigo-100 text-indigo-600" },
    { name: "Fitness Studio", icon: "🏋️‍♀️", color: "bg-red-100 text-red-600" },
    { name: "Eyebrow Bar", icon: "👁️", color: "bg-yellow-100 text-yellow-600" }
  ];

  const stats = [
    { number: "50,000+", label: "Partner Businesses", icon: Users },
    { number: "150,000+", label: "Professionals", icon: Award },
    { number: "5 Million+", label: "Appointments Booked", icon: Calendar },
    { number: "98%", label: "Customer Satisfaction", icon: Star }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Intelligent booking system that learns your preferences and reduces no-shows by 65%"
    },
    {
      icon: Shield,
      title: "Trust-First Platform",
      description: "Built on transparency and genuine reviews - no fake bookings or inflated ratings"
    },
    {
      icon: TrendingUp,
      title: "Personalized Growth",
      description: "AI-powered recommendations that help you grow authentically without aggressive tactics"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "End-to-end encrypted payments with instant payouts and competitive rates"
    },
    {
      icon: BarChart,
      title: "Real Analytics",
      description: "Honest insights into your business performance with actionable growth strategies"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Manage your business on-the-go with our award-winning mobile app"
    }
  ];

  const businessMetrics = [
    { percentage: "35%", label: "More Bookings", description: "Average increase in bookings within 3 months" },
    { percentage: "65%", label: "Fewer No-Shows", description: "Reduced cancellations with our trust-based system" },
    { percentage: "40%", label: "Higher Revenue", description: "Increase in average transaction value" },
    { percentage: "90%", label: "Customer Retention", description: "Clients who return within 30 days" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-orange-500">
                  Swee
                </span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                  Features
                </Link>
                <Link href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                  Reviews
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link href="/merchant/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/merchant/auth/signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-100/50 to-red-100/50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                #1 Trust-Based Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                The <span className="bg-gradient-to-r from-orange-500 to-red-400 bg-clip-text text-transparent">trust-first</span> platform for beauty & wellness businesses
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Simple, transparent, and powerful booking software built on trust. No hard-selling, no fake reviews - just genuine connections that grow your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/merchant/auth/signup">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-3">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" className="text-lg px-8 py-3">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-1" />
                  <span>Free 30-day trial</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-1" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-1" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="relative h-80 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-lg overflow-hidden mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Beautiful salon interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Bella Beauty Studio</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">4.9</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">147 reviews</span>
                    </div>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to grow your business
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built specifically for beauty and wellness professionals who believe in authentic relationships over aggressive sales tactics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Perfect for all business types
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join thousands of beauty and wellness professionals who trust Swee
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {businessTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type.color}`}>
                  <span className="text-2xl">{type.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{type.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Metrics */}
      <section className="py-20 bg-gradient-to-br from-orange-100/50 to-red-100/50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real results from real businesses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how Swee helps businesses grow through trust and authenticity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {metric.percentage}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {metric.label}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by professionals everywhere
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of happy business owners who&apos;ve made the switch
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-4">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                      &quot;{testimonial.comment}&quot;
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500/90 to-red-400/90 bg-opacity-90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to grow your business the right way?
          </h2>
          <p className="text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
            Join thousands of beauty and wellness professionals who&apos;ve chosen trust over tactics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/merchant/auth/signup">
              <Button className="bg-white text-orange-600 hover:bg-gray-50 text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              className="bg-gray-900/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-3 font-bold shadow-xl transition-all duration-200"
            >
              Schedule Demo
            </Button>
          </div>
          <div className="mt-8 text-orange-50 text-sm">
            30-day free trial • No credit card required • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">Swee</span>
              </div>
              <p className="text-gray-400 text-sm">
                The trust-first platform for beauty and wellness businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Mobile App</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 Swee. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
