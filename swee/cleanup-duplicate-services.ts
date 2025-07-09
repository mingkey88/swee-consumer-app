import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicateServices() {
  console.log('🧹 Cleaning up duplicate services for Bella Beauty Studio...')

  try {
    // Find Bella Beauty Studio
    const bellaBeautyStudio = await prisma.merchant.findFirst({
      where: { name: 'Bella Beauty Studio' },
      include: { services: true }
    })

    if (!bellaBeautyStudio) {
      console.log('❌ Bella Beauty Studio not found')
      return
    }

    console.log(`📊 Found ${bellaBeautyStudio.services.length} services for Bella Beauty Studio`)

    // Group services by title to find duplicates
    const serviceGroups = bellaBeautyStudio.services.reduce((groups, service) => {
      const key = service.title
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(service)
      return groups
    }, {} as Record<string, any[]>)

    let duplicatesRemoved = 0

    // Remove duplicates, keeping only the first instance of each service
    for (const [title, services] of Object.entries(serviceGroups)) {
      if (services.length > 1) {
        console.log(`🔍 Found ${services.length} duplicates of "${title}"`)
        
        // Keep the first service, delete the rest
        const servicesToDelete = services.slice(1)
        
        for (const service of servicesToDelete) {
          await prisma.service.delete({
            where: { id: service.id }
          })
          duplicatesRemoved++
          console.log(`❌ Deleted duplicate service: "${service.title}" (ID: ${service.id})`)
        }
      }
    }

    console.log(`✅ Cleanup complete! Removed ${duplicatesRemoved} duplicate services`)
    
    // Show remaining services
    const remainingServices = await prisma.service.findMany({
      where: { merchantId: bellaBeautyStudio.id },
      select: { id: true, title: true, price: true }
    })
    
    console.log('\n📋 Remaining services:')
    remainingServices.forEach(service => {
      console.log(`   - ${service.title} ($${(service.price / 100).toFixed(2)})`)
    })

  } catch (error) {
    console.error('❌ Error cleaning up services:', error)
  }
}

async function main() {
  try {
    await cleanupDuplicateServices()
  } catch (error) {
    console.error('💥 Cleanup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
