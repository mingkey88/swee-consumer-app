import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateMerchantToBella() {
  console.log('🔄 Updating merchant ID 1 to Bella Beauty Studio...')
  
  try {
    // Update the merchant with ID 1 to be Bella Beauty Studio
    const updatedMerchant = await prisma.merchant.update({
      where: { id: 1 },
      data: {
        name: 'Bella Beauty Studio',
        description: 'Singapore\'s premier beauty destination offering personalized hair, facial, and aesthetic treatments. Our expert stylists and aestheticians are committed to enhancing your natural beauty with the latest techniques and premium products.',
        address: '123 Orchard Road, #02-45, Singapore 238858',
        phone: '+65 6123 4567',
        email: 'hello@bellabeauty.com',
        website: 'https://bellabeauty.com',
        trustScore: 4.8,
      }
    })
    
    console.log('✅ Successfully updated merchant:', updatedMerchant.name)
    
    // Also update some services to match Bella Beauty
    const updatedServices = await prisma.service.updateMany({
      where: { merchantId: 1 },
      data: {
        merchantId: 1 // Ensure they're linked to merchant 1
      }
    })
    
    console.log('✅ Updated services for merchant')
    
  } catch (error) {
    console.error('❌ Error updating merchant:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateMerchantToBella()
