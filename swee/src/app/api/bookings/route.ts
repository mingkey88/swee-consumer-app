import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantId, serviceId, userId, datetime, notes } = body;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        datetime: new Date(datetime),
        status: 'PENDING',
        notes: notes || '',
        userId: userId,
        serviceId: parseInt(serviceId),
        merchantId: parseInt(merchantId),
        totalAmount: 0, // Will be calculated based on service price
      },
      include: {
        service: true,
        merchant: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Update the total amount based on service price
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        totalAmount: booking.service.price / 100, // Convert cents to dollars
      },
      include: {
        service: true,
        merchant: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let whereClause = {};
    if (userId) {
      whereClause = { userId };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        service: true,
        merchant: true,
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
