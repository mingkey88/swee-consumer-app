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

    const services = await prisma.service.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Get merchant services error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, description, price, duration, category } = body;

    // Validate required fields
    if (!title || !price || !duration || !category) {
      return NextResponse.json(
        { message: 'Title, price, duration, and category are required' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        description: description || '',
        price: parseInt(price),
        duration: parseInt(duration),
        category,
        merchantId: merchant.id
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
