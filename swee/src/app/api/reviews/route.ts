import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const reviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  hardSellReported: z.boolean(),
  hardSellNote: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);
    const { bookingId, rating, comment, hardSellReported, hardSellNote } = validatedData;

    // Get the booking to verify ownership and get merchant info
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        merchant: true,
        feedback: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found', success: false },
        { status: 404 }
      );
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 403 }
      );
    }

    if (booking.feedback) {
      return NextResponse.json(
        { error: 'Review already submitted', success: false },
        { status: 400 }
      );
    }

    // Create the review/feedback
    const feedback = await prisma.feedback.create({
      data: {
        bookingId,
        rating,
        comment: comment || '',
        hardSellReported
      }
    });

    // If hard-sell was reported, create a hard-sell report
    if (hardSellReported && hardSellNote) {
      await prisma.hardSellReport.create({
        data: {
          userId: session.user.id,
          merchantId: booking.merchantId,
          bookingId,
          reported: true,
          note: hardSellNote
        }
      });

      // Update merchant trust score (-10 for hard-sell report)
      await prisma.merchant.update({
        where: { id: booking.merchantId },
        data: {
          trustScore: {
            decrement: 10
          }
        }
      });
    }

    // Update merchant trust score based on rating
    let trustScoreChange = 0;
    if (rating === 5) {
      trustScoreChange = 5; // +5 for 5-star review
    } else if (rating === 4) {
      trustScoreChange = 2; // +2 for 4-star review
    } else if (rating <= 2) {
      trustScoreChange = -2; // -2 for poor review
    }

    if (trustScoreChange !== 0) {
      await prisma.merchant.update({
        where: { id: booking.merchantId },
        data: {
          trustScore: {
            increment: trustScoreChange
          }
        }
      });
    }

    // Award points to user for leaving review
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: {
          increment: 50
        }
      }
    });

    await prisma.pointsTransaction.create({
      data: {
        userId: session.user.id,
        points: 50,
        reason: 'review_left',
        description: `Review left for ${booking.merchant.name}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      pointsAwarded: 50
    });

  } catch (error) {
    console.error('Review submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

// Get reviews for a merchant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchantId');

    if (!merchantId) {
      return NextResponse.json(
        { error: 'Merchant ID required', success: false },
        { status: 400 }
      );
    }

    const reviews = await prisma.feedback.findMany({
      where: {
        booking: {
          merchantId: parseInt(merchantId)
        }
      },
      include: {
        booking: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            },
            service: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
