import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const paymentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('SGD'),
  paymentMethod: z.string()
});

const confirmPaymentSchema = z.object({
  bookingId: z.string(),
  serviceCompleted: z.boolean()
});

// Create escrow payment
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
    const validatedData = paymentSchema.parse(body);
    const { bookingId, amount, currency, paymentMethod } = validatedData;

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        merchant: true,
        service: true
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

    // Check if payment already exists
    const existingPayment = await prisma.pendingPayment.findUnique({
      where: { bookingId }
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment already exists for this booking', success: false },
        { status: 400 }
      );
    }

    // Create pending payment (escrow)
    const pendingPayment = await prisma.pendingPayment.create({
      data: {
        bookingId,
        amount,
        currency,
        paymentMethod,
        status: 'PENDING',
        // In real implementation, this would be the Stripe payment intent ID
        stripePaymentId: `pi_mock_${Date.now()}`
      }
    });

    // Update booking with payment amount
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        totalAmount: amount,
        currency
      }
    });

    // Award points for making booking
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: {
          increment: 200
        }
      }
    });

    await prisma.pointsTransaction.create({
      data: {
        userId: session.user.id,
        points: 200,
        reason: 'booking_made',
        description: `Booking made with ${booking.merchant.name}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment created successfully',
      paymentId: pendingPayment.id,
      pointsAwarded: 200
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: error.errors, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

// Confirm service completion and release payment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = confirmPaymentSchema.parse(body);
    const { bookingId, serviceCompleted } = validatedData;

    // Get booking and pending payment
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pendingPayment: true,
        merchant: true
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

    if (!booking.pendingPayment) {
      return NextResponse.json(
        { error: 'No pending payment found', success: false },
        { status: 404 }
      );
    }

    if (booking.pendingPayment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payment already processed', success: false },
        { status: 400 }
      );
    }

    if (serviceCompleted) {
      // Release payment to merchant
      await prisma.pendingPayment.update({
        where: { id: booking.pendingPayment.id },
        data: {
          status: 'RELEASED',
          releasedAt: new Date()
        }
      });

      // Create payout for merchant
      await prisma.pendingPayout.create({
        data: {
          merchantId: booking.merchantId,
          amount: booking.pendingPayment.amount,
          currency: booking.pendingPayment.currency,
          status: 'pending'
        }
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'COMPLETED'
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Payment released to merchant successfully'
      });
    } else {
      // Service not completed - keep payment in escrow
      return NextResponse.json({
        success: true,
        message: 'Payment remains in escrow until service is completed'
      });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid confirmation data', details: error.errors, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID required', success: false },
        { status: 400 }
      );
    }

    const payment = await prisma.pendingPayment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            merchant: true,
            service: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found', success: false },
        { status: 404 }
      );
    }

    if (payment.booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
