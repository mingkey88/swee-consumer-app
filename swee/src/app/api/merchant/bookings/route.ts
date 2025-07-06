import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'MERCHANT') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const merchant = await prisma.merchant.findFirst({
      where: { ownerId: session.user.id }
    });

    if (!merchant) {
      return NextResponse.json(
        { message: 'Merchant profile not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let whereClause: any = { merchantId: merchant.id };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause.datetime = {
        gte: startDate,
        lt: endDate
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        service: {
          select: {
            title: true,
            duration: true
          }
        }
      },
      orderBy: { datetime: 'asc' }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get merchant bookings error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
