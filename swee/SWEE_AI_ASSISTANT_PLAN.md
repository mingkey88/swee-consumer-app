# Swee AI Assistant Enhancement Plan

## 🎯 Vision
Transform the basic AI assistant into an intelligent, memory-enabled booking manager that remembers user preferences, booking patterns, and provides personalized recommendations using OpenAI.

## 🧠 AI Assistant Architecture

### Core Components

1. **Memory System** - User preference storage and retrieval
2. **OpenAI Integration** - Conversational AI with context awareness  
3. **Booking Intelligence** - Smart booking suggestions and management
4. **Personalization Engine** - Tailored recommendations based on user history
5. **Trust Integration** - Incorporates trust scores and hard-sell protection

### Data Sources for AI Context

```typescript
interface UserContext {
  // Quiz Preferences
  serviceType: string           // Hair, Facial, Brows & Lashes
  concerns: string[]           // Hair/facial concerns from quiz
  budgetRange: string          // Budget preferences
  lifestyle: string            // Lifestyle category
  availability: object         // Preferred time slots
  
  // Booking History
  pastBookings: Booking[]      // Previous appointments
  preferredMerchants: string[] // Frequently booked merchants
  avgSpending: number          // Average booking amount
  bookingFrequency: string     // How often they book
  
  // Trust & Safety
  trustPreferences: object     // Hard-sell protection preferences
  reportedIncidents: number    // Hard-sell reports made
  
  // Gamification
  totalPoints: number          // Current point balance
  level: string               // User level based on points
  achievementsUnlocked: string[] // Rewards earned
}
```

## 🛠️ Implementation Plan

### Phase 1: OpenAI Integration & Memory System

#### 1.1 Environment Setup
```env
# Add to .env.local
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4-turbo-preview"
```

#### 1.2 AI Assistant Service
Create `src/services/aiAssistant.ts`:
- OpenAI client configuration
- Context building from user data
- Conversation memory management
- Function calling for booking actions

#### 1.3 User Context API
Create `src/app/api/ai/context/route.ts`:
- Fetch user quiz answers and preferences
- Aggregate booking history and patterns
- Build comprehensive user context for AI

### Phase 2: Intelligent Conversation Engine

#### 2.1 Smart Prompts System
- System prompt that understands Swee's trust-first approach
- Dynamic user context injection
- Booking-focused conversation flows
- Trust score awareness in recommendations

#### 2.2 Function Calling Integration
Enable AI to perform actions:
- Search services based on preferences
- Make booking suggestions
- Check availability
- Explain trust scores
- Award points for interactions

#### 2.3 Memory Persistence
Store conversation context:
- Recent conversation history
- Learned preferences during chat
- Booking intents and follow-ups

### Phase 3: Advanced Features

#### 3.1 Proactive Suggestions
- Remind users of upcoming appointments
- Suggest rebooking based on history
- Recommend new services based on preferences
- Alert about favorite merchants' availability

#### 3.2 Trust-Aware Recommendations
- Prioritize high trust score merchants
- Explain why certain providers are recommended
- Warn about potential hard-selling risks
- Suggest alternatives if preferred merchant has low trust score

#### 3.3 Booking Intelligence
- Smart scheduling based on availability preferences
- Budget-aware suggestions
- Seasonal service recommendations
- Group booking coordination

## 🏗️ Technical Implementation

### Database Schema Updates

```prisma
model AIConversation {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  messages  Json[]   // Array of conversation messages
  context   Json     // Persistent context and learned preferences
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model UserAIPreferences {
  id              String @id @default(cuid())
  userId          String @unique
  user            User   @relation(fields: [userId], references: [id])
  
  learnedPreferences Json  // AI-discovered preferences
  conversationStyle  String @default("friendly") // preferred interaction style
  notificationPrefs  Json  // when to be proactive
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### API Endpoints

1. `POST /api/ai/chat` - Main conversation endpoint
2. `GET /api/ai/context/:userId` - Fetch user context for AI
3. `POST /api/ai/function-call` - Execute AI-requested actions
4. `GET /api/ai/suggestions/:userId` - Proactive suggestions

### Component Updates

Update `AISearch.tsx` to:
- Connect to OpenAI-powered backend
- Display real user context
- Show intelligent booking suggestions
- Enable complex conversations

## 🎨 Enhanced User Experience

### Conversation Examples

**Initial Greeting:**
```
AI: "Hi Sarah! 👋 I see it's been about 3 weeks since your last hair appointment 
at The Hair Lounge. Based on your usual 4-week cycle, you might be ready for 
your next cut and color. Would you like me to check their availability?"
```

**Trust-Aware Recommendation:**
```
AI: "I found 3 great salons for your balayage. The Hair Studio has a 95% trust 
score and specializes in your hair type - they're known for transparent pricing 
and no hard-selling. Would you like to see their availability?"
```

**Budget-Conscious Suggestion:**
```
AI: "I notice you usually spend around $80-120 for facials. I found a new spa 
within your budget that's highly rated for anti-aging treatments. Plus, with 
your current points, you could get a $15 discount!"
```

### Smart Features

1. **Context Switching**: "Let me check your previous bookings to suggest similar services"
2. **Preference Learning**: "I noticed you prefer morning appointments - should I prioritize those?"
3. **Trust Integration**: "This merchant has a 98% trust score and matches your preferences"
4. **Points Integration**: "You're only 50 points away from your next reward level!"

## 🔒 Privacy & Security

### Data Handling
- User context is anonymized before sending to OpenAI
- Sensitive information (payment details) never sent to AI
- Conversation logs encrypted and automatically expire
- User can clear AI memory at any time

### Trust Integration
- AI explains trust scores and their importance
- Warns about low-scoring merchants
- Prioritizes user safety in all recommendations
- Escalates concerning patterns to admin dashboard

## 📊 Success Metrics

### User Engagement
- Conversation length and depth
- Booking conversion from AI suggestions
- User satisfaction ratings
- Repeat usage of AI assistant

### Business Impact
- Increased booking frequency
- Higher user retention
- Improved trust score awareness
- Reduced booking abandonment

### AI Performance
- Response accuracy and relevance
- Context retention across sessions
- Function calling success rate
- User preference learning accuracy

## 🚀 Development Timeline

### Week 1: Foundation
- [ ] OpenAI API integration
- [ ] User context building system
- [ ] Basic conversation engine

### Week 2: Intelligence
- [ ] Memory system implementation
- [ ] Function calling for bookings
- [ ] Trust score integration

### Week 3: Enhancement
- [ ] Proactive suggestions
- [ ] Advanced personalization
- [ ] UI/UX improvements

### Week 4: Testing & Refinement
- [ ] User testing and feedback
- [ ] Performance optimization
- [ ] Production deployment

## 💡 Next Steps

1. **Start with OpenAI Integration** - Basic chat functionality with user context
2. **Build Memory System** - Store and retrieve user preferences
3. **Add Booking Intelligence** - Enable AI to make real booking suggestions
4. **Enhance with Trust Features** - Integrate trust scores and safety features
5. **Test and Iterate** - Refine based on user feedback

This plan transforms your AI assistant from a simple chatbot into an intelligent booking manager that truly understands each user's preferences, history, and needs.