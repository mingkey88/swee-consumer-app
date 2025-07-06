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

    // Get user profile and preferences
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        serviceType: true,
        hairConcerns: true,
        facialConcerns: true,
        browsLashesStyle: true,
        budgetRange: true,
        frequency: true,
        lifestyle: true,
        availability: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Get recommended services based on user profile
    const recommendations = await generateRecommendations(user);

    return NextResponse.json({
      success: true,
      recommendations,
      userProfile: user
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

async function generateRecommendations(user: any) {
  const recommendations = [];

  // Parse user concerns
  const hairConcerns = user.hairConcerns ? JSON.parse(user.hairConcerns) : [];
  const facialConcerns = user.facialConcerns ? JSON.parse(user.facialConcerns) : [];
  const availability = user.availability ? JSON.parse(user.availability) : [];

  // Get budget range
  const budgetRange = parseBudgetRange(user.budgetRange);

  // 1. Service Type Based Recommendations
  const serviceCategories = getServiceCategories(user.serviceType);
  
  // 2. Get services matching user's service type and budget
  const services = await prisma.service.findMany({
    where: {
      category: {
        in: serviceCategories
      },
      price: {
        gte: budgetRange.min * 100, // Convert to cents
        lte: budgetRange.max * 100
      },
      isActive: true
    },
    include: {
      merchant: {
        select: {
          id: true,
          name: true,
          address: true,
          trustScore: true
        }
      },
      tags: {
        select: {
          name: true,
          category: true
        }
      }
    },
    orderBy: [
      { merchant: { trustScore: 'desc' } }, // Prioritize trusted merchants
      { price: 'asc' }
    ]
  });

  // 3. Score and filter services based on user preferences
  const scoredServices = services.map((service: any) => {
    let score = 0;
    const reasons = [];

    // Base score from trust score
    score += Math.min(service.merchant.trustScore / 10, 10);

    // Match specific concerns with service tags
    if (hairConcerns.length > 0) {
      const hairMatches = service.tags.filter((tag: any) => 
        tag.category === 'hair_concern' && 
        hairConcerns.some((concern: string) => concern.toLowerCase().includes(tag.name.toLowerCase()))
      );
      if (hairMatches.length > 0) {
        score += hairMatches.length * 5;
        reasons.push(`Addresses your hair concerns: ${hairMatches.map((m: any) => m.name).join(', ')}`);
      }
    }

    if (facialConcerns.length > 0) {
      const facialMatches = service.tags.filter((tag: any) => 
        tag.category === 'facial_concern' && 
        facialConcerns.some((concern: string) => concern.toLowerCase().includes(tag.name.toLowerCase()))
      );
      if (facialMatches.length > 0) {
        score += facialMatches.length * 5;
        reasons.push(`Addresses your skin concerns: ${facialMatches.map((m: any) => m.name).join(', ')}`);
      }
    }

    // Style preference matching
    if (user.browsLashesStyle) {
      const styleMatches = service.tags.filter((tag: any) => 
        tag.category === 'style_preference' && 
        user.browsLashesStyle.toLowerCase().includes(tag.name.toLowerCase())
      );
      if (styleMatches.length > 0) {
        score += styleMatches.length * 3;
        reasons.push(`Matches your style preference: ${user.browsLashesStyle}`);
      }
    }

    // Budget preference bonus
    const servicePrice = service.price / 100;
    if (servicePrice <= budgetRange.preferred) {
      score += 3;
      reasons.push('Within your preferred budget range');
    }

    // Frequency matching (higher score for regular services if user books frequently)
    if (user.frequency === 'Weekly' || user.frequency === 'Bi-weekly') {
      if (service.title.toLowerCase().includes('maintenance') || 
          service.title.toLowerCase().includes('touch-up')) {
        score += 2;
        reasons.push('Perfect for regular maintenance');
      }
    }

    // Lifestyle matching
    if (user.lifestyle?.includes('quick, efficient') && service.duration && service.duration <= 60) {
      score += 2;
      reasons.push('Quick and efficient service');
    }

    if (user.lifestyle?.includes('relaxing') && service.duration && service.duration >= 90) {
      score += 2;
      reasons.push('Relaxing, longer treatment');
    }

    return {
      ...service,
      score,
      reasons,
      matchPercentage: Math.min(Math.round((score / 20) * 100), 100)
    };
  });

  // 4. Sort by score and return top recommendations
  const topRecommendations = scoredServices
    .filter((service: any) => service.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10);

  return topRecommendations;
}

function getServiceCategories(serviceType: string | null) {
  switch (serviceType) {
    case 'Hair Services':
      return ['BEAUTY'];
    case 'Facial Treatments':
      return ['BEAUTY', 'WELLNESS'];
    case 'Brows & Lashes':
      return ['BEAUTY'];
    case 'Multiple Services':
      return ['BEAUTY', 'WELLNESS'];
    default:
      return ['BEAUTY'];
  }
}

function parseBudgetRange(budgetRange: string | null) {
  switch (budgetRange) {
    case 'Under $50':
      return { min: 0, max: 50, preferred: 40 };
    case '$50 - $100':
      return { min: 50, max: 100, preferred: 75 };
    case '$100 - $150':
      return { min: 100, max: 150, preferred: 125 };
    case '$150 - $200':
      return { min: 150, max: 200, preferred: 175 };
    case 'Above $200':
      return { min: 200, max: 1000, preferred: 250 };
    default:
      return { min: 0, max: 1000, preferred: 100 };
  }
}
