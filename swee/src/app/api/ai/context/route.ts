import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { UserContext } from '@/services/aiAssistant';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch complete user data for AI context
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        bookings: {
          include: {
            service: {
              include: {
                merchant: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        pointsHistory: {
          orderBy: { createdAt: 'desc' }
        },
        hardSellReports: true,
        quizAnswers: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build comprehensive user context
    const userContext: UserContext = {
      id: user.id,
      name: user.name || 'User',
      email: user.email || '',
      
      // Quiz preferences
      serviceType: user.serviceType || undefined,
      hairConcerns: user.hairConcerns ? JSON.parse(user.hairConcerns as string) : [],
      facialConcerns: user.facialConcerns ? JSON.parse(user.facialConcerns as string) : [],
      browsLashesStyle: user.browsLashesStyle || undefined,
      budgetRange: user.budgetRange || undefined,
      frequency: user.frequency || undefined,
      lifestyle: user.lifestyle || undefined,
      availability: user.availability ? JSON.parse(user.availability as string) : {},
      
      // Booking analytics
      totalBookings: user.bookings.length,
      averageSpending: user.bookings.length > 0 
        ? user.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) / user.bookings.length
        : 0,
      preferredMerchants: [...new Set(user.bookings.map(b => b.service.merchant.name))],
      lastBookingDate: user.bookings.length > 0 ? user.bookings[0].createdAt : undefined,
      mostBookedCategory: getMostBookedCategory(user.bookings),
      
      // Trust & safety
      hardSellingExperience: user.hardSellingExperience || undefined,
      hardSellingProtection: user.hardSellingProtection || undefined,
      trustReportsSubmitted: user.hardSellReports.length,
      
      // Gamification
      totalPoints: user.points,
      currentLevel: calculateUserLevel(user.points),
      pointsToNextLevel: calculatePointsToNextLevel(user.points)
    };

    return NextResponse.json({ success: true, context: userContext });
  } catch (error) {
    console.error('Error fetching user context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user context' },
      { status: 500 }
    );
  }
}

function getMostBookedCategory(bookings: any[]): string {
  if (bookings.length === 0) return 'beauty services';
  
  const categoryCounts: Record<string, number> = {};
  bookings.forEach(booking => {
    const category = booking.service.category || 'OTHER';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  const mostBooked = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)[0];
  
  return mostBooked ? mostBooked[0] : 'beauty services';
}

function calculateUserLevel(points: number): string {
  if (points < 100) return 'Bronze';
  if (points < 500) return 'Silver';
  if (points < 1000) return 'Gold';
  if (points < 2000) return 'Platinum';
  return 'Diamond';
}

function calculatePointsToNextLevel(points: number): number {
  if (points < 100) return 100 - points;
  if (points < 500) return 500 - points;
  if (points < 1000) return 1000 - points;
  if (points < 2000) return 2000 - points;
  return 0; // Already at max level
}