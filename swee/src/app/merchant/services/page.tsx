'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Clock,
  Tag,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

export default function MerchantServices() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: 'BEAUTY'
  });

  const categories = [
    { value: 'BEAUTY', label: 'Hair & Beauty' },
    { value: 'WELLNESS', label: 'Health & Wellness' },
    { value: 'FITNESS', label: 'Fitness' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'MERCHANT') {
      router.push('/merchant/auth/signin');
      return;
    }

    fetchServices();
  }, [session, status, router]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/merchant/services');
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/merchant/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newService,
          price: parseInt(newService.price) * 100, // Convert to cents
          duration: parseInt(newService.duration)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add service');
      }

      setSuccess('Service added successfully!');
      setNewService({ title: '', description: '', price: '', duration: '', category: 'BEAUTY' });
      setShowAddForm(false);
      fetchServices();
    } catch (err) {
      setError('Failed to add service. Please try again.');
    }
  };

  const handleUpdateService = async (service: Service) => {
    try {
      const response = await fetch(`/api/merchant/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      setSuccess('Service updated successfully!');
      setEditingService(null);
      fetchServices();
    } catch (err) {
      setError('Failed to update service. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/merchant/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      setSuccess('Service deleted successfully!');
      fetchServices();
    } catch (err) {
      setError('Failed to delete service. Please try again.');
    }
  };

  const toggleServiceStatus = async (service: Service) => {
    await handleUpdateService({ ...service, isActive: !service.isActive });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading services...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'MERCHANT') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/merchant/dashboard" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Services
              </h1>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
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

        {success && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Add Service Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Service</CardTitle>
              <CardDescription>
                Create a new service offering for your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Name</Label>
                    <Input
                      id="title"
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      required
                      placeholder="e.g., Hair Cut & Style"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Describe your service..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (SGD)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      required
                      min="1"
                      placeholder="60"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">Add Service</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className={`${!service.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {categories.find(c => c.value === service.category)?.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${(service.price / 100).toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}min
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={service.isActive ? "outline" : "default"}
                    onClick={() => toggleServiceStatus(service)}
                  >
                    {service.isActive ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No services yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by adding your first service offering
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
