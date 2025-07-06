import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, email, password, phone, address, description, website } = body;

    // Validate required fields
    if (!businessName || !email || !password) {
      return NextResponse.json(
        { message: 'Business name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with MERCHANT role
    const user = await prisma.user.create({
      data: {
        email,
        name: businessName,
        role: 'MERCHANT',
        // Note: In a real app, you'd want to implement email verification
        // For now, we'll set the user as verified
      }
    });

    // Create merchant profile
    const merchant = await prisma.merchant.create({
      data: {
        name: businessName,
        description: description || '',
        address: address || '',
        phone: phone || '',
        email: email,
        website: website || '',
        ownerId: user.id
      }
    });

    return NextResponse.json({
      message: 'Merchant account created successfully',
      merchantId: merchant.id,
      userId: user.id
    }, { status: 201 });

  } catch (error) {
    console.error('Merchant registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
