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

    // Get all bookings for this merchant
    const bookings = await prisma.booking.findMany({
      where: { merchantId: merchant.id },
      include: {
        pendingPayment: true,
        service: {
          select: {
            title: true,
            price: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Calculate totals
    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.totalAmount || b.service.price), 0);

    const pendingPayments = bookings
      .filter(b => b.pendingPayment && b.pendingPayment.status === 'PENDING')
      .reduce((sum, b) => sum + b.pendingPayment!.amount, 0);

    const completedPayments = bookings
      .filter(b => b.pendingPayment && b.pendingPayment.status === 'RELEASED')
      .reduce((sum, b) => sum + b.pendingPayment!.amount, 0);

    // Calculate monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthlyBookings = bookings.filter(b => 
      b.createdAt >= currentMonth && 
      b.createdAt < nextMonth && 
      b.status === 'COMPLETED'
    );

    const monthlyRevenue = monthlyBookings
      .reduce((sum, b) => sum + (b.totalAmount || b.service.price), 0);

    // Calculate last month for growth comparison
    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthBookings = bookings.filter(b => 
      b.createdAt >= lastMonth && 
      b.createdAt < currentMonth && 
      b.status === 'COMPLETED'
    );

    const lastMonthRevenue = lastMonthBookings
      .reduce((sum, b) => sum + (b.totalAmount || b.service.price), 0);

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get recent transactions
    const recentTransactions = await prisma.pendingPayment.findMany({
      where: {
        booking: {
          merchantId: merchant.id
        }
      },
      include: {
        booking: {
          include: {
            service: {
              select: {
                title: true
              }
            },
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      totalRevenue,
      pendingPayments,
      completedPayments,
      monthlyRevenue,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        amount: t.amount,
        status: t.status,
        createdAt: t.createdAt,
        booking: {
          service: {
            title: t.booking.service.title
          },
          user: {
            name: t.booking.user.name
          }
        }
      }))
    });
  } catch (error) {
    console.error('Get merchant payments error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
