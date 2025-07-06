'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, Star, MessageCircle, Shield } from 'lucide-react';

interface PostBookingReviewProps {
  bookingId: string;
  merchantId: number;
  merchantName: string;
  serviceName: string;
  onSubmit: (reviewData: ReviewData) => void;
  onClose: () => void;
}

interface ReviewData {
  rating: number;
  comment: string;
  hardSellReported: boolean;
  hardSellNote?: string;
}

export default function PostBookingReview({ 
  bookingId, 
  merchantId, 
  merchantName, 
  serviceName, 
  onSubmit, 
  onClose 
}: PostBookingReviewProps) {
  const [step, setStep] = useState(1); // 1: Rating, 2: Hard-sell check, 3: Comments
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hardSellReported, setHardSellReported] = useState<boolean | null>(null);
  const [hardSellNote, setHardSellNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const reviewData: ReviewData = {
        rating,
        comment,
        hardSellReported: hardSellReported || false,
        hardSellNote: hardSellReported ? hardSellNote : undefined
      };

      await onSubmit(reviewData);
    } catch (error) {
      console.error('Review submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return rating > 0;
      case 2:
        return hardSellReported !== null;
      case 3:
        return !hardSellReported || hardSellNote.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Service Review</CardTitle>
            <Badge variant="outline">
              Step {step} of 3
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">{merchantName}</p>
            <p>{serviceName}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">How was your experience?</h3>
                <p className="text-sm text-gray-600">Rate your overall satisfaction</p>
              </div>
              
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-full transition-colors ${
                      star <= rating 
                        ? 'text-yellow-400 hover:text-yellow-500' 
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
              
              {rating > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    You rated this {rating} star{rating !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Trust & Safety Check</h3>
                <p className="text-sm text-gray-600">
                  Did the service provider try to pressure you into buying additional services or products?
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>What is hard-selling?</strong>
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Pressuring you to buy extra services</li>
                  <li>• Making you feel guilty for not purchasing</li>
                  <li>• Refusing to take "no" for an answer</li>
                  <li>• Adding services without your consent</li>
                </ul>
              </div>

              <RadioGroup
                value={hardSellReported === null ? "" : hardSellReported.toString()}
                onValueChange={(value) => setHardSellReported(value === "true")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="no-hardsell" />
                  <Label htmlFor="no-hardsell" className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No, they were respectful</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="yes-hardsell" />
                  <Label htmlFor="yes-hardsell" className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Yes, there was hard-selling</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {hardSellReported ? "Tell us more" : "Share your thoughts"}
                </h3>
                <p className="text-sm text-gray-600">
                  {hardSellReported 
                    ? "Please describe what happened (this helps us protect other users)"
                    : "Leave a comment about your experience (optional)"
                  }
                </p>
              </div>

              {hardSellReported && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-medium text-red-800">Hard-sell Details</p>
                  </div>
                  <Textarea
                    placeholder="Please describe what happened..."
                    value={hardSellNote}
                    onChange={(e) => setHardSellNote(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              )}

              {!hardSellReported && (
                <div>
                  <Label htmlFor="general-comment" className="text-sm font-medium">
                    General Comment (Optional)
                  </Label>
                  <Textarea
                    id="general-comment"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] mt-1"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={step === 1 ? onClose : handleBack}
              disabled={submitting}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitting}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {submitting ? 'Submitting...' : step === 3 ? 'Submit Review' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
