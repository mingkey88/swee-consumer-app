import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateBellaBeautyStudio() {
  console.log('🔄 Updating Bella Beauty Studio with merchant@example.com...')

  try {
    // First, find or create the merchant user
    const merchantOwner = await prisma.user.upsert({
      where: { email: 'merchant@example.com' },
      update: {
        name: 'Bella Chen',
        role: 'MERCHANT',
      },
      create: {
        email: 'merchant@example.com',
        name: 'Bella Chen',
        role: 'MERCHANT',
        points: 0,
      },
    })

    console.log('✅ Merchant user updated/created:', merchantOwner.email)

    // Find the existing Bella Beauty Studio merchant (ID 1)
    const existingMerchant = await prisma.merchant.findUnique({
      where: { id: 1 }
    })

    if (existingMerchant) {
      // Update the existing merchant
      const updatedMerchant = await prisma.merchant.update({
        where: { id: 1 },
        data: {
          name: 'Bella Beauty Studio',
          description: 'Experience the future of beauty and wellness at Bella Beauty Studio. Nestled in the heart of Orchard Road, our cutting-edge facility offers a transformative approach to skincare, hair care, and aesthetic treatments. With state-of-the-art technology and personalized service, our expert team delivers unparalleled care and results. Immerse yourself in a sanctuary where science meets luxury, and let our skilled professionals elevate your beauty journey with precision and innovation. Discover the epitome of aesthetic excellence and redefine your radiance at Bella Beauty Studio.',
          address: '123 Orchard Road, #02-45, Singapore 238858',
          phone: '+65 6123 4567',
          email: 'hello@bellabeauty.com',
          website: 'https://bellabeauty.com',
          ownerId: merchantOwner.id,
          trustScore: 4.8,
        },
      })

      console.log('✅ Bella Beauty Studio updated successfully!')
      console.log('📧 Merchant email:', merchantOwner.email)
      console.log('🏪 Merchant name:', updatedMerchant.name)
      console.log('📍 Address:', updatedMerchant.address)
      console.log('📞 Phone:', updatedMerchant.phone)
      console.log('🌐 Website:', updatedMerchant.website)
      console.log('⭐ Trust Score:', updatedMerchant.trustScore)
    } else {
      console.log('❌ Bella Beauty Studio merchant not found (ID: 1)')
    }

  } catch (error) {
    console.error('❌ Error updating Bella Beauty Studio:', error)
  }
}

async function main() {
  try {
    await updateBellaBeautyStudio()
  } catch (error) {
    console.error('💥 Update failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
