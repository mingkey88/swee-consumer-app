import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (in real app, you'd have proper role checking)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required', success: false },
        { status: 403 }
      );
    }

    // Get hard-sell reports statistics
    const totalReports = await prisma.hardSellReport.count();
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentReports = await prisma.hardSellReport.count({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      }
    });

    // Get top offending merchants
    const merchantReports = await prisma.hardSellReport.groupBy({
      by: ['merchantId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const topOffendingMerchants = await Promise.all(
      merchantReports.map(async (report: any) => {
        const merchant = await prisma.merchant.findUnique({
          where: { id: report.merchantId },
          select: {
            id: true,
            name: true,
            trustScore: true,
            hardSellReports: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { createdAt: true }
            }
          }
        });

        return {
          id: merchant?.id || 0,
          name: merchant?.name || 'Unknown',
          reportCount: report._count.id,
          trustScore: merchant?.trustScore || 0,
          lastReportDate: merchant?.hardSellReports[0]?.createdAt.toISOString() || ''
        };
      })
    );

    // Get reports by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyReports = await prisma.hardSellReport.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        createdAt: true
      }
    });

    // Group by month
    const reportsByMonth = monthlyReports.reduce((acc: any, report: any) => {
      const month = report.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const formattedReportsByMonth = Object.entries(reportsByMonth).map(([month, count]) => ({
      month,
      count: count as number
    }));

    return NextResponse.json({
      success: true,
      metrics: {
        totalReports,
        recentReports,
        topOffendingMerchants,
        reportsByMonth: formattedReportsByMonth
      }
    });

  } catch (error) {
    console.error('Admin metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
