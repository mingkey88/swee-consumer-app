import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = await params;
    const serviceId = parseInt(id);
    const body = await request.json();
    const { title, description, price, duration, category, isActive } = body;

    // Verify service belongs to merchant
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        merchantId: merchant.id
      }
    });

    if (!existingService) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        title,
        description,
        price: typeof price === 'number' ? price : parseInt(price),
        duration: typeof duration === 'number' ? duration : parseInt(duration),
        category,
        isActive
      }
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = await params;
    const serviceId = parseInt(id);

    // Verify service belongs to merchant
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        merchantId: merchant.id
      }
    });

    if (!existingService) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id: serviceId }
    });

    return NextResponse.json(
      { message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
