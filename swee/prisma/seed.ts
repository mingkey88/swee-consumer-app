import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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

  console.log('Creating service tags...');
  for (const tag of serviceTags) {
    await prisma.serviceTag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  // Create sample merchants with trust scores
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
    {
      name: 'City Cuts',
      description: 'Quick and affordable haircuts for everyone',
      address: '321 Tanjong Pagar, Singapore',
      phone: '+65 6567 8901',
      email: 'info@citycuts.sg',
      trustScore: 85.0,
    },
  ];

  console.log('Creating sample merchants...');
  const createdMerchants = [];
  for (const merchant of merchants) {
    // Create a dummy user as owner
    const owner = await prisma.user.upsert({
      where: { email: merchant.email },
      update: {},
      create: {
        email: merchant.email,
        name: merchant.name + ' Owner',
        role: 'MERCHANT',
      },
    });

    const createdMerchant = await prisma.merchant.upsert({
      where: { id: merchants.indexOf(merchant) + 1 },
      update: {},
      create: {
        ...merchant,
        ownerId: owner.id,
      },
    });
    createdMerchants.push(createdMerchant);
  }

  // Create sample services with tags
  const services = [
    {
      name: 'Keratin Hair Treatment',
      description: 'Smoothing treatment for frizzy hair',
      price: 180,
      duration: 120,
      merchantId: 1,
      tags: ['Frizz Control', 'Damage Repair'],
    },
    {
      name: 'Volumizing Hair Cut',
      description: 'Layered cut to add volume to thin hair',
      price: 80,
      duration: 60,
      merchantId: 1,
      tags: ['Volume Boost', 'Hair Thinning'],
    },
    {
      name: 'Deep Cleansing Facial',
      description: 'Purifying facial for acne-prone skin',
      price: 120,
      duration: 90,
      merchantId: 2,
      tags: ['Acne Treatment', 'Blackhead Removal'],
    },
    {
      name: 'Anti-Aging Facial',
      description: 'Premium anti-aging treatment with peptides',
      price: 200,
      duration: 90,
      merchantId: 2,
      tags: ['Anti-Aging', 'Hydration'],
    },
    {
      name: 'Eyebrow Shaping',
      description: 'Professional eyebrow threading and tinting',
      price: 45,
      duration: 30,
      merchantId: 3,
      tags: ['Natural Look', 'Professional'],
    },
    {
      name: 'Lash Extensions',
      description: 'Full set of classic eyelash extensions',
      price: 150,
      duration: 120,
      merchantId: 3,
      tags: ['Bold & Dramatic', 'Trendy Style'],
    },
    {
      name: 'Quick Trim',
      description: 'Basic haircut and styling',
      price: 35,
      duration: 30,
      merchantId: 4,
      tags: ['Classic', 'Minimalist'],
    },
  ];

  console.log('Creating sample services...');
  for (const service of services) {
    const { tags, ...serviceData } = service;
    
    // Get tag IDs
    const serviceTags = await prisma.serviceTag.findMany({
      where: { name: { in: tags } },
    });

    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: {},
      create: {
        ...serviceData,
        tags: {
          connect: serviceTags.map((tag: any) => ({ id: tag.id })),
        },
      },
    });
  }

  // Create a sample user with quiz answers
  const sampleUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Sample User',
      role: 'USER',
      points: 250,
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

  // Create sample bookings
  const bookings = [
    {
      userId: sampleUser.id,
      serviceId: 1,
      merchantId: 1,
      dateTime: new Date('2024-12-20T14:00:00Z'),
      status: 'COMPLETED',
      totalAmount: 180,
      notes: 'First time customer',
    },
    {
      userId: sampleUser.id,
      serviceId: 3,
      merchantId: 2,
      dateTime: new Date('2024-12-15T10:00:00Z'),
      status: 'COMPLETED',
      totalAmount: 120,
      notes: 'Regular customer',
    },
  ];

  console.log('Creating sample bookings...');
  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: bookings.indexOf(booking) + 1 },
      update: {},
      create: {
        ...booking,
        id: (bookings.indexOf(booking) + 1).toString(),
      },
    });
  }

  // Create sample feedback
  const feedback = [
    {
      bookingId: '1',
      rating: 5,
      comment: 'Amazing keratin treatment! My hair is so smooth now.',
      hardSellReported: false,
    },
    {
      bookingId: '2',
      rating: 4,
      comment: 'Good facial, but they tried to upsell me on expensive products.',
      hardSellReported: true,
    },
  ];

  console.log('Creating sample feedback...');
  for (const fb of feedback) {
    await prisma.feedback.upsert({
      where: { bookingId: fb.bookingId },
      update: {},
      create: fb,
    });
  }

  // Create sample points transactions
  const pointsTransactions = [
    {
      userId: sampleUser.id,
      points: 100,
      reason: 'quiz_completed',
      description: 'Completed onboarding quiz',
    },
    {
      userId: sampleUser.id,
      points: 200,
      reason: 'booking_made',
      description: 'Booked keratin treatment',
    },
    {
      userId: sampleUser.id,
      points: 50,
      reason: 'review_left',
      description: 'Left review for hair treatment',
    },
  ];

  console.log('Creating sample points transactions...');
  for (const transaction of pointsTransactions) {
    await prisma.pointsTransaction.create({
      data: transaction,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log(`- ${serviceTags.length} service tags`);
  console.log(`- ${merchants.length} merchants`);
  console.log(`- ${services.length} services`);
  console.log(`- ${bookings.length} bookings`);
  console.log(`- ${feedback.length} feedback entries`);
  console.log(`- ${pointsTransactions.length} points transactions`);
  console.log(`- 1 sample user with quiz data`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
