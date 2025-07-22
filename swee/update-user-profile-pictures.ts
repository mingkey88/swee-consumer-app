import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserProfilePictures() {
  try {
    console.log('🖼️ Adding profile pictures to test users...');
    
    // Professional, high-quality profile pictures from Unsplash
    const userUpdates = [
      {
        email: 'merchant@example.com',
        name: 'Bella Chen',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
        description: 'Professional Asian woman, hair services specialist'
      },
      {
        email: 'jessica.wong@email.com', 
        name: 'Jessica Wong',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
        description: 'Young student, facial treatment enthusiast'
      },
      {
        email: 'sarah.chen@email.com',
        name: 'Sarah Chen', 
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
        description: 'Executive professional, premium services'
      },
      {
        email: 'maria.rodriguez@email.com',
        name: 'Maria Rodriguez',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
        description: 'Creative professional, trendy brows & lashes'
      }
    ];

    for (const userData of userUpdates) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: userData.email }
        });

        if (user) {
          await prisma.user.update({
            where: { email: userData.email },
            data: {
              name: userData.name,
              image: userData.image
            }
          });
          console.log(`✅ Updated ${userData.name} with profile picture`);
        } else {
          console.log(`⚠️  User not found: ${userData.email}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${userData.name}:`, error);
      }
    }

    console.log('\n🎉 Profile pictures updated successfully!');
    console.log('==========================================');
    console.log('👤 Bella Chen - Professional hair specialist');
    console.log('👤 Jessica Wong - Young student, facial treatments');  
    console.log('👤 Sarah Chen - Executive, premium services');
    console.log('👤 Maria Rodriguez - Creative, trendy style');
    console.log('==========================================');
    console.log('\n✨ Now test the updated profiles at http://localhost:3002/auth/signin');

  } catch (error) {
    console.error('❌ Error updating profile pictures:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserProfilePictures();