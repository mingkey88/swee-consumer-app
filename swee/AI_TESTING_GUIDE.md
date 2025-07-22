# 🤖 AI Assistant Testing Guide

## 🎯 Test Users with Rich Data

I've populated several test users with diverse preferences for you to test the AI assistant:

### 👤 **Bella Chen** (`merchant@example.com`)
- **Profile**: Professional, Hair Services specialist
- **Preferences**: Hair Services, Monthly appointments, $80-120 budget
- **Concerns**: Dryness, Frizz, Color Damage  
- **Lifestyle**: Professional - needs to look polished for work
- **Points**: 150 (Silver level)
- **Experience**: Has had uncomfortable hard-selling experiences

### 👤 **Jessica Wong** (`jessica.wong@email.com`) 
- **Profile**: Student, Facial Treatment focus
- **Preferences**: Facial Treatments, Bi-weekly, $50-80 budget
- **Concerns**: Acne, Dark Spots, Oily Skin
- **Lifestyle**: Student - budget-conscious
- **Points**: 420 (Gold level)
- **Experience**: Never experienced hard-selling

### 👤 **Sarah Chen** (`sarah.chen@email.com`)
- **Profile**: Executive, Multiple Services
- **Preferences**: Multiple Services, Weekly, $120-200 budget  
- **Concerns**: Anti-aging, Fine Lines, Gray Coverage, Thinning
- **Lifestyle**: Executive - premium service expectations
- **Points**: 750 (Gold level)
- **Experience**: Multiple hard-selling incidents, extremely concerned

### 👤 **Maria Rodriguez** (`maria.rodriguez@email.com`)
- **Profile**: Creative, Brows & Lashes specialist
- **Preferences**: Brows & Lashes, Every 3 weeks, $30-60 budget
- **Style**: Trendy, bold looks
- **Lifestyle**: Creative industry
- **Points**: 280 (Silver level)
- **Experience**: Occasional hard-selling encounters

## 🧪 How to Test

### Step 1: Sign In as Different Users
1. Go to `http://localhost:3001`
2. Sign in using one of the test emails above
3. Each user has different data for the AI to remember

### Step 2: Access AI Assistant
1. Click **"Let AI help you decide"** on the homepage
2. The AI will greet you with personalized information
3. Notice how it references your specific:
   - Service preferences
   - Budget range  
   - Booking frequency
   - Lifestyle needs
   - Trust concerns

### Step 3: Test Different Conversations

**Example conversations to try:**

**For Bella Chen:**
- "I need a haircut" → AI should mention her frizz/dryness concerns
- "What's my budget again?" → Should reference $80-120 range
- "I'm worried about pushy sales" → Should acknowledge her bad experiences

**For Jessica Wong:**  
- "My skin has been breaking out" → Should connect to her acne concerns
- "I'm on a tight budget" → Should reference her $50-80 student budget
- "Find me a facial" → Should suggest treatments for oily skin

**For Sarah Chen:**
- "I need anti-aging treatments" → Should reference her executive lifestyle
- "Something premium please" → Should suggest higher-end options
- "I hate hard selling" → Should emphasize trust scores strongly

### Step 4: Watch for Personalization

The AI should demonstrate:

✅ **Memory of preferences** - References quiz answers  
✅ **Budget awareness** - Stays within user's range  
✅ **Lifestyle matching** - Suggests appropriate services  
✅ **Trust integration** - Emphasizes safety for concerned users  
✅ **Points awareness** - Mentions current level and points  
✅ **Booking patterns** - References frequency preferences  

## 🎭 Expected AI Behaviors

### **Bella Chen Conversation:**
```
"Hi Bella! As a professional who prefers monthly hair appointments, I know you value looking polished for work. Given your concerns about frizz and color damage, and your $80-120 budget, I found some excellent salons with high trust scores..."
```

### **Jessica Wong Conversation:**  
```
"Hey Jessica! I see you're focused on facial treatments for acne and dark spots. With your bi-weekly routine and $50-80 student budget, I found some great options that specialize in oily skin treatments..."
```

### **Sarah Chen Conversation:**
```
"Hello Sarah! Given your executive lifestyle and preference for multiple services, I know you value premium experiences. With your concerns about hard-selling and need for anti-aging treatments, let me show you our most trusted, high-end providers..."
```

## 🔧 Troubleshooting

If AI responses seem generic:
1. **Check sign-in** - Make sure you're signed in as one of the test users
2. **Verify data** - The users should have quiz answers and preferences
3. **Try specific questions** - Ask about budget, concerns, or preferences directly
4. **Check console** - Look for any API errors in browser dev tools

## 🎊 Success Indicators

You'll know the AI is working perfectly when:
- It greets you by name and mentions your specific preferences
- It references your budget range without you mentioning it
- It suggests services that match your quiz concerns  
- It acknowledges your trust/hard-selling preferences
- It mentions your points and gamification level
- It provides contextual suggestions based on your profile

The AI should feel like it truly **knows** each user and provides personalized, intelligent assistance based on their individual data!