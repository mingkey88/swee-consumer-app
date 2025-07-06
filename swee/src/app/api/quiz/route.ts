import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Quiz questions data - Swee's Intelligent Onboarding
const QUIZ_QUESTIONS = [
  {
    id: 'service_type',
    question: 'What services are you most interested in?',
    type: 'single',
    options: [
      'Hair Services',
      'Facial Treatments', 
      'Brows & Lashes',
      'Multiple Services'
    ]
  },
  // Dynamic questions based on service type selection
  {
    id: 'hair_concerns',
    question: 'What are your main hair concerns?',
    type: 'multiple',
    condition: 'service_type:Hair Services,Multiple Services',
    options: [
      'Frizz & Unmanageability',
      'Hair Thinning & Loss',
      'Dryness & Damage',
      'Oily Scalp',
      'Split Ends',
      'Lack of Volume',
      'Color Fading',
      'Dandruff & Scalp Issues'
    ]
  },
  {
    id: 'facial_concerns',
    question: 'What are your main skin concerns?',
    type: 'multiple',
    condition: 'service_type:Facial Treatments,Multiple Services',
    options: [
      'Acne & Breakouts',
      'Pigmentation & Dark Spots',
      'Dehydration & Dryness',
      'Fine Lines & Aging',
      'Large Pores',
      'Sensitive Skin',
      'Blackheads & Whiteheads',
      'Dull & Uneven Skin Tone'
    ]
  },
  {
    id: 'brows_lashes_style',
    question: 'What look do you prefer for brows & lashes?',
    type: 'single',
    condition: 'service_type:Brows & Lashes,Multiple Services',
    options: [
      'Natural & Subtle',
      'Defined & Structured',
      'Bold & Dramatic',
      'Trendy & Experimental'
    ]
  },
  {
    id: 'budget_range',
    question: 'What\'s your typical budget per visit?',
    type: 'single',
    options: [
      'Under $50',
      '$50 - $100',
      '$100 - $150',
      '$150 - $200',
      'Above $200'
    ]
  },
  {
    id: 'frequency',
    question: 'How often do you book beauty services?',
    type: 'single',
    options: [
      'Weekly',
      'Bi-weekly',
      'Monthly',
      'Quarterly',
      'Rarely (special occasions)'
    ]
  },
  {
    id: 'lifestyle',
    question: 'Which describes your lifestyle best?',
    type: 'single',
    options: [
      'Busy professional - need quick, efficient services',
      'Self-care enthusiast - enjoy longer, relaxing treatments',
      'Student/Budget-conscious - looking for value',
      'Special occasion focused - want premium results',
      'Maintenance routine - regular touch-ups'
    ]
  },
  {
    id: 'hardselling_experience',
    question: 'Have you ever experienced unwanted sales pressure during beauty treatments?',
    type: 'single',
    options: [
      'Yes, frequently - it really bothers me',
      'Yes, occasionally - somewhat annoying',
      'Rarely, but I\'d prefer to avoid it',
      'Never experienced this',
      'I don\'t mind if the products are good'
    ]
  },
  {
    id: 'hardselling_protection',
    question: 'How important is it to you that we protect against hard-selling?',
    type: 'single',
    options: [
      'Extremely important - it\'s a deal-breaker for me',
      'Very important - I value transparent pricing',
      'Somewhat important - nice to have protection',
      'Not very important - I can handle sales pitches',
      'Not important at all'
    ]
  },
  {
    id: 'availability',
    question: 'When do you prefer appointments?',
    type: 'multiple',
    options: [
      'Weekday mornings',
      'Weekday afternoons',
      'Weekday evenings',
      'Weekend mornings',
      'Weekend afternoons',
      'Weekend evenings'
    ]
  }
];

// Validation schema for quiz answers
const quizAnswerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())]))
});

// GET: Return quiz questions
export async function GET() {
  try {
    return NextResponse.json({
      questions: QUIZ_QUESTIONS,
      success: true
    });
  } catch (error) {
    console.error('Quiz questions error:', error);
    return NextResponse.json(
      { error: 'Failed to load quiz questions', success: false },
      { status: 500 }
    );
  }
}

