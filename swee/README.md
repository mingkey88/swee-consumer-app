# Swee - Beauty Services Booking Platform 💄

> **Beauty services without the sales pressure**

Swee is a modern, consumer-focused booking platform that connects users with trusted beauty professionals through AI-powered matching. Built with transparency, anti-hard-selling protection, and user experience at its core.

## 🌟 Overview

Swee revolutionizes the beauty service booking experience by eliminating high-pressure sales tactics and hidden fees. Our platform uses intelligent matching to connect customers with verified professionals who align with their preferences and budget.

### Key Value Propositions
- **AI-Powered Matching**: Intelligent onboarding quiz learns user preferences
- **Transparent Pricing**: No hidden fees or surprise upsells
- **Anti-Hard-Selling Protection**: Pressure-free service experience
- **Trust-Based Reviews**: Honest rating system with trust scoring

## 🚀 Features

### Core Features
- **Smart Search & Discovery**: AI-enhanced search with location-based results
- **Category-Based Browsing**: 6 main service categories
- **Personalized Recommendations**: Tailored matches based on user preferences
- **Real-Time Booking**: Instant appointment scheduling
- **Rewards System**: Points-based loyalty program
- **Dark/Light Mode**: Full theme support

### Service Categories
1. **Hair & Beauty** 💇‍♀️ - Salons, barbershops, styling
2. **Health & Wellness** 🏥 - Medical beauty, consultations
3. **Fitness** 💪 - Personal training, wellness coaching
4. **Massage & Spa** 🧘‍♀️ - Relaxation and therapeutic services
5. **Nails** 💅 - Manicures, pedicures, nail art
6. **Skincare** 🧴 - Facials, treatments, consultations

### User Experience Features
- **Responsive Design**: Mobile-first approach
- **Progressive Web App**: App-like experience on all devices
- **Accessibility**: WCAG compliant design
- **Performance Optimized**: Fast loading with Next.js and Turbopack

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 15.3.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Turbopack** - Ultra-fast bundler for development

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Custom UI Components** - Tailored design system

### State Management
- **React Context** - Theme and admin state management
- **Custom Hooks** - Reusable logic patterns

### Authentication & Data
- **NextAuth.js** - Flexible authentication
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Production database (planned)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Git** - Version control

## 📁 Project Structure

```
swee/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   ├── booking/           # Booking flow pages
│   │   ├── profile/           # User profile management
│   │   ├── quiz/              # Onboarding quiz
│   │   ├── rewards/           # Loyalty program
│   │   ├── search/            # Search and discovery
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── AISearch.tsx      # AI assistant widget
│   │   ├── AuthNavigation.tsx # Auth dropdown menu
│   │   ├── MapView.tsx       # Interactive maps
│   │   ├── Quiz.tsx          # Onboarding quiz component
│   │   └── TrustScore.tsx    # Trust rating display
│   ├── contexts/             # React Context providers
│   │   └── ThemeContext.tsx  # Dark/light mode state
│   ├── hooks/                # Custom React hooks
│   │   └── useAdmin.ts       # Admin state management
│   └── lib/                  # Utility functions
│       ├── prisma.ts         # Database connection
│       └── utils.ts          # Helper functions
├── prisma/                   # Database schema
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## 🏃‍♂️ Getting Started

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm/yarn/pnpm** - Package manager
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swee
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL=your-database-url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#F97316) to Red (#EF4444) gradient
- **Secondary**: Gray scale for neutral elements
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Geist Sans
- **Monospace**: Geist Mono
- **Font Scales**: Tailwind's built-in scale

### Component Guidelines
- **Consistent spacing**: 4px base unit
- **Rounded corners**: Various radius values for depth
- **Shadows**: Subtle elevation system
- **Animations**: Smooth transitions (300ms)

## 🔐 Authentication & Authorization

### User Roles
- **Regular Users**: Browse, book, review services
- **Admin Users**: Platform management, analytics access

### Authentication Flow
1. **Sign Up**: Email/social login via NextAuth.js
2. **Onboarding**: Preference quiz for personalization
3. **Profile Management**: User preferences and booking history

### Admin Features
- **Dashboard Access**: Platform analytics and management
- **Data Population**: Sample data generation
- **User Management**: Admin role assignment

## 🧪 Testing Strategy

### Current Testing Setup
- **Manual Testing**: Development server testing
- **Error Boundaries**: React error handling
- **TypeScript**: Compile-time error checking

### Planned Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress end-to-end testing
- **Performance Tests**: Lighthouse CI integration

## 🚢 Deployment

### Recommended Platforms
- **Vercel** (Primary): Seamless Next.js deployment
- **Netlify**: Alternative static hosting
- **Railway**: Full-stack deployment with database

### Build Process
```bash
npm run build      # Create production build
npm run start      # Start production server
npm run lint       # Check code quality
```

### Environment Setup
- **Production**: Optimized builds, CDN assets
- **Staging**: Pre-production testing environment
- **Development**: Local development with hot reload

## 📊 Analytics & Monitoring

### Planned Integrations
- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring and reporting
- **Vercel Analytics**: Performance metrics
- **PostHog**: Product analytics and feature flags

## 🔮 Roadmap

### Phase 1: Foundation (Current)
- ✅ Core booking platform
- ✅ Category-based search
- ✅ AI assistant widget
- ✅ Dark mode support
- ✅ Responsive design

### Phase 2: Enhancement (Next)
- 🔄 **Merchant SaaS Platform** (Your next project!)
- 📱 Real-time notifications
- 💳 Payment integration (Stripe)
- 📍 Advanced location features
- 🤖 Enhanced AI recommendations

### Phase 3: Scale (Future)
- 📱 Native mobile apps
- 🌍 Multi-language support
- 🔗 Third-party integrations
- 📈 Advanced analytics dashboard
- 🎯 Machine learning personalization

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Open** a pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced coding standards
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: Amazing React framework
- **Vercel**: Deployment and hosting platform
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Lucide**: Beautiful icon system

## 📞 Support & Contact

### Documentation
- **Technical Docs**: `/docs` (planned)
- **API Reference**: Coming with merchant platform
- **Component Library**: Storybook integration (planned)

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community support and ideas
- **Discord**: Real-time community chat (planned)

---

## 🚀 Next Steps: Merchant SaaS Platform

After completing the consumer app, your next phase involves building the **Merchant SaaS Platform** that will include:

### Merchant Dashboard Features
- **Business Profile Management**
- **Service & Pricing Configuration**
- **Booking Management System**
- **Analytics & Reports**
- **Customer Communication Tools**
- **Revenue & Payment Tracking**

### Integration Points
- **Shared Database**: Customer and booking data
- **Real-time Sync**: Live availability updates
- **Unified Design System**: Consistent branding
- **API Gateway**: Secure data exchange

---

**Built with ❤️ for the beauty industry**

*Swee - Where beauty meets technology, without the pressure.*
