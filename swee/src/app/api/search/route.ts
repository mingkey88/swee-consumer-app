import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const category = url.searchParams.get('category') || '';
    const location = url.searchParams.get('location') || '';

    // Build search conditions
    let whereClause: any = {};
    
    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { services: { some: { title: { contains: query, mode: 'insensitive' } } } },
      ];
    }

    if (location) {
      whereClause.address = { contains: location, mode: 'insensitive' };
    }

    // Fetch merchants with their services and ratings
    const merchants = await prisma.merchant.findMany({
      where: whereClause,
      include: {
        services: {
          where: { isActive: true },
          take: 3, // Limit services for search results
        },
        appointments: {
          where: { 
            status: 'COMPLETED',
            feedback: { isNot: null }
          },
          include: {
            feedback: true,
          },
        },
      },
    });

    // Format results with calculated ratings
    const results = merchants.map(merchant => {
      const feedbacks = merchant.appointments
        .map(appointment => appointment.feedback)
        .filter(feedback => feedback !== null);
      
      const averageRating = feedbacks.length > 0 
        ? feedbacks.reduce((sum, feedback) => sum + feedback!.rating, 0) / feedbacks.length
        : 0;

      const minPrice = merchant.services.length > 0 
        ? Math.min(...merchant.services.map(service => service.price))
        : 0;

      return {
        id: merchant.id,
        name: merchant.name,
        description: merchant.description,
        address: merchant.address,
        phone: merchant.phone,
        trustScore: merchant.trustScore,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: feedbacks.length,
        minPrice: minPrice,
        services: merchant.services.map(service => ({
          id: service.id,
          title: service.title,
          price: service.price,
          category: service.category,
        })),
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching merchants:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
