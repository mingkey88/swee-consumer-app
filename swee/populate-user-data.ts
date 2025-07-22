import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateUserData() {
  try {
    console.log('🔍 Checking existing users...');
    
    // Find Bella Chen user
    const users = await prisma.user.findMany({
      include: {
        bookings: true,
        quizAnswers: true,
        pointsHistory: true
      }
    });
    
    console.log('Found users:', users.map(u => ({ id: u.id, email: u.email, name: u.name, points: u.points })));
    
    // Look for a user that might be Bella Chen (or create sample data)
    let targetUser = users.find(u => u.name?.toLowerCase().includes('bella') || u.email?.toLowerCase().includes('bella'));
    
    if (!targetUser && users.length > 0) {
      // Use the first user as our test user
      targetUser = users[0];
    }
    
    if (!targetUser) {
      console.log('❌ No users found. Please sign up first through the app.');
      return;
    }
    
    console.log(`🎯 Updating user: ${targetUser.name || targetUser.email}`);
    
    // Update user with comprehensive quiz data and attributes
    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        name: targetUser.name || 'Bella Chen',
        
        // Quiz preferences
        serviceType: 'Hair Services',
        hairConcerns: JSON.stringify(['Dryness', 'Frizz', 'Color Damage']),
        facialConcerns: JSON.stringify(['Anti-aging', 'Hydration']),
        browsLashesStyle: 'Natural',
        budgetRange: '$80-120',
        frequency: 'Monthly',
        lifestyle: 'Professional',
        availability: JSON.stringify({
          preferredTimes: ['Morning', 'Weekend'],
          daysAvailable: ['Saturday', 'Sunday', 'Wednesday']
        }),
        
        // Hard-selling protection preferences
        hardSellingExperience: 'Yes, it was uncomfortable',
        hardSellingProtection: 'Very important',
        
        // Award some points if they don't have any
        points: Math.max(targetUser.points, 150) // Ensure at least 150 points (Silver level)
      }
    });
    
    console.log('✅ User updated with quiz preferences');
    
    // Add some quiz answers
    await prisma.quizAnswer.deleteMany({
      where: { userId: targetUser.id }
    });
    
    const quizAnswers = [
      {
        userId: targetUser.id,
        email: targetUser.email || '',
        questionId: 'service_type',
        answer: 'Hair Services'
      },
      {
        userId: targetUser.id,
        email: targetUser.email || '',
        questionId: 'hair_concerns',
        answer: 'Dryness, Frizz, Color Damage'
      },
      {
        userId: targetUser.id,
        email: targetUser.email || '',
        questionId: 'budget_range',
        answer: '$80-120'
      },
      {
        userId: targetUser.id,
        email: targetUser.email || '',
        questionId: 'frequency',
        answer: 'Monthly'
      },
      {
        userId: targetUser.id,
        email: targetUser.email || '',
        questionId: 'lifestyle',
        answer: 'Professional - I need to look polished for work'
      }
    ];
    
    for (const answer of quizAnswers) {
      await prisma.quizAnswer.create({
        data: answer
      });
    }
    
    console.log('✅ Quiz answers added');
    
    // Add some points transactions for variety
    const pointsTransactions = [
      {
        userId: targetUser.id,
        points: 100,
        reason: 'quiz_completed',
        description: 'Completed onboarding quiz'
      },
      {
        userId: targetUser.id,
        points: 200,
        reason: 'booking_made',
        description: 'Booked hair appointment at Bella Beauty Studio'
      },
      {
        userId: targetUser.id,
        points: 50,
        reason: 'review_left',
        description: 'Left review for service'
      }
    ];
    
    for (const transaction of pointsTransactions) {
      // Check if this type of transaction already exists to avoid duplicates
      const existing = await prisma.pointsTransaction.findFirst({
        where: {
          userId: targetUser.id,
          reason: transaction.reason
        }
      });
      
      if (!existing) {
        await prisma.pointsTransaction.create({
          data: transaction
        });
      }
    }
    
    console.log('✅ Points transactions added');
    
    // Create a mock booking if none exists
    const existingBookings = await prisma.booking.findMany({
      where: { userId: targetUser.id }
    });
    
    if (existingBookings.length === 0) {
      console.log('📅 Creating a sample booking...');
      
      // Find Bella Beauty Studio merchant
      const merchant = await prisma.merchant.findFirst({
        where: { name: { contains: 'Bella Beauty' } },
        include: { services: true }
      });
      
      if (merchant && merchant.services.length > 0) {
        const booking = await prisma.booking.create({
          data: {
            userId: targetUser.id,
            serviceId: merchant.services[0].id,
            merchantId: merchant.id,
            datetime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
            status: 'COMPLETED',
            totalAmount: 95.00,
            notes: 'Regular hair cut and color touch-up'
          }
        });
        
        console.log('✅ Sample booking created');
      }
    }
    
    // Final user summary
    const finalUser = await prisma.user.findUnique({
      where: { id: targetUser.id },
      include: {
        bookings: {
          include: {
            service: {
              include: {
                merchant: true
              }
            }
          }
        },
        pointsHistory: true,
        quizAnswers: true
      }
    });
    
    console.log('\n🎉 User data population complete!');
    console.log('==========================================');
    console.log(`👤 Name: ${finalUser?.name}`);
    console.log(`📧 Email: ${finalUser?.email}`);
    console.log(`🎯 Service Type: ${finalUser?.serviceType}`);
    console.log(`💰 Budget: ${finalUser?.budgetRange}`);
    console.log(`📅 Frequency: ${finalUser?.frequency}`);
    console.log(`🏆 Points: ${finalUser?.points}`);
    console.log(`📚 Quiz Answers: ${finalUser?.quizAnswers.length}`);
    console.log(`📝 Bookings: ${finalUser?.bookings.length}`);
    console.log(`💳 Points Transactions: ${finalUser?.pointsHistory.length}`);
    console.log('==========================================');
    
    console.log('\n✨ Now test the AI assistant at http://localhost:3001');
    console.log('Click "Let AI help you decide" to see personalized responses!');
    
  } catch (error) {
    console.error('❌ Error populating user data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateUserData();