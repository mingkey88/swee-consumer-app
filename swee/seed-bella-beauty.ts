import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function seedBellaBeautyStudio() {
  console.log('🌱 Seeding Bella Beauty Studio...')

  // Create a merchant owner account
  const merchantOwner = await prisma.user.create({
    data: {
      email: 'bella@bellabeauty.com',
      name: 'Bella Chen',
      role: 'MERCHANT',
      points: 0,
    },
  })

  // Create Bella Beauty Studio merchant
  const bellaBeautyStudio = await prisma.merchant.create({
    data: {
      name: 'Bella Beauty Studio',
      description: 'Singapore\'s premier beauty destination offering personalized hair, facial, and aesthetic treatments. Our expert stylists and aestheticians are committed to enhancing your natural beauty with the latest techniques and premium products.',
      address: '123 Orchard Road, #02-45, Singapore 238858',
      phone: '+65 6123 4567',
      email: 'hello@bellabeauty.com',
      website: 'https://bellabeauty.com',
      ownerId: merchantOwner.id,
      trustScore: 4.8,
    },
  })

  // Create service tags for matching
  const serviceTags = await Promise.all([
    // Hair concerns
    prisma.serviceTag.create({ data: { name: 'dry_hair', category: 'hair_concern' } }),
    prisma.serviceTag.create({ data: { name: 'oily_hair', category: 'hair_concern' } }),
    prisma.serviceTag.create({ data: { name: 'damaged_hair', category: 'hair_concern' } }),
    prisma.serviceTag.create({ data: { name: 'thin_hair', category: 'hair_concern' } }),
    prisma.serviceTag.create({ data: { name: 'color_treated', category: 'hair_concern' } }),
    
    // Facial concerns
    prisma.serviceTag.create({ data: { name: 'acne', category: 'facial_concern' } }),
    prisma.serviceTag.create({ data: { name: 'aging', category: 'facial_concern' } }),
    prisma.serviceTag.create({ data: { name: 'pigmentation', category: 'facial_concern' } }),
    prisma.serviceTag.create({ data: { name: 'sensitivity', category: 'facial_concern' } }),
    prisma.serviceTag.create({ data: { name: 'dryness', category: 'facial_concern' } }),
    
    // Style preferences
    prisma.serviceTag.create({ data: { name: 'natural', category: 'style_preference' } }),
    prisma.serviceTag.create({ data: { name: 'bold', category: 'style_preference' } }),
    prisma.serviceTag.create({ data: { name: 'trendy', category: 'style_preference' } }),
    prisma.serviceTag.create({ data: { name: 'classic', category: 'style_preference' } }),
  ])

  // Create comprehensive services for Bella Beauty Studio
  const services = await Promise.all([
    // Hair Services
    prisma.service.create({
      data: {
        title: 'Signature Hair Cut & Style',
        description: 'Personalized haircut and styling service with our senior stylists. Includes consultation, wash, cut, style, and finishing touches.',
        price: 8500, // $85.00
        duration: 90,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'dry_hair' },
            { name: 'damaged_hair' },
            { name: 'trendy' },
            { name: 'classic' },
          ]
        }
      },
    }),
    
    prisma.service.create({
      data: {
        title: 'Premium Hair Coloring',
        description: 'Professional hair coloring service using premium organic dyes. Includes color consultation, application, and post-color treatment.',
        price: 15000, // $150.00
        duration: 180,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'color_treated' },
            { name: 'damaged_hair' },
            { name: 'bold' },
            { name: 'trendy' },
          ]
        }
      },
    }),
    
    prisma.service.create({
      data: {
        title: 'Keratin Hair Treatment',
        description: 'Intensive keratin treatment to repair damaged hair, reduce frizz, and add shine. Perfect for chemically treated or damaged hair.',
        price: 18000, // $180.00
        duration: 150,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'damaged_hair' },
            { name: 'dry_hair' },
            { name: 'color_treated' },
            { name: 'natural' },
          ]
        }
      },
    }),
    
    // Facial Services
    prisma.service.create({
      data: {
        title: 'Hydrating Facial Deluxe',
        description: 'Deep cleansing and hydrating facial treatment with premium skincare products. Includes extraction, mask, and moisturizing treatment.',
        price: 12000, // $120.00
        duration: 75,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'dryness' },
            { name: 'sensitivity' },
            { name: 'aging' },
            { name: 'natural' },
          ]
        }
      },
    }),
    
    prisma.service.create({
      data: {
        title: 'Acne Treatment Facial',
        description: 'Specialized facial treatment for acne-prone skin. Includes deep pore cleansing, extraction, and antibacterial treatment.',
        price: 10000, // $100.00
        duration: 60,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'acne' },
            { name: 'oily_hair' },
            { name: 'sensitivity' },
            { name: 'natural' },
          ]
        }
      },
    }),
    
    prisma.service.create({
      data: {
        title: 'Anti-Aging Facial',
        description: 'Advanced anti-aging facial with peptides and retinol. Includes microdermabrasion, LED therapy, and collagen mask.',
        price: 16000, // $160.00
        duration: 90,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'aging' },
            { name: 'pigmentation' },
            { name: 'dryness' },
            { name: 'bold' },
          ]
        }
      },
    }),
    
    // Brow & Lash Services
    prisma.service.create({
      data: {
        title: 'Eyebrow Shaping & Tinting',
        description: 'Professional eyebrow shaping and tinting service. Includes consultation, threading/waxing, and semi-permanent tinting.',
        price: 6500, // $65.00
        duration: 45,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'natural' },
            { name: 'bold' },
            { name: 'trendy' },
          ]
        }
      },
    }),
    
    prisma.service.create({
      data: {
        title: 'Eyelash Extensions',
        description: 'Premium eyelash extension service with individual lash application. Choice of natural, volume, or mega volume styles.',
        price: 12000, // $120.00
        duration: 120,
        category: 'BEAUTY',
        merchantId: bellaBeautyStudio.id,
        tags: {
          connect: [
            { name: 'natural' },
            { name: 'bold' },
            { name: 'trendy' },
          ]
        }
      },
    }),
  ])

  // Create some sample customers
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah.chen@email.com',
        name: 'Sarah Chen',
        role: 'USER',
        points: 150,
        serviceType: 'Hair Services',
        hairConcerns: JSON.stringify(['dry_hair', 'damaged_hair']),
        budgetRange: '$100-200',
        frequency: 'Monthly',
        lifestyle: 'Professional',
        hardSellingProtection: 'Very Important',
      },
    }),
    
    prisma.user.create({
      data: {
        email: 'maria.rodriguez@email.com',
        name: 'Maria Rodriguez',
        role: 'USER',
        points: 220,
        serviceType: 'Facial Treatments',
        facialConcerns: JSON.stringify(['acne', 'oily_hair']),
        budgetRange: '$50-100',
        frequency: 'Bi-weekly',
        lifestyle: 'Active',
        hardSellingProtection: 'Important',
      },
    }),
    
    prisma.user.create({
      data: {
        email: 'jessica.wong@email.com',
        name: 'Jessica Wong',
        role: 'USER',
        points: 350,
        serviceType: 'Brows & Lashes',
        browsLashesStyle: 'Bold',
        budgetRange: '$50-100',
        frequency: 'Monthly',
        lifestyle: 'Trendy',
        hardSellingProtection: 'Somewhat Important',
      },
    }),
  ])

  // Create sample bookings with different statuses
  const bookings = await Promise.all([
    // Completed booking with feedback
    prisma.booking.create({
      data: {
        datetime: new Date('2024-12-15T14:00:00'),
        status: 'COMPLETED',
        notes: 'First time customer, prefers natural look',
        totalAmount: 85.00,
        userId: customers[0].id,
        serviceId: services[0].id,
        merchantId: bellaBeautyStudio.id,
      },
    }),
    
    // Confirmed upcoming booking
    prisma.booking.create({
      data: {
        datetime: new Date('2025-01-15T10:00:00'),
        status: 'CONFIRMED',
        notes: 'Regular customer, usual acne treatment',
        totalAmount: 100.00,
        userId: customers[1].id,
        serviceId: services[4].id,
        merchantId: bellaBeautyStudio.id,
      },
    }),
    
    // Pending booking
    prisma.booking.create({
      data: {
        datetime: new Date('2025-01-20T16:00:00'),
        status: 'PENDING',
        notes: 'Wants bold lash extension style',
        totalAmount: 120.00,
        userId: customers[2].id,
        serviceId: services[7].id,
        merchantId: bellaBeautyStudio.id,
      },
    }),
  ])

  // Create feedback for completed bookings
  await prisma.feedback.create({
    data: {
      rating: 5,
      comment: 'Amazing service! Bella really understood what I wanted and delivered perfectly. The salon has a great atmosphere and I felt very comfortable throughout the treatment.',
      hardSellReported: false,
      bookingId: bookings[0].id,
    },
  })

  // Create some points transactions
  await Promise.all([
    prisma.pointsTransaction.create({
      data: {
        userId: customers[0].id,
        points: 50,
        reason: 'quiz_completed',
        description: 'Completed beauty preference quiz',
      },
    }),
    
    prisma.pointsTransaction.create({
      data: {
        userId: customers[0].id,
        points: 85,
        reason: 'booking_completed',
        description: 'Completed booking at Bella Beauty Studio',
      },
    }),
    
    prisma.pointsTransaction.create({
      data: {
        userId: customers[0].id,
        points: 15,
        reason: 'review_left',
        description: 'Left detailed review',
      },
    }),
  ])

  console.log('✅ Bella Beauty Studio seeded successfully!')
  console.log(`📍 Merchant: ${bellaBeautyStudio.name}`)
  console.log(`👤 Owner: ${merchantOwner.name} (${merchantOwner.email})`)
  console.log(`🛍️ Services: ${services.length} services created`)
  console.log(`👥 Customers: ${customers.length} sample customers`)
  console.log(`📅 Bookings: ${bookings.length} sample bookings`)
  console.log(`⭐ Reviews: 1 sample review`)
  
  return {
    merchant: bellaBeautyStudio,
    owner: merchantOwner,
    services,
    customers,
    bookings,
  }
}

async function main() {
  try {
    await seedBellaBeautyStudio()
  } catch (error) {
    console.error('❌ Error seeding Bella Beauty Studio:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('🎉 Seeding completed successfully!')
    })
    .catch((e) => {
      console.error('💥 Seeding failed:', e)
      process.exit(1)
    })
}

export default seedBellaBeautyStudio
