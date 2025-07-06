import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting data population...');

    // Create service tags for better matching
    const serviceTags = [
      // Hair concerns
      { name: 'Frizz Control', category: 'hair_concern' },
      { name: 'Hair Thinning', category: 'hair_concern' },
      { name: 'Damage Repair', category: 'hair_concern' },
      { name: 'Oily Scalp', category: 'hair_concern' },
      { name: 'Split Ends', category: 'hair_concern' },
      { name: 'Volume Boost', category: 'hair_concern' },
      { name: 'Color Protection', category: 'hair_concern' },
      { name: 'Dandruff Treatment', category: 'hair_concern' },
      
      // Facial concerns
      { name: 'Acne Treatment', category: 'facial_concern' },
      { name: 'Pigmentation', category: 'facial_concern' },
      { name: 'Hydration', category: 'facial_concern' },
      { name: 'Anti-Aging', category: 'facial_concern' },
      { name: 'Pore Minimizing', category: 'facial_concern' },
      { name: 'Sensitive Skin', category: 'facial_concern' },
      { name: 'Blackhead Removal', category: 'facial_concern' },
      { name: 'Brightening', category: 'facial_concern' },
      
      // Style preferences
      { name: 'Natural Look', category: 'style_preference' },
      { name: 'Trendy Style', category: 'style_preference' },
      { name: 'Professional', category: 'style_preference' },
      { name: 'Bold & Dramatic', category: 'style_preference' },
      { name: 'Minimalist', category: 'style_preference' },
      { name: 'Classic', category: 'style_preference' },
    ];

    // Create service tags
    const createdTags = [];
    for (const tag of serviceTags) {
      const created = await prisma.serviceTag.upsert({
        where: { name: tag.name },
        update: {},
        create: tag,
      });
      createdTags.push(created);
    }

    // Create sample merchants
    const merchants = [
      {
        name: 'The Hair Studio',
        description: 'Premium hair salon specializing in color and cuts',
        address: '123 Orchard Road, Singapore',
        phone: '+65 6234 5678',
        email: 'info@hairstudio.sg',
        trustScore: 95.0,
      },
      {
        name: 'Glow Facial Spa',
        description: 'Luxury facial treatments and skincare',
        address: '456 Marina Bay, Singapore',
        phone: '+65 6345 6789',
        email: 'hello@glowspa.sg',
        trustScore: 92.0,
      },
      {
        name: 'Brow & Lash Bar',
        description: 'Expert eyebrow shaping and eyelash extensions',
        address: '789 Bugis Street, Singapore',
        phone: '+65 6456 7890',
        email: 'book@browlashbar.sg',
        trustScore: 88.0,
      },
    ];

    // Create merchants with owners
    const createdMerchants = [];
    for (const merchant of merchants) {
      // Create owner user
      const owner = await prisma.user.upsert({
        where: { email: merchant.email },
        update: {},
        create: {
          email: merchant.email,
          name: merchant.name + ' Owner',
          role: 'MERCHANT',
        },
      });

      const createdMerchant = await prisma.merchant.create({
        data: {
          ...merchant,
          ownerId: owner.id,
        },
      });
      createdMerchants.push(createdMerchant);
    }

    // Create sample services with tags
    const services = [
      {
        title: 'Keratin Hair Treatment',
        description: 'Smoothing treatment for frizzy hair',
        price: 18000, // Convert to cents
        duration: 120,
        category: Category.BEAUTY,
        merchantId: createdMerchants[0].id,
        tags: ['Frizz Control', 'Damage Repair'],
      },
      {
        title: 'Volumizing Hair Cut',
        description: 'Layered cut to add volume to thin hair',
        price: 8000, // Convert to cents
        duration: 60,
        category: Category.BEAUTY,
        merchantId: createdMerchants[0].id,
        tags: ['Volume Boost', 'Hair Thinning'],
      },
      {
        title: 'Deep Cleansing Facial',
        description: 'Purifying facial for acne-prone skin',
        price: 12000, // Convert to cents
        duration: 90,
        category: Category.BEAUTY,
        merchantId: createdMerchants[1].id,
        tags: ['Acne Treatment', 'Blackhead Removal'],
      },
      {
        title: 'Anti-Aging Facial',
        description: 'Premium anti-aging treatment with peptides',
        price: 20000, // Convert to cents
        duration: 90,
        category: Category.BEAUTY,
        merchantId: createdMerchants[1].id,
        tags: ['Anti-Aging', 'Hydration'],
      },
      {
        title: 'Eyebrow Shaping',
        description: 'Professional eyebrow threading and tinting',
        price: 4500, // Convert to cents
        duration: 30,
        category: Category.BEAUTY,
        merchantId: createdMerchants[2].id,
        tags: ['Natural Look', 'Professional'],
      },
      {
        title: 'Lash Extensions',
        description: 'Full set of classic eyelash extensions',
        price: 15000, // Convert to cents
        duration: 120,
        category: Category.BEAUTY,
        merchantId: createdMerchants[2].id,
        tags: ['Bold & Dramatic', 'Trendy Style'],
      },
    ];

    // Create services with tag connections
    const createdServices = [];
    for (const service of services) {
      const { tags, ...serviceData } = service;
      
      // Get tag IDs
      const serviceTags = await prisma.serviceTag.findMany({
        where: { name: { in: tags } },
      });

      const createdService = await prisma.service.create({
        data: {
          ...serviceData,
          tags: {
            connect: serviceTags.map((tag: any) => ({ id: tag.id })),
          },
        },
      });
      createdServices.push(createdService);
    }

    // Create a sample user with quiz answers
    const sampleUser = await prisma.user.upsert({
      where: { email: 'demo@swee.com' },
      update: {},
      create: {
        email: 'demo@swee.com',
        name: 'Demo User',
        role: 'USER',
        points: 350,
        serviceType: 'Multiple Services',
        hairConcerns: JSON.stringify(['Frizz & Unmanageability', 'Dryness & Damage']),
        facialConcerns: JSON.stringify(['Acne & Breakouts', 'Dehydration & Dryness']),
        browsLashesStyle: 'Natural',
        budgetRange: 'Medium ($50-150)',
        frequency: 'Monthly',
        lifestyle: 'Professional',
        availability: JSON.stringify(['Weekday Evenings', 'Weekend Mornings']),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Sample data populated successfully!',
      data: {
        serviceTags: createdTags.length,
        merchants: createdMerchants.length,
        services: createdServices.length,
        sampleUser: sampleUser.name,
      },
    });

  } catch (error) {
    console.error('Error populating data:', error);
    return NextResponse.json(
      { error: 'Failed to populate data' },
      { status: 500 }
    );
  }
}
