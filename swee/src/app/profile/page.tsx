'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Edit2, 
  Save, 
  X, 
  Calendar,
  Heart,
  MapPin,
  Bell,
  Lock,
  CreditCard,
  FileText,
  Globe,
  Shield,
  Smartphone,
  Settings,
  Trash2,
  ShoppingBag,
  Building2,
  Plus,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'Tan Ming',
    lastName: 'Jie',
    email: 'mingje.tan88@gmail.com',
    phone: '+65 9123 4567',
    birthday: '1995-03-15',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  });

  const handleSave = () => {
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

  const navigationItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'orders', label: 'Product orders', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderProfileContent = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Good evening, {profileData.firstName}!</h1>
          <p className="text-gray-400">Here&apos;s your profile information</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            View Calendar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-sm text-green-400">+12.5% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Favorites</p>
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-sm text-blue-400">+3 from yesterday</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Trust Score</p>
                <p className="text-2xl font-bold text-white">4.8</p>
                <p className="text-sm text-yellow-400">⭐ 127 reviews</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Since</p>
                <p className="text-2xl font-bold text-white">2024</p>
                <p className="text-sm text-purple-400">+7 new this week</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                  First name
                </Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                ) : (
                  <p className="text-gray-400 py-2">{profileData.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                  Last name
                </Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                ) : (
                  <p className="text-gray-400 py-2">{profileData.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              ) : (
                <p className="text-gray-400 py-2">{profileData.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                Mobile number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              ) : (
                <p className="text-gray-400 py-2">{profileData.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-sm font-medium text-gray-300">
                Date of birth
              </Label>
              {isEditing ? (
                <Input
                  id="birthday"
                  type="date"
                  value={profileData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              ) : (
                <p className="text-gray-400 py-2">
                  {new Date(profileData.birthday).toLocaleDateString()}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* My Addresses Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">My addresses</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Home</p>
                  <p className="text-sm text-gray-400">Add a home address</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Work</p>
                  <p className="text-sm text-gray-400">Add a work address</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointmentsContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
          <p className="text-gray-400">Manage your appointments and bookings</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Calendar className="w-4 h-4 mr-2" />
          Book New Appointment
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No appointments yet</h3>
            <p className="text-gray-400 mb-6">Book your first appointment to get started</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/">Browse Services</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWalletContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-gray-400">Manage your payment methods and billing</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <CreditCard className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No payment methods</h3>
            <p className="text-gray-400 mb-6">Add a payment method to book appointments</p>
            <Button className="bg-orange-500 hover:bg-orange-600">Add Payment Method</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFavoritesContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Favorites</h1>
          <p className="text-gray-400">Your saved providers and services</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Heart className="w-4 h-4 mr-2" />
          Explore Providers
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
            <p className="text-gray-400 mb-6">Save your favorite providers for easy booking</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/">Explore Providers</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFormsContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Forms</h1>
          <p className="text-gray-400">Your intake forms and documents</p>
        </div>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No forms</h3>
            <p className="text-gray-400">Your intake forms will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrdersContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Product orders</h1>
          <p className="text-gray-400">Your product purchases and order history</p>
        </div>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400">Your product orders will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive booking updates via email</p>
                </div>
              </div>
              <Checkbox defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">SMS Notifications</p>
                  <p className="text-sm text-gray-400">Get text reminders for appointments</p>
                </div>
              </div>
              <Checkbox defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Privacy Mode</p>
                  <p className="text-sm text-gray-400">Hide your profile from public searches</p>
                </div>
              </div>
              <Checkbox />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Marketing Communications</p>
                  <p className="text-sm text-gray-400">Receive offers and promotions</p>
                </div>
              </div>
              <Checkbox />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Download Data
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-600 text-red-400 hover:bg-red-900/20 hover:text-red-300">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileContent();
      case 'appointments':
        return renderAppointmentsContent();
      case 'wallet':
        return renderWalletContent();
      case 'favorites':
        return renderFavoritesContent();
      case 'forms':
        return renderFormsContent();
      case 'orders':
        return renderOrdersContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderProfileContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Swee
            </Link>
            <div className="px-3 py-1 bg-gray-700 rounded-lg text-sm text-gray-300">
              Profile
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{profileData.firstName} {profileData.lastName}</p>
                <p className="text-xs text-gray-400">User</p>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={profileData.profileImage} alt={`${profileData.firstName} ${profileData.lastName}`} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* User Info */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profileData.profileImage} alt={`${profileData.firstName} ${profileData.lastName}`} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-sm text-gray-400">User</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main Site
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
