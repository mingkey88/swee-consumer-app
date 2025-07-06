/**
 * End-to-End Booking Flow Test
 * This script tests the complete booking flow from provider selection to booking confirmation
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBookingFlow() {
  console.log('🧪 Testing Booking Flow...');
  
  try {
    // 1. Test if Bella Beauty Studio exists
    console.log('1. Checking if Bella Beauty Studio exists...');
    const bellaBeauty = await prisma.merchant.findFirst({
      where: { name: 'Bella Beauty Studio' },
      include: {
        services: {
          where: { isActive: true },
          include: { tags: true }
        },
        appointments: {
          include: {
            feedback: true,
            service: true,
            user: { select: { name: true, email: true } }
          }
        }
      }
    });

    if (!bellaBeauty) {
      console.log('❌ Bella Beauty Studio not found in database');
      return;
    }

    console.log('✅ Bella Beauty Studio found:', {
      id: bellaBeauty.id,
      name: bellaBeauty.name,
      services: bellaBeauty.services.length,
      reviews: bellaBeauty.appointments.filter(a => a.feedback).length,
      trustScore: bellaBeauty.trustScore
    });

    // 2. Test API endpoint
    console.log('\n2. Testing API endpoint...');
    const response = await fetch(`http://localhost:3003/api/merchants/${bellaBeauty.id}`);
    
    if (!response.ok) {
      console.log('❌ API endpoint failed:', response.status);
      return;
    }

    const apiData = await response.json();
    console.log('✅ API endpoint working:', {
      name: apiData.name,
      servicesCount: apiData.services?.length || 0,
      reviewsCount: apiData.reviews?.length || 0
    });

    // 3. Test booking creation
    console.log('\n3. Testing booking creation...');
    const testBooking = {
      merchantId: bellaBeauty.id,
      serviceId: bellaBeauty.services[0]?.id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      time: '10:00 AM',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+65 9123 4567',
      notes: 'Test booking for end-to-end testing'
    };

    const bookingResponse = await fetch('http://localhost:3003/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBooking)
    });

    if (!bookingResponse.ok) {
      console.log('❌ Booking creation failed:', bookingResponse.status);
      const errorData = await bookingResponse.json();
      console.log('Error details:', errorData);
      return;
    }

    const bookingData = await bookingResponse.json();
    console.log('✅ Booking created successfully:', {
      id: bookingData.id,
      status: bookingData.status,
      service: bookingData.service?.title
    });

    // 4. Test booking retrieval
    console.log('\n4. Testing booking retrieval...');
    const retrieveResponse = await fetch(`http://localhost:3003/api/bookings?merchantId=${bellaBeauty.id}`);
    
    if (!retrieveResponse.ok) {
      console.log('❌ Booking retrieval failed:', retrieveResponse.status);
      return;
    }

    const bookings = await retrieveResponse.json();
    console.log('✅ Bookings retrieved:', bookings.length, 'bookings found');

    // 5. Clean up test booking
    console.log('\n5. Cleaning up test booking...');
    await prisma.booking.delete({
      where: { id: bookingData.id }
    });
    console.log('✅ Test booking cleaned up');

    console.log('\n🎉 All tests passed! The booking flow is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testBookingFlow();
}

export { testBookingFlow };
