'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, DollarSign, Shield } from 'lucide-react';

interface ServiceCompletionProps {
  bookingId: string;
  merchantName: string;
  serviceName: string;
  amount: number;
  currency: string;
  onConfirm: (completed: boolean) => void;
  onClose: () => void;
}

export default function ServiceCompletion({ 
  bookingId, 
  merchantName, 
  serviceName, 
  amount, 
  currency, 
  onConfirm, 
  onClose 
}: ServiceCompletionProps) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async (completed: boolean) => {
    setConfirming(true);
    
    try {
      await onConfirm(completed);
    } catch (error) {
      console.error('Service completion error:', error);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span>Service Completion</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <DollarSign className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Payment in Escrow</h3>
              <p className="text-2xl font-bold text-blue-600">
                {currency} ${amount.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Service:</strong> {serviceName}</p>
              <p><strong>Provider:</strong> {merchantName}</p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-800 mb-1">Important</p>
                <p className="text-sm text-orange-700">
                  Your payment is currently held in escrow. Only confirm completion when you're satisfied with the service provided.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Did you receive your service?</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => handleConfirm(true)}
                disabled={confirming}
                className="bg-green-500 hover:bg-green-600 text-white p-4 h-auto"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Yes, Service Completed</p>
                    <p className="text-sm opacity-90">Release payment to provider</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleConfirm(false)}
                disabled={confirming}
                variant="outline"
                className="p-4 h-auto border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Not Yet / Issues</p>
                    <p className="text-sm opacity-90">Keep payment in escrow</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={confirming}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
