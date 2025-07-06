import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedMerchantData() {
  try {
    console.log('🌱 Seeding merchant data...');

    // Create a demo merchant user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const merchantUser = await prisma.user.upsert({
      where: { email: 'merchant@example.com' },
      update: {},
      create: {
        email: 'merchant@example.com',
        name: 'Bella\'s Beauty Studio',
        role: 'MERCHANT',
      },
    });

    // Create merchant profile
    const merchant = await prisma.merchant.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Bella\'s Beauty Studio',
        description: 'Professional beauty services with a focus on natural, healthy treatments. We believe in enhancing your natural beauty without pressure or upselling.',
        address: '123 Orchard Road, Singapore 238838',
        phone: '+65 9123 4567',
        email: 'merchant@example.com',
        website: 'https://bellasbeauty.sg',
        ownerId: merchantUser.id,
        trustScore: 4.8,
      },
    });

    // Create sample services
    const services = [
      {
        title: 'Hair Cut & Style',
        description: 'Professional hair cutting and styling service. Includes consultation, wash, cut, and blow dry.',
        price: 8500, // $85.00 in cents
        duration: 90,
        category: 'BEAUTY' as const,
        merchantId: merchant.id,
      },
      {
        title: 'Facial Treatment',
        description: 'Deep cleansing facial with organic products. Includes extraction, mask, and moisturizing.',
        price: 12000, // $120.00 in cents
        duration: 60,
        category: 'BEAUTY' as const,
        merchantId: merchant.id,
      },
      {
        title: 'Manicure & Pedicure',
        description: 'Complete nail care service including cuticle care, shaping, and polish application.',
        price: 4500, // $45.00 in cents
        duration: 45,
        category: 'BEAUTY' as const,
        merchantId: merchant.id,
      },
      {
        title: 'Massage Therapy',
        description: 'Relaxing full-body massage to relieve stress and muscle tension.',
        price: 9000, // $90.00 in cents
        duration: 60,
        category: 'WELLNESS' as const,
        merchantId: merchant.id,
      },
    ];

    for (const service of services) {
      await prisma.service.create({
        data: service,
      });
    }

    // Create a sample customer
    const customer = await prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        name: 'Sarah Chen',
        role: 'USER',
      },
    });

    // Create sample bookings
    const bookings = [
      {
        id: 'booking-1',
        datetime: new Date('2024-01-15T14:00:00'),
        status: 'COMPLETED' as const,
        notes: 'First time customer, prefers natural styling',
        totalAmount: 8500,
        userId: customer.id,
        serviceId: 1,
        merchantId: merchant.id,
      },
      {
        id: 'booking-2',
        datetime: new Date('2024-01-20T10:00:00'),
        status: 'CONFIRMED' as const,
        notes: 'Regular customer, sensitive skin',
        totalAmount: 12000,
        userId: customer.id,
        serviceId: 2,
        merchantId: merchant.id,
      },
      {
        id: 'booking-3',
        datetime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'PENDING' as const,
        notes: 'New customer, gel polish requested',
        totalAmount: 4500,
        userId: customer.id,
        serviceId: 3,
        merchantId: merchant.id,
      },
    ];

    for (const booking of bookings) {
      await prisma.booking.upsert({
        where: { id: booking.id },
        update: {},
        create: booking,
      });
    }

    // Create sample payments
    const payments = [
      {
        id: 'payment-1',
        bookingId: 'booking-1',
        amount: 8500,
        status: 'RELEASED' as const,
        paymentMethod: 'stripe',
        releasedAt: new Date(),
      },
      {
        id: 'payment-2',
        bookingId: 'booking-2',
        amount: 12000,
        status: 'PENDING' as const,
        paymentMethod: 'stripe',
      },
      {
        id: 'payment-3',
        bookingId: 'booking-3',
        amount: 4500,
        status: 'PENDING' as const,
        paymentMethod: 'paynow',
      },
    ];

    for (const payment of payments) {
      await prisma.pendingPayment.upsert({
        where: { id: payment.id },
        update: {},
        create: payment,
      });
    }

    console.log('✅ Merchant data seeded successfully!');
    console.log('Demo merchant login: merchant@example.com / password123');
    console.log('Visit: http://localhost:3001/merchant/auth/signin');

  } catch (error) {
    console.error('Error seeding merchant data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMerchantData();
