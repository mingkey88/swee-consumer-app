'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Edit2, 
  Save, 
  X, 
  Calendar,
  Heart,
  Gift,
  Star,
  MapPin,
  Phone,
  Mail,
  Bell,
  Lock,
  CreditCard,
  FileText,
  Globe,
  Shield,
  Smartphone,
  Crown,
  ArrowRight,
  Camera,
  Settings,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Bella Chen',
    email: 'bella.chen@example.com',
    phone: '+65 9123 4567',
    birthday: '1995-03-15',
    location: 'Singapore',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  });

  const handleSave = () => {
    // In a real app, this would save to your API
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Swee
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Profile</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profileData.profileImage} alt={profileData.name} />
                        <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold">{profileData.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Member since March 2024</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{profileData.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthday">Birthday</Label>
                      {isEditing ? (
                        <Input
                          id="birthday"
                          type="date"
                          value={profileData.birthday}
                          onChange={(e) => handleInputChange('birthday', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Gift className="w-4 h-4 text-gray-400" />
                          <span>{new Date(profileData.birthday).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{profileData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Membership Card */}
            <Card className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5" />
                    <CardTitle className="text-lg">Swee Premium</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Pro
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm opacity-90">
                    Get exclusive perks, priority booking, and special discounts
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Priority booking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">15% off all services</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Free cancellation</span>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white">
                    Upgrade to Premium
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reviews</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your bookings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">My Bookings</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">View and manage appointments</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <Heart className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Favorites</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Your saved providers</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <Star className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Reviews</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rate your experiences</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Payment Methods</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Manage cards and billing</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="https://images.unsplash.com/photo-1562788869-4ed32648eb72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Bella Beauty Studio" />
                        <AvatarFallback>BB</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Bella Beauty Studio</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hair Cut & Styling</p>
                        <p className="text-xs text-gray-500">Dec 15, 2024 • 2:00 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Completed</Badge>
                      <p className="text-sm font-medium mt-1">$85</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Zen Spa" />
                        <AvatarFallback>ZS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Zen Spa</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Relaxing Massage</p>
                        <p className="text-xs text-gray-500">Dec 22, 2024 • 3:30 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-purple-100 text-purple-800">Upcoming</Badge>
                      <p className="text-sm font-medium mt-1">$120</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and privacy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive booking updates via email</p>
                      </div>
                    </div>
                    <Checkbox defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get text reminders for appointments</p>
                      </div>
                    </div>
                    <Checkbox defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Privacy Mode</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hide your profile from public searches</p>
                      </div>
                    </div>
                    <Checkbox />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive offers and promotions</p>
                      </div>
                    </div>
                    <Checkbox />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                    <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
