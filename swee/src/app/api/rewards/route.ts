import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    // Get user's current points and history
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        points: true,
        pointsHistory: {
          orderBy: { createdAt: 'desc' },
          take: 20, // Last 20 transactions
          select: {
            id: true,
            points: true,
            reason: true,
            description: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Calculate user level based on points
    const level = Math.floor(user.points / 1000) + 1;
    const nextLevelPoints = level * 1000;
    const pointsToNextLevel = nextLevelPoints - user.points;

    return NextResponse.json({
      success: true,
      data: {
        totalPoints: user.points,
        pointsHistory: user.pointsHistory,
        level,
        nextLevelPoints,
        pointsToNextLevel
      }
    });

  } catch (error) {
    console.error('Rewards API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

// Award points for specific actions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { action, points, description } = await request.json();

    // Validate the action
    const validActions = ['quiz_completed', 'booking_made', 'review_left', 'referral_made'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action', success: false },
        { status: 400 }
      );
    }

    // Check if user has already earned points for this action (for one-time actions)
    const oneTimeActions = ['quiz_completed'];
    if (oneTimeActions.includes(action)) {
      const existingTransaction = await prisma.pointsTransaction.findFirst({
        where: {
          userId: session.user.id,
          reason: action
        }
      });

      if (existingTransaction) {
        return NextResponse.json(
          { error: 'Points already awarded for this action', success: false },
          { status: 400 }
        );
      }
    }

    // Award points
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: {
          increment: points
        }
      }
    });

    // Create transaction record
    await prisma.pointsTransaction.create({
      data: {
        userId: session.user.id,
        points,
        reason: action,
        description: description || `Points awarded for ${action}`
      }
    });

    return NextResponse.json({
      success: true,
      message: `${points} points awarded for ${action}`
    });

  } catch (error) {
    console.error('Award points error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
