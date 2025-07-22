import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface UserContext {
  // Basic Info
  id: string;
  name: string;
  email: string;
  
  // Quiz Preferences
  serviceType?: string;
  hairConcerns?: string[];
  facialConcerns?: string[];
  browsLashesStyle?: string;
  budgetRange?: string;
  frequency?: string;
  lifestyle?: string;
  availability?: any;
  
  // Booking History
  totalBookings: number;
  averageSpending: number;
  preferredMerchants: string[];
  lastBookingDate?: Date;
  mostBookedCategory?: string;
  
  // Trust & Safety
  hardSellingExperience?: string;
  hardSellingProtection?: string;
  trustReportsSubmitted: number;
  
  // Gamification
  totalPoints: number;
  currentLevel: string;
  pointsToNextLevel: number;
  
  // Recent Activity
  recentSearches?: string[];
  viewedProviders?: string[];
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface BookingAction {
  type: 'search_services' | 'get_availability' | 'make_suggestion' | 'explain_trust_score';
  parameters: Record<string, any>;
}

export class SweeAIAssistant {
  private systemPrompt: string;
  
  constructor() {
    this.systemPrompt = `You are Swee's AI Beauty Assistant, a helpful and knowledgeable booking manager for a trust-first beauty platform. Your role is to help users find and book beauty services while prioritizing their safety and preferences.

Key Principles:
1. **Trust First**: Always prioritize high trust score merchants (90+) and explain trust scores when relevant
2. **Personalized**: Use the user's quiz preferences, booking history, and patterns to make tailored suggestions
3. **Anti-Hard-Selling**: Warn users about low trust scores and explain Swee's protection mechanisms
4. **Budget Conscious**: Respect the user's budget preferences and spending patterns
5. **Gamification Aware**: Mention points, rewards, and levels when relevant

Available Functions:
- search_services(category, budget, location, preferences)
- get_merchant_info(merchantId)
- check_availability(merchantId, serviceId, dateRange)
- get_trust_score_explanation(merchantId)
- award_points(userId, reason, amount)

Response Style:
- Friendly and conversational, like a knowledgeable friend
- Use emojis sparingly but appropriately
- Be specific about recommendations (use actual data from context)
- Always explain WHY you're making a suggestion
- Proactively suggest bookings based on user patterns

Remember: You have access to the user's complete profile, preferences, and booking history. Use this information to provide intelligent, contextual assistance.`;
  }

  async generateResponse(
    userContext: UserContext,
    conversationHistory: AIMessage[],
    userMessage: string
  ): Promise<{ response: string; suggestedActions?: BookingAction[] }> {
    try {
      // Build context-aware messages
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `${this.systemPrompt}

USER CONTEXT:
- Name: ${userContext.name}
- Service Preferences: ${userContext.serviceType || 'Not specified'}
- Hair Concerns: ${userContext.hairConcerns?.join(', ') || 'None specified'}
- Facial Concerns: ${userContext.facialConcerns?.join(', ') || 'None specified'}
- Budget Range: ${userContext.budgetRange || 'Not specified'}
- Booking Frequency: ${userContext.frequency || 'Not specified'}
- Total Bookings: ${userContext.totalBookings}
- Average Spending: $${userContext.averageSpending || 0}
- Last Booking: ${userContext.lastBookingDate ? new Date(userContext.lastBookingDate).toLocaleDateString() : 'Never'}
- Preferred Merchants: ${userContext.preferredMerchants.join(', ') || 'None yet'}
- Current Points: ${userContext.totalPoints} (Level: ${userContext.currentLevel})
- Trust Reports Submitted: ${userContext.trustReportsSubmitted}

Use this context to provide personalized, relevant assistance. Reference specific preferences and patterns when making recommendations.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';

      // Analyze response for suggested actions
      const suggestedActions = this.extractSuggestedActions(response, userContext);

      return {
        response,
        suggestedActions
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback to context-aware response
      return {
        response: this.generateFallbackResponse(userContext, userMessage)
      };
    }
  }

  private extractSuggestedActions(response: string, userContext: UserContext): BookingAction[] {
    const actions: BookingAction[] = [];
    
    // Look for booking-related keywords in the response
    if (response.toLowerCase().includes('search') || response.toLowerCase().includes('find')) {
      actions.push({
        type: 'search_services',
        parameters: {
          category: userContext.serviceType,
          budget: userContext.budgetRange,
          preferences: {
            hairConcerns: userContext.hairConcerns,
            facialConcerns: userContext.facialConcerns
          }
        }
      });
    }
    
    if (response.toLowerCase().includes('trust score')) {
      actions.push({
        type: 'explain_trust_score',
        parameters: {}
      });
    }
    
    return actions;
  }

  private generateFallbackResponse(userContext: UserContext, userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Personalized fallback responses based on user context
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
      if (userContext.preferredMerchants.length > 0) {
        return `I'd be happy to help you book an appointment! Based on your history, you frequently visit ${userContext.preferredMerchants[0]}. Would you like me to check their availability, or are you looking to try somewhere new?`;
      } else {
        return `Let me help you find the perfect appointment! Based on your preferences for ${userContext.serviceType || 'beauty services'}, I can suggest some highly-rated providers with excellent trust scores.`;
      }
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return `Based on your preferences and ${userContext.totalBookings} previous bookings, I'd recommend looking for providers that match your ${userContext.budgetRange} budget and specialize in ${userContext.serviceType}. Would you like me to show you some options?`;
    }
    
    if (lowerMessage.includes('points') || lowerMessage.includes('rewards')) {
      return `You currently have ${userContext.totalPoints} points and you're at ${userContext.currentLevel} level! ${userContext.pointsToNextLevel > 0 ? `You're ${userContext.pointsToNextLevel} points away from the next level.` : ''} Would you like to know how you can earn more points?`;
    }
    
    // Generic personalized response
    return `Hi ${userContext.name}! I'm here to help you with your beauty bookings. With ${userContext.totalBookings} bookings under your belt and your preferences for ${userContext.serviceType}, I can help you find the perfect service. What would you like to book today?`;
  }

  async generateProactiveSuggestions(userContext: UserContext): Promise<string[]> {
    const suggestions: string[] = [];
    
    try {
      // Check if user is due for a booking based on their frequency
      if (userContext.lastBookingDate && userContext.frequency) {
        const daysSinceLastBooking = Math.floor(
          (Date.now() - new Date(userContext.lastBookingDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        let expectedDays = 30; // Default
        if (userContext.frequency.toLowerCase().includes('weekly')) expectedDays = 7;
        else if (userContext.frequency.toLowerCase().includes('bi-weekly')) expectedDays = 14;
        else if (userContext.frequency.toLowerCase().includes('monthly')) expectedDays = 30;
        else if (userContext.frequency.toLowerCase().includes('quarterly')) expectedDays = 90;
        
        if (daysSinceLastBooking >= expectedDays - 3) { // 3 days before due
          suggestions.push(`It's been ${daysSinceLastBooking} days since your last ${userContext.mostBookedCategory} appointment. Would you like me to check availability at ${userContext.preferredMerchants[0] || 'your favorite places'}?`);
        }
      }
      
      // Points-based suggestions
      if (userContext.pointsToNextLevel <= 100) {
        suggestions.push(`You're only ${userContext.pointsToNextLevel} points away from the next level! Booking an appointment would earn you 200 points.`);
      }
      
      // Trust score updates (if we had this data)
      // suggestions.push("Good news! Your favorite salon just improved their trust score to 95%. Perfect time for your next appointment!");
      
    } catch (error) {
      console.error('Error generating proactive suggestions:', error);
    }
    
    return suggestions;
  }
}

export const aiAssistant = new SweeAIAssistant();