'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, Trophy, Gift, Star, Calendar, MessageCircle, Target, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface PointsTransaction {
  id: string;
  points: number;
  reason: string;
  description: string;
  createdAt: string;
}

interface RewardsData {
  totalPoints: number;
  pointsHistory: PointsTransaction[];
  level: number;
  nextLevelPoints: number;
  pointsToNextLevel: number;
}

export default function RewardsPage() {
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    // Remove authentication requirement - load demo data directly
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      // Demo data instead of API call
      const demoData = {
        success: true,
        data: {
          totalPoints: 1250,
          level: 3,
          nextLevelPoints: 2000,
          pointsToNextLevel: 750,
          pointsHistory: [
            {
              id: "1",
              points: 200,
              reason: "booking_completed",
              description: "Completed booking at Glow Beauty Studio",
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: "2",
              points: 100,
              reason: "quiz_completed",
              description: "Completed onboarding quiz",
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: "3",
              points: 50,
              reason: "review_submitted",
              description: "Left a review for Urban Cuts Barbershop",
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      };
      
      setRewardsData(demoData.data);
    } catch (error) {
      console.error('Error loading demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pointsActions = [
    {
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      title: "Complete Quiz",
      description: "Answer our onboarding questions",
      points: 100,
      action: "Take Quiz",
      href: "/quiz"
    },
    {
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      title: "Make a Booking",
      description: "Book your first service",
      points: 200,
      action: "Browse Services",
      href: "/search"
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-blue-500" />,
      title: "Leave a Review",
      description: "Share your experience",
      points: 50,
      action: "Write Review",
      href: "/bookings"
    },
    {
      icon: <Target className="h-5 w-5 text-purple-500" />,
      title: "Refer a Friend",
      description: "Invite friends to Swee",
      points: 500,
      action: "Coming Soon",
      href: "#"
    }
  ];

  const rewards = [
    {
      title: "$5 Off",
      cost: 500,
      description: "Next booking discount",
      icon: <Gift className="h-6 w-6 text-orange-500" />
    },
    {
      title: "$10 Off",
      cost: 1000,
      description: "Next booking discount",
      icon: <Gift className="h-6 w-6 text-orange-500" />
    },
    {
      title: "Free Service",
      cost: 2000,
      description: "Up to $50 value",
      icon: <Trophy className="h-6 w-6 text-gold-500" />
    },
    {
      title: "VIP Status",
      cost: 5000,
      description: "Premium features for 3 months",
      icon: <Star className="h-6 w-6 text-purple-500" />
    }
  ];

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'quiz_completed':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'booking_made':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'review_left':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Coins className="h-4 w-4 text-orange-500" />;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'quiz_completed':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'booking_made':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'review_left':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 relative">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Swee Rewards</h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Earn points, unlock rewards, and get the most out of your beauty journey</p>
        </div>

        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Coins className="h-8 w-8 text-orange-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    {rewardsData?.totalPoints || 0}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Total Points</Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">Available to spend</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-purple-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    Level {rewardsData?.level || 1}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Current Level</Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">Keep earning to level up!</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Next Level</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    {rewardsData?.pointsToNextLevel || 0} / {rewardsData?.nextLevelPoints || 1000}
                  </span>
                </div>
                <Progress 
                  value={rewardsData ? ((rewardsData.nextLevelPoints - rewardsData.pointsToNextLevel) / rewardsData.nextLevelPoints) * 100 : 0}
                  className="h-2"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                {rewardsData?.pointsToNextLevel || 0} points to level {(rewardsData?.level || 1) + 1}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earn Points */}
          <div>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white transition-colors duration-300">
                  <Target className="h-5 w-5 text-orange-500" />
                  <span>Earn Points</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pointsActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      {action.icon}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{action.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{action.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        +{action.points} pts
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => action.href !== "#" && (window.location.href = action.href)}
                        disabled={action.href === "#"}
                      >
                        {action.action}
                        {action.href !== "#" && <ArrowRight className="h-4 w-4 ml-1" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Redeem Rewards */}
          <div>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white transition-colors duration-300">
                  <Gift className="h-5 w-5 text-purple-500" />
                  <span>Redeem Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      {reward.icon}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{reward.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{reward.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400">
                        {reward.cost} pts
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={(rewardsData?.totalPoints || 0) < reward.cost}
                        className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Points History */}
        <Card className="mt-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">Points History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewardsData?.pointsHistory?.length ? (
                rewardsData.pointsHistory.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      {getReasonIcon(transaction.reason)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{transaction.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getReasonColor(transaction.reason)}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Coins className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">No points history yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Start earning points by completing actions above</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
