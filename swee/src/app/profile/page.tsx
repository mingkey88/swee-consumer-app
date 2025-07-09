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
  Plus
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="text-purple-600 hover:text-purple-700"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Profile Image and Name */}
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar className="w-32 h-32 mx-auto">
            <AvatarImage src={profileData.profileImage} alt={`${profileData.firstName} ${profileData.lastName}`} />
            <AvatarFallback className="text-2xl">{profileData.firstName[0]}{profileData.lastName[0]}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          {profileData.firstName} {profileData.lastName}
        </h2>
      </div>

      {/* Personal Information Form */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                First name
              </Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{profileData.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last name
              </Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{profileData.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mobile number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{profileData.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of birth
              </Label>
              {isEditing ? (
                <Input
                  id="birthday"
                  type="date"
                  value={profileData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(profileData.birthday).toLocaleDateString()}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleSave} className="bg-black hover:bg-gray-800 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* My Addresses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">My addresses</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Home</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add a home address</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Work</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add a work address</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointmentsContent = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No appointments yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Book your first appointment to get started</p>
            <Button asChild>
              <Link href="/">Browse Services</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWalletContent = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No payment methods</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add a payment method to book appointments</p>
            <Button>Add Payment Method</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFavoritesContent = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Favorites</h1>
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Save your favorite providers for easy booking</p>
            <Button asChild>
              <Link href="/">Explore Providers</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFormsContent = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forms</h1>
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No forms</h3>
            <p className="text-gray-600 dark:text-gray-400">Your intake forms will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrdersContent = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product orders</h1>
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Your product orders will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Download Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Swee
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <span className="mr-2">🔍</span>
                  All treatments
                </Button>
                <Button variant="ghost" size="sm">
                  Current location
                </Button>
                <Button variant="ghost" size="sm">
                  Any date
                </Button>
                <Button variant="ghost" size="sm">
                  Any time
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profileData.profileImage} alt={`${profileData.firstName} ${profileData.lastName}`} />
                <AvatarFallback>{profileData.firstName[0]}{profileData.lastName[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profileData.firstName} {profileData.lastName}
              </h2>
            </div>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