// POST: Save quiz answers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = quizAnswerSchema.parse(body);
    const { email, answers } = validatedData;

    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    // Save quiz answers to database
    const answerEntries = Object.entries(answers);
    const savedAnswers = [];
    
    for (const [questionId, answer] of answerEntries) {
      const savedAnswer = await prisma.quizAnswer.create({
        data: {
          email,
          questionId,
          answer: Array.isArray(answer) ? answer.join(', ') : answer,
          aiSummary: generateSimpleAISummary(questionId, answer),
          userId: session?.user?.id || null,
        }
      });
      savedAnswers.push(savedAnswer);
    }

    // If user is authenticated, update their profile with quiz answers
    if (session?.user?.id) {
      const userProfile = generateUserProfile(answers);
      
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          serviceType: answers.service_type as string,
          hairConcerns: answers.hair_concerns ? JSON.stringify(answers.hair_concerns) : undefined,
          facialConcerns: answers.facial_concerns ? JSON.stringify(answers.facial_concerns) : undefined,
          browsLashesStyle: answers.brows_lashes_style as string,
          budgetRange: answers.budget_range as string,
          frequency: answers.frequency as string,
          lifestyle: answers.lifestyle as string,
          availability: answers.availability ? JSON.stringify(answers.availability) : undefined,
          hardSellingExperience: answers.hardselling_experience as string,
          hardSellingProtection: answers.hardselling_protection as string,
          points: {
            increment: 100 // Award 100 points for completing quiz
          }
        }
      });

      // Create points transaction record
      await prisma.pointsTransaction.create({
        data: {
          userId: session.user.id,
          points: 100,
          reason: 'quiz_completed',
          description: 'Completed onboarding quiz'
        }
      });
    }

    return NextResponse.json({
      message: 'Quiz answers saved successfully',
      success: true,
      answersCount: savedAnswers.length,
      pointsAwarded: session?.user?.id ? 100 : 0
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid quiz data', 
          details: error.errors,
          success: false 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save quiz answers', success: false },
      { status: 500 }
    );
  }
}

// Simple AI summary generator (placeholder for future AI integration)
function generateSimpleAISummary(questionId: string, answer: string | string[]): string {
  const answerText = Array.isArray(answer) ? answer.join(', ') : answer;
  
  switch (questionId) {
    case 'service_type':
      return `Interested in: ${answerText}`;
    case 'hair_concerns':
      return `Hair concerns: ${answerText}`;
    case 'facial_concerns':
      return `Facial concerns: ${answerText}`;
    case 'brows_lashes_style':
      return `Brows & lashes style: ${answerText}`;
    case 'budget_range':
      return `Budget range: ${answerText}`;
    case 'frequency':
      return `Service frequency: ${answerText}`;
    case 'lifestyle':
      return `Lifestyle: ${answerText}`;
    case 'availability':
      return `Availability: ${answerText}`;
    case 'hardselling_experience':
      return `Hard-selling experience: ${answerText}`;
    case 'hardselling_protection':
      return `Hard-selling protection importance: ${answerText}`;
    default:
      return `User response: ${answerText}`;
  }
}

// Generate a comprehensive user profile from quiz answers
function generateUserProfile(answers: Record<string, string | string[]>) {
  const profile = {
    serviceType: answers.service_type || 'Not specified',
    hairConcerns: answers.hair_concerns || [],
    facialConcerns: answers.facial_concerns || [],
    browsLashesStyle: answers.brows_lashes_style || 'Not specified',
    budgetRange: answers.budget_range || 'Not specified',
    frequency: answers.frequency || 'Not specified',
    lifestyle: answers.lifestyle || 'Not specified',
    availability: answers.availability || [],
    hardSellingExperience: answers.hardselling_experience || 'Not specified',
    hardSellingProtection: answers.hardselling_protection || 'Not specified',
    userType: 'Unknown',
    recommendedFeatures: [] as string[]
  };

  // Determine user type based on answers
  const budget = answers.budget_range as string;
  const frequency = answers.frequency as string;
  const lifestyle = answers.lifestyle as string;
  const hardSellingExp = answers.hardselling_experience as string;
  const hardSellingProt = answers.hardselling_protection as string;

  // Add hard-selling protection recommendations
  if (hardSellingExp?.includes('frequently') || hardSellingProt?.includes('Extremely important')) {
    profile.recommendedFeatures.push('Maximum hard-selling protection', 'Verified no-pressure providers');
  } else if (hardSellingExp?.includes('occasionally') || hardSellingProt?.includes('Very important')) {
    profile.recommendedFeatures.push('Enhanced protection features', 'Transparent pricing guarantee');
  }

  if (budget?.includes('Above $200') || lifestyle?.includes('premium')) {
    profile.userType = 'Premium User';
    profile.recommendedFeatures.push('Premium providers', 'Quality guarantees');
  } else if (budget?.includes('Under $50') || lifestyle?.includes('Budget-conscious')) {
    profile.userType = 'Budget-conscious User';
    profile.recommendedFeatures.push('Deal notifications', 'Price comparisons');
  } else if (frequency === 'Weekly' || frequency === 'Bi-weekly') {
    profile.userType = 'Frequent User';
    profile.recommendedFeatures.push('Loyalty program', 'Quick rebooking');
  } else {
    profile.userType = 'Casual User';
    profile.recommendedFeatures.push('Easy discovery', 'Flexible booking');
  }

  return profile;
}
