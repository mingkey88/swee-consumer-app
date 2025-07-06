import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const merchantId = parseInt(id);
    
    if (isNaN(merchantId)) {
      return NextResponse.json(
        { error: 'Invalid merchant ID' },
        { status: 400 }
      );
    }

    // Fetch merchant with related data
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        services: {
          where: { isActive: true },
          include: {
            tags: true,
          },
        },
        appointments: {
          where: { 
            status: 'COMPLETED',
          },
          include: {
            user: {
              select: { name: true, email: true },
            },
            service: {
              select: { title: true },
            },
            feedback: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        owner: {
          select: { name: true, email: true },
        },
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Calculate average rating from feedback
    const feedbacks = merchant.appointments
      .map(appointment => appointment.feedback)
      .filter(feedback => feedback !== null);
    
    const averageRating = feedbacks.length > 0 
      ? feedbacks.reduce((sum, feedback) => sum + feedback!.rating, 0) / feedbacks.length
      : 0;

    // Format the response
    const response = {
      id: merchant.id,
      name: merchant.name,
      description: merchant.description,
      address: merchant.address,
      phone: merchant.phone,
      email: merchant.email,
      website: merchant.website,
      trustScore: merchant.trustScore,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: feedbacks.length,
      services: merchant.services.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category,
        tags: service.tags.map(tag => tag.name),
      })),
      reviews: merchant.appointments
        .filter(appointment => appointment.feedback)
        .map(appointment => ({
          id: appointment.id,
          user: {
            name: appointment.user.name || 'Anonymous',
            initial: (appointment.user.name || 'A').charAt(0),
          },
          rating: appointment.feedback!.rating,
          comment: appointment.feedback!.comment,
          date: appointment.createdAt,
          service: appointment.service?.title || 'Unknown Service',
        }))
        .slice(0, 5),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
