import { prisma } from '@/lib/prisma';

// Test to see available models
console.log('Available Prisma models:');
console.log(Object.keys(prisma));

// Try accessing quizAnswer
try {
  console.log('quizAnswer model:', typeof prisma.quizAnswer);
} catch (e) {
  console.log('quizAnswer not available');
}

export {};
