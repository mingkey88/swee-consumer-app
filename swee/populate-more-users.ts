import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateMoreUsers() {
  try {
    console.log('🔍 Populating additional users with rich data...');
    
    // Update Jessica Wong with different preferences
    const jessicaUser = await prisma.user.findFirst({
      where: { email: 'jessica.wong@email.com' }
    });
    
    if (jessicaUser) {
      await prisma.user.update({
        where: { id: jessicaUser.id },
        data: {
          // Different preferences from Bella
          serviceType: 'Facial Treatments',
          hairConcerns: JSON.stringify([]),
          facialConcerns: JSON.stringify(['Acne', 'Dark Spots', 'Oily Skin']),
          browsLashesStyle: 'Bold',
          budgetRange: '$50-80',
          frequency: 'Bi-weekly',
          lifestyle: 'Student',
          availability: JSON.stringify({
            preferredTimes: ['Evening', 'Afternoon'],
            daysAvailable: ['Tuesday', 'Thursday', 'Friday']
          }),
          hardSellingExperience: 'No, never experienced it',
          hardSellingProtection: 'Somewhat important',
          points: 420 // Gold level
        }
      });
      
      // Add quiz answers for Jessica
      await prisma.quizAnswer.deleteMany({
        where: { userId: jessicaUser.id }
      });
      
      const jessicaQuizAnswers = [
        {
          userId: jessicaUser.id,
          email: jessicaUser.email || '',
          questionId: 'service_type',
          answer: 'Facial Treatments'
        },
        {
          userId: jessicaUser.id,
          email: jessicaUser.email || '',
          questionId: 'facial_concerns',
          answer: 'Acne, Dark Spots, Oily Skin'
        },
        {
          userId: jessicaUser.id,
          email: jessicaUser.email || '',
          questionId: 'budget_range',
          answer: '$50-80'
        },
        {
          userId: jessicaUser.id,
          email: jessicaUser.email || '',
          questionId: 'frequency',
          answer: 'Bi-weekly'
        }
      ];
      
      for (const answer of jessicaQuizAnswers) {
        await prisma.quizAnswer.create({ data: answer });
      }
      
      console.log('✅ Jessica Wong updated with facial treatment preferences');
    }
    
    // Update Sarah Chen with spa preferences  
    const sarahUser = await prisma.user.findFirst({
      where: { email: 'sarah.chen@email.com' }
    });
    
    if (sarahUser) {
      await prisma.user.update({
        where: { id: sarahUser.id },
        data: {
          serviceType: 'Multiple Services',
          hairConcerns: JSON.stringify(['Gray Coverage', 'Thinning']),
          facialConcerns: JSON.stringify(['Anti-aging', 'Fine Lines']),
          browsLashesStyle: 'Defined',
          budgetRange: '$120-200',
          frequency: 'Weekly',
          lifestyle: 'Executive',
          availability: JSON.stringify({
            preferredTimes: ['Morning', 'Lunch'],
            daysAvailable: ['Monday', 'Wednesday', 'Saturday']
          }),
          hardSellingExperience: 'Yes, multiple times',
          hardSellingProtection: 'Extremely important',
          points: 750 // Gold level
        }
      });
      
      // Add quiz answers for Sarah
      await prisma.quizAnswer.deleteMany({
        where: { userId: sarahUser.id }
      });
      
      const sarahQuizAnswers = [
        {
          userId: sarahUser.id,
          email: sarahUser.email || '',
          questionId: 'service_type',
          answer: 'Multiple Services'
        },
        {
          userId: sarahUser.id,
          email: sarahUser.email || '',
          questionId: 'hair_concerns',
          answer: 'Gray Coverage, Thinning'
        },
        {
          userId: sarahUser.id,
          email: sarahUser.email || '',
          questionId: 'facial_concerns',
          answer: 'Anti-aging, Fine Lines'
        },
        {
          userId: sarahUser.id,
          email: sarahUser.email || '',
          questionId: 'budget_range',
          answer: '$120-200'
        }
      ];
      
      for (const answer of sarahQuizAnswers) {
        await prisma.quizAnswer.create({ data: answer });
      }
      
      console.log('✅ Sarah Chen updated with executive spa preferences');
    }
    
    // Update Maria with nail/beauty preferences
    const mariaUser = await prisma.user.findFirst({
      where: { email: 'maria.rodriguez@email.com' }
    });
    
    if (mariaUser) {
      await prisma.user.update({
        where: { id: mariaUser.id },
        data: {
          serviceType: 'Brows & Lashes',
          hairConcerns: JSON.stringify([]),
          facialConcerns: JSON.stringify([]),
          browsLashesStyle: 'Trendy',
          budgetRange: '$30-60',
          frequency: 'Every 3 weeks',
          lifestyle: 'Creative',
          availability: JSON.stringify({
            preferredTimes: ['Afternoon', 'Weekend'],
            daysAvailable: ['Friday', 'Saturday', 'Sunday']
          }),
          hardSellingExperience: 'Occasionally',
          hardSellingProtection: 'Important',
          points: 280 // Silver level
        }
      });
      
      console.log('✅ Maria Rodriguez updated with brows & lashes preferences');
    }
    
    console.log('\n🎉 Multiple test users now have rich data!');
    console.log('==========================================');
    console.log('👤 Bella Chen - Hair Services, Monthly, $80-120 (Professional)');
    console.log('👤 Jessica Wong - Facial Treatments, Bi-weekly, $50-80 (Student)');
    console.log('👤 Sarah Chen - Multiple Services, Weekly, $120-200 (Executive)');
    console.log('👤 Maria Rodriguez - Brows & Lashes, Every 3 weeks, $30-60 (Creative)');
    console.log('==========================================');
    console.log('\n✨ Test different users to see how AI adapts to each profile!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateMoreUsers();