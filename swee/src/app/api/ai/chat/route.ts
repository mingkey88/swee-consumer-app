import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { aiAssistant, AIMessage } from '@/services/aiAssistant';

// Helper functions
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch user context directly
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

    // Build user context
    const userContext = {
      id: user.id,
      name: user.name || 'User',
      email: user.email || '',
      serviceType: user.serviceType || undefined,
      hairConcerns: user.hairConcerns ? JSON.parse(user.hairConcerns as string) : [],
      facialConcerns: user.facialConcerns ? JSON.parse(user.facialConcerns as string) : [],
      browsLashesStyle: user.browsLashesStyle || undefined,
      budgetRange: user.budgetRange || undefined,
      frequency: user.frequency || undefined,
      lifestyle: user.lifestyle || undefined,
      availability: user.availability ? JSON.parse(user.availability as string) : {},
      totalBookings: user.bookings.length,
      averageSpending: user.bookings.length > 0 
        ? user.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) / user.bookings.length
        : 0,
      preferredMerchants: [...new Set(user.bookings.map(b => b.service.merchant.name))],
      lastBookingDate: user.bookings.length > 0 ? user.bookings[0].createdAt : undefined,
      mostBookedCategory: getMostBookedCategory(user.bookings),
      hardSellingExperience: user.hardSellingExperience || undefined,
      hardSellingProtection: user.hardSellingProtection || undefined,
      trustReportsSubmitted: user.hardSellReports.length,
      totalPoints: user.points,
      currentLevel: calculateUserLevel(user.points),
      pointsToNextLevel: calculatePointsToNextLevel(user.points)
    };

    // Generate AI response
    const result = await aiAssistant.generateResponse(
      userContext,
      conversationHistory || [],
      message
    );

    // Award points for AI interaction (5 points per meaningful conversation)
    let updatedPoints = user.points;
    try {
      if (user && message.length > 10) { // Only award for meaningful messages
        updatedPoints = user.points + 5;
        await prisma.user.update({
          where: { id: user.id },
          data: { points: updatedPoints }
        });

        await prisma.pointsTransaction.create({
          data: {
            userId: user.id,
            points: 5,
            reason: 'ai_interaction',
            description: 'Chatted with Swee AI Assistant'
          }
        });
      }
    } catch (pointsError) {
      console.error('Error awarding AI interaction points:', pointsError);
      // Don't fail the request if points update fails
    }

    return NextResponse.json({
      success: true,
      response: result.response,
      suggestedActions: result.suggestedActions,
      userContext: {
        name: userContext.name,
        points: updatedPoints,
        level: calculateUserLevel(updatedPoints)
      }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// Get proactive suggestions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user context directly
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

    // Build user context
    const userContext = {
      id: user.id,
      name: user.name || 'User',
      email: user.email || '',
      serviceType: user.serviceType || undefined,
      hairConcerns: user.hairConcerns ? JSON.parse(user.hairConcerns as string) : [],
      facialConcerns: user.facialConcerns ? JSON.parse(user.facialConcerns as string) : [],
      browsLashesStyle: user.browsLashesStyle || undefined,
      budgetRange: user.budgetRange || undefined,
      frequency: user.frequency || undefined,
      lifestyle: user.lifestyle || undefined,
      availability: user.availability ? JSON.parse(user.availability as string) : {},
      totalBookings: user.bookings.length,
      averageSpending: user.bookings.length > 0 
        ? user.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) / user.bookings.length
        : 0,
      preferredMerchants: [...new Set(user.bookings.map(b => b.service.merchant.name))],
      lastBookingDate: user.bookings.length > 0 ? user.bookings[0].createdAt : undefined,
      mostBookedCategory: getMostBookedCategory(user.bookings),
      hardSellingExperience: user.hardSellingExperience || undefined,
      hardSellingProtection: user.hardSellingProtection || undefined,
      trustReportsSubmitted: user.hardSellReports.length,
      totalPoints: user.points,
      currentLevel: calculateUserLevel(user.points),
      pointsToNextLevel: calculatePointsToNextLevel(user.points)
    };

    // Generate proactive suggestions
    const suggestions = await aiAssistant.generateProactiveSuggestions(userContext);

    return NextResponse.json({
      success: true,
      suggestions,
      userContext: {
        name: userContext.name,
        points: userContext.totalPoints,
        level: userContext.currentLevel
      }
    });
  } catch (error) {
    console.error('AI Suggestions Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}