# Anvago - Product Requirements Document

> **"Travel the world your way"**
> 
> A next-generation travel planning platform with AI integration, live routing, and personalized experiences for exploring Vietnam (starting with Danang).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Schema](#4-database-schema)
5. [API Structure](#5-api-structure)
6. [Feature Specifications](#6-feature-specifications)
7. [UI/UX Specifications](#7-uiux-specifications)
8. [Admin Panel](#8-admin-panel)
9. [Mock Data Strategy](#9-mock-data-strategy)
10. [Implementation Timeline](#10-implementation-timeline)
11. [Success Metrics](#11-success-metrics)

---

## 1. Project Overview

### 1.1 Vision

Anvago transforms travel planning from a tedious research process into an intelligent, personalized journey. By combining AI-powered recommendations, real-time local data (weather, traffic), and seamless transportation integration, we create experiences that feel like having a local friend guide you through every destination.

### 1.2 Target Users

- **Primary**: International tourists visiting Vietnam (25-45 years old)
- **Secondary**: Domestic travelers exploring new cities
- **Tertiary**: Business travelers with limited free time

### 1.3 Unique Value Propositions

1. **Zero-to-Itinerary in 2 Minutes**: Gamified onboarding creates personalized trips without overwhelming users
2. **Context-Aware Planning**: Weather, traffic, and local events shape every recommendation
3. **Anva Intelligence**: AI that thinks like a local, not a guidebook
4. **Seamless Execution**: From planning to transportation to booking - one unified experience
5. **Adaptive Journeys**: Real-time adjustments based on user behavior and conditions

### 1.4 Scope (Hackathon MVP)

**In Scope:**
- Danang, Vietnam as the primary location
- Full onboarding flow with gamified questions
- AI-powered itinerary generation
- Drag-and-drop trip planning
- Mock live tracking with demo mode
- Transportation and booking mock integrations
- Admin panel for demonstrations

**Out of Scope (Future):**
- Real payment processing
- Real Grab/booking API integration
- Multiple cities/countries
- Social features (sharing, reviews)
- Native mobile apps

---

## 2. Tech Stack

### 2.1 Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| TypeScript | Type Safety | 5.x |
| Vite | Build Tool | 5.x |
| TailwindCSS | Styling (v4) | 4.x |
| React Router | Routing | 6.x |
| Zustand | State Management | 4.x |
| React Query (TanStack) | Server State | 5.x |
| Framer Motion | Animations | 11.x |
| React DnD Kit | Drag & Drop | 6.x |
| Mapbox GL JS | Maps | 3.x |
| Lucide React | Icons | Latest |
| React Hot Toast | Notifications | 2.x |
| date-fns | Date Utilities | 3.x |

### 2.2 Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 20.x LTS |
| Express | Web Framework | 4.x |
| TypeScript | Type Safety | 5.x |
| Prisma | ORM | 5.x |
| PostgreSQL | Database | 16.x |
| Redis | Caching (optional) | 7.x |
| Passport.js | Authentication | 0.7.x |
| JWT | Token Management | 9.x |
| Zod | Validation | 3.x |
| Google AI (Gemini) | AI Integration | Latest |

### 2.3 External APIs

| Service | Purpose | Tier |
|---------|---------|------|
| Google Places API | Location Data | Pay-as-you-go |
| Mapbox | Maps & Directions | Free tier (50k loads/month) |
| OpenWeatherMap | Weather Data | Free tier (1000 calls/day) |
| Google Gemini Flash | AI Generation | Free tier available |

### 2.4 Development Tools

- **Package Manager**: pnpm (faster, disk efficient)
- **Monorepo**: Turborepo structure
- **Linting**: ESLint + Prettier
- **Testing**: Vitest (if time permits)
- **API Testing**: Thunder Client / Postman

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React SPA)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │Onboarding│  │ Planning │  │  Active  │  │   Admin Panel    │ │
│  │   Flow   │  │   View   │  │   Trip   │  │                  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Express)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │   Auth   │  │Itinerary │  │ Location │  │   Integration    │ │
│  │ Routes   │  │  Routes  │  │  Routes  │  │     Routes       │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐
│  PostgreSQL  │    │   External   │    │    Mock Services     │
│   Database   │    │     APIs     │    │  (Grab, Booking.com) │
└──────────────┘    └──────────────┘    └──────────────────────┘
```

### 3.2 Project Structure

```
anvago-travel-planning-v2/
├── docs/
│   ├── DESIGN_SYSTEM.md
│   └── REQUIREMENTS.md
├── packages/
│   ├── client/                    # React Frontend
│   │   ├── src/
│   │   │   ├── components/        # Reusable UI components
│   │   │   │   ├── ui/            # Design system components
│   │   │   │   ├── onboarding/    # Onboarding-specific components
│   │   │   │   ├── planning/      # Trip planning components
│   │   │   │   ├── trip/          # Active trip components
│   │   │   │   └── admin/         # Admin panel components
│   │   │   ├── pages/             # Route pages
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── stores/            # Zustand stores
│   │   │   ├── services/          # API client services
│   │   │   ├── utils/             # Helper functions
│   │   │   ├── types/             # TypeScript types
│   │   │   └── assets/            # Static assets
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── server/                    # Node.js Backend
│   │   ├── src/
│   │   │   ├── routes/            # API route handlers
│   │   │   ├── controllers/       # Business logic
│   │   │   ├── services/          # External API integrations
│   │   │   ├── middleware/        # Auth, validation, etc.
│   │   │   ├── utils/             # Helper functions
│   │   │   ├── types/             # TypeScript types
│   │   │   ├── prisma/            # Prisma schema & migrations
│   │   │   └── mock/              # Mock data generators
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                    # Shared types & utilities
│       ├── src/
│       │   ├── types/             # Shared TypeScript types
│       │   └── constants/         # Shared constants
│       └── package.json
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

---

## 4. Database Schema

### 4.1 Core Entities

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USER & AUTH ====================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?   // Null for OAuth users
  name          String
  avatarUrl     String?
  
  // OAuth
  googleId      String?   @unique
  facebookId    String?   @unique
  
  // Subscription
  isPremium     Boolean   @default(false)
  premiumUntil  DateTime?
  
  // Preferences (from onboarding)
  preferences   UserPreferences?
  
  // Relations
  itineraries   Itinerary[]
  trips         Trip[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model UserPreferences {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Travel Style
  personas          String[] // ["adventurer", "foodie", "culture_seeker"]
  vibePreferences   String[] // ["beach", "mountain", "urban", "nature"]
  interests         String[] // ["photography", "food", "history", "nightlife"]
  
  // Practical
  budgetLevel       String   @default("moderate") // "budget", "moderate", "luxury"
  mobilityLevel     String   @default("moderate") // "low", "moderate", "high"
  groupSize         Int      @default(1)
  
  // Dietary/Special
  dietaryRestrictions String[]
  accessibilityNeeds  String[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// ==================== LOCATIONS ====================

model Location {
  id              String   @id @default(cuid())
  
  // Basic Info
  name            String
  nameLocal       String?  // Vietnamese name
  description     String
  descriptionShort String  // For cards
  
  // Location Data
  googlePlaceId   String?  @unique
  latitude        Float
  longitude       Float
  address         String
  city            String   @default("Danang")
  
  // Categorization
  category        String   // "attraction", "restaurant", "cafe", "beach", "temple", "market", "nightlife", "nature"
  subcategory     String?
  tags            String[] // ["instagrammable", "local_favorite", "family_friendly", "romantic"]
  
  // Media
  imageUrl        String
  images          String[] // Additional images
  
  // Metadata
  priceLevel      Int      @default(2) // 1-4 ($ to $$$$)
  rating          Float    @default(4.0)
  reviewCount     Int      @default(0)
  
  // Time Info
  avgDurationMins Int      @default(60) // Average time spent
  openingHours    Json?    // { "monday": { "open": "09:00", "close": "17:00" }, ... }
  
  // Flags
  isAnvaVerified  Boolean  @default(false) // "Anva Stamp of Authenticity"
  isHiddenGem     Boolean  @default(false)
  isPopular       Boolean  @default(false)
  
  // Relations
  itineraryItems  ItineraryItem[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([city])
  @@index([category])
}

// ==================== ITINERARIES ====================

model Itinerary {
  id              String   @id @default(cuid())
  
  // Basic Info
  title           String
  description     String?
  coverImage      String?
  
  // Configuration
  city            String   @default("Danang")
  durationDays    Int
  startDate       DateTime?
  
  // User/System
  userId          String?
  user            User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  isTemplate      Boolean  @default(false) // Pre-made templates
  isPublic        Boolean  @default(false)
  
  // AI Generation Metadata
  generatedBy     String?  // "ai", "user", "template"
  generationPrompt String?
  
  // Stats
  estimatedBudget Float?
  totalDistance   Float?   // in km
  
  // Relations
  items           ItineraryItem[]
  trips           Trip[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([isTemplate])
}

model ItineraryItem {
  id              String   @id @default(cuid())
  
  // Relations
  itineraryId     String
  itinerary       Itinerary @relation(fields: [itineraryId], references: [id], onDelete: Cascade)
  locationId      String
  location        Location  @relation(fields: [locationId], references: [id])
  
  // Scheduling
  dayNumber       Int      // 1, 2, 3...
  orderIndex      Int      // Order within the day
  startTime       String?  // "09:00"
  endTime         String?  // "11:00"
  
  // Custom Fields
  notes           String?
  isOptional      Boolean  @default(false)
  
  // Transportation to next location
  transportMode   String?  // "grab_bike", "grab_car", "walk", "cyclo", "taxi"
  transportDuration Int?   // in minutes
  transportCost   Float?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([itineraryId, dayNumber, orderIndex])
  @@index([itineraryId])
}

// ==================== TRIPS (Active Journeys) ====================

model Trip {
  id              String   @id @default(cuid())
  
  // Relations
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  itineraryId     String
  itinerary       Itinerary @relation(fields: [itineraryId], references: [id])
  
  // Status
  status          String   @default("scheduled") // "scheduled", "active", "paused", "completed", "cancelled"
  
  // Timing
  scheduledStart  DateTime
  actualStart     DateTime?
  completedAt     DateTime?
  
  // Progress
  currentDayNumber Int     @default(1)
  currentItemIndex Int     @default(0)
  
  // Live Tracking (mock data in demo)
  lastLatitude    Float?
  lastLongitude   Float?
  lastUpdated     DateTime?
  
  // Stats
  completedItems  Int      @default(0)
  totalItems      Int      @default(0)
  
  // Relations
  events          TripEvent[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
}

model TripEvent {
  id              String   @id @default(cuid())
  
  tripId          String
  trip            Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  // Event Type
  type            String   // "location_arrived", "location_departed", "transport_booked", "schedule_adjusted", "weather_alert", "user_action"
  
  // Event Data
  message         String
  data            Json?    // Additional event-specific data
  
  timestamp       DateTime @default(now())
  
  @@index([tripId])
}

// ==================== TEMPLATES & RECOMMENDATIONS ====================

model ItineraryTemplate {
  id              String   @id @default(cuid())
  
  // Basic Info
  name            String
  description     String
  coverImage      String
  
  // Target
  city            String   @default("Danang")
  durationDays    Int
  
  // Matching Criteria
  targetPersonas  String[] // Which personas this matches
  targetVibes     String[]
  targetBudget    String   // "budget", "moderate", "luxury"
  
  // Content
  highlights      String[] // Key selling points
  
  // The actual itinerary
  itineraryId     String   @unique
  
  // Display
  displayOrder    Int      @default(0)
  isActive        Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ==================== MOCK BOOKINGS ====================

model MockBooking {
  id              String   @id @default(cuid())
  
  userId          String
  tripId          String?
  
  // Booking Type
  type            String   // "grab_bike", "grab_car", "hotel", "activity", "restaurant"
  provider        String   // "grab", "booking_com", "klook", "agoda"
  
  // Details
  title           String
  details         Json
  
  // Status (for demo)
  status          String   @default("confirmed") // "pending", "confirmed", "completed", "cancelled"
  
  // Pricing
  price           Float
  currency        String   @default("VND")
  
  // Timing
  scheduledTime   DateTime?
  
  createdAt       DateTime @default(now())
}
```

### 4.2 Entity Relationships Diagram

```
┌─────────────┐       ┌──────────────────┐
│    User     │───────│ UserPreferences  │
└─────────────┘       └──────────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐       ┌──────────────────┐
│  Itinerary  │───────│ ItineraryTemplate│
└─────────────┘       └──────────────────┘
       │
       │ 1:N
       ▼
┌─────────────────┐       ┌────────────┐
│ ItineraryItem   │───────│  Location  │
└─────────────────┘       └────────────┘
       
┌─────────────┐
│    Trip     │
└─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│  TripEvent  │
└─────────────┘
```

---

## 5. API Structure

### 5.1 API Conventions

- **Base URL**: `/api/v1`
- **Authentication**: Bearer JWT token in Authorization header
- **Response Format**: 
```json
{
  "success": true,
  "data": { ... },
  "meta": { "pagination": { ... } }
}
```
- **Error Format**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### 5.2 API Endpoints

#### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Email registration | No |
| POST | `/login` | Email login | No |
| POST | `/logout` | Logout (invalidate token) | Yes |
| GET | `/me` | Get current user | Yes |
| POST | `/google` | Google OAuth callback | No |
| POST | `/facebook` | Facebook OAuth callback | No |
| POST | `/refresh` | Refresh access token | No |

#### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current user profile | Yes |
| PATCH | `/me` | Update profile | Yes |
| GET | `/me/preferences` | Get preferences | Yes |
| PUT | `/me/preferences` | Update preferences | Yes |
| POST | `/me/upgrade` | Upgrade to premium (mock) | Yes |

#### Onboarding (`/api/v1/onboarding`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/questions` | Get onboarding questions | No |
| POST | `/submit` | Submit answers & get itineraries | No |
| GET | `/weather` | Get current weather for city | No |
| GET | `/personas` | Get available personas | No |
| GET | `/vibes` | Get vibe cards (images) | No |
| GET | `/interests` | Get interest icons | No |

#### Locations (`/api/v1/locations`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List locations (with filters) | No |
| GET | `/:id` | Get location details | No |
| GET | `/search` | Search locations | No |
| GET | `/nearby` | Get nearby locations | No |
| GET | `/categories` | Get all categories | No |
| GET | `/featured` | Get featured locations | No |

#### Itineraries (`/api/v1/itineraries`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/templates` | Get template itineraries | No |
| GET | `/generate` | Generate AI itinerary | No |
| POST | `/generate` | Generate with preferences | No |
| GET | `/` | Get user's itineraries | Yes |
| POST | `/` | Create new itinerary | Yes |
| GET | `/:id` | Get itinerary details | Mixed |
| PATCH | `/:id` | Update itinerary | Yes |
| DELETE | `/:id` | Delete itinerary | Yes |
| POST | `/:id/duplicate` | Duplicate itinerary | Yes |
| POST | `/:id/optimize` | AI optimize (premium) | Yes |
| POST | `/:id/localize` | Localize with Anva (premium) | Yes |

#### Itinerary Items (`/api/v1/itineraries/:id/items`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Add item to itinerary | Yes |
| PATCH | `/:itemId` | Update item | Yes |
| DELETE | `/:itemId` | Remove item | Yes |
| POST | `/reorder` | Reorder items | Yes |
| GET | `/:itemId/alternatives` | Get alternative locations | Yes |

#### Trips (`/api/v1/trips`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user's trips | Yes |
| POST | `/` | Start trip from itinerary | Yes |
| GET | `/:id` | Get trip details | Yes |
| PATCH | `/:id` | Update trip status | Yes |
| POST | `/:id/advance` | Move to next location | Yes |
| POST | `/:id/events` | Log trip event | Yes |
| GET | `/:id/events` | Get trip events | Yes |

#### Integrations (`/api/v1/integrations`) - Mock

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/grab/book` | Mock Grab booking | Yes |
| GET | `/grab/estimate` | Get fare estimate | No |
| POST | `/booking/search` | Search accommodations | No |
| POST | `/klook/activities` | Search activities | No |

#### Admin (`/api/v1/admin`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Get system stats | Admin |
| GET | `/users` | List all users | Admin |
| GET | `/itineraries` | List all itineraries | Admin |
| GET | `/trips` | List all trips | Admin |
| POST | `/demo/reset` | Reset demo data | Admin |
| POST | `/demo/simulate` | Simulate trip progress | Admin |
| GET | `/locations` | Manage locations | Admin |
| POST | `/locations` | Add location | Admin |
| PATCH | `/locations/:id` | Update location | Admin |

#### External Data (`/api/v1/external`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/weather/:city` | Get weather data | No |
| GET | `/traffic/:city` | Get traffic data (mock) | No |

---

## 6. Feature Specifications

### 6.1 Onboarding Flow

#### 6.1.1 Flow Overview

```
Landing Page
    │
    ▼
Essential Questions (2-3 questions)
    │
    ├── Q1: Destination selection
    ├── Q2: Trip duration
    └── Q3: Travel dates (optional)
    │
    ▼
Gamified Discovery (4-5 interactive screens)
    │
    ├── Persona Picker
    ├── Vibe Swiper (Tinder-style)
    ├── Interest Selector
    ├── Activity Matcher
    └── Budget Calibrator
    │
    ▼
Context Display (Weather + Traffic)
    │
    ▼
Itinerary Results (3-4 options)
    │
    ├── [Reroll] → Back to Gamified Discovery
    ├── [View Details] → Detailed Itinerary View
    └── [Customize/Schedule/Go Now] → Requires Login
```

#### 6.1.2 Essential Questions

**Q1: Destination Selection**
```typescript
interface DestinationQuestion {
  type: "destination";
  prompt: "Where's your adventure taking you?";
  subtext: "We're currently showcasing Danang, Vietnam";
  options: [
    { id: "danang", name: "Danang", available: true, image: "..." },
    { id: "hoian", name: "Hoi An", available: false, comingSoon: true },
    { id: "hue", name: "Huế", available: false, comingSoon: true },
  ];
  defaultSelection: "danang";
  skippable: true;
}
```

**Q2: Trip Duration**
```typescript
interface DurationQuestion {
  type: "duration";
  prompt: "How long is your Danang adventure?";
  subtext: "We'll craft the perfect pace for your trip";
  options: [
    { value: 1, label: "Day trip", icon: "☀️" },
    { value: 2, label: "Weekend escape", icon: "🌴" },
    { value: 3, label: "3 days", icon: "🎒", recommended: true },
    { value: 5, label: "5 days", icon: "🧳" },
    { value: 7, label: "Week+", icon: "🌏" },
  ];
  customInput: true; // Allow custom number
  skippable: true;
  defaultValue: 3;
}
```

**Q3: Travel Dates (Optional)**
```typescript
interface DatesQuestion {
  type: "dates";
  prompt: "When are you visiting?";
  subtext: "We'll factor in weather and local events";
  inputType: "dateRange";
  skippable: true;
  showWeatherPreview: true;
}
```

#### 6.1.3 Gamified Discovery Screens

**Screen 1: Persona Picker**
```typescript
interface PersonaScreen {
  type: "persona";
  prompt: "Who are you as a traveler?";
  subtext: "Pick all that resonate with you";
  multiSelect: true;
  maxSelections: 3;
  personas: [
    {
      id: "adventurer",
      name: "The Adventurer",
      emoji: "🏔️",
      description: "Thrill-seeker, off-beaten-path explorer",
      color: "#FF6B6B"
    },
    {
      id: "foodie",
      name: "The Foodie",
      emoji: "🍜",
      description: "Street food enthusiast, culinary explorer",
      color: "#FFB347"
    },
    {
      id: "culture_seeker",
      name: "The Culture Seeker",
      emoji: "🏛️",
      description: "History buff, temple wanderer",
      color: "#9B59B6"
    },
    {
      id: "relaxer",
      name: "The Relaxer",
      emoji: "🏖️",
      description: "Beach lover, spa enthusiast",
      color: "#3498DB"
    },
    {
      id: "photographer",
      name: "The Photographer",
      emoji: "📸",
      description: "Golden hour chaser, view hunter",
      color: "#E91E63"
    },
    {
      id: "nightowl",
      name: "The Night Owl",
      emoji: "🌙",
      description: "Bar hopper, nightlife explorer",
      color: "#2C3E50"
    },
    {
      id: "wellness",
      name: "The Wellness Seeker",
      emoji: "🧘",
      description: "Yoga retreats, healthy living",
      color: "#27AE60"
    },
    {
      id: "social_butterfly",
      name: "The Social Butterfly",
      emoji: "🦋",
      description: "Hostel vibes, group tours",
      color: "#F39C12"
    }
  ];
  skippable: true;
}
```

**Screen 2: Vibe Swiper (Tinder-style)**
```typescript
interface VibeSwiper {
  type: "vibe_swiper";
  prompt: "Which vibes speak to you?";
  subtext: "Swipe right to love, left to pass";
  interaction: "swipe"; // or tap for like/dislike
  cards: [
    {
      id: "marble_mountains",
      image: "/images/vibes/marble-mountains.jpg",
      title: "Mystical Heights",
      subtitle: "Marble Mountains",
      tags: ["spiritual", "nature", "photography"]
    },
    {
      id: "my_khe_beach",
      image: "/images/vibes/my-khe-beach.jpg",
      title: "Golden Shores",
      subtitle: "My Khe Beach",
      tags: ["beach", "relaxation", "sunrise"]
    },
    {
      id: "han_market",
      image: "/images/vibes/han-market.jpg",
      title: "Local Hustle",
      subtitle: "Han Market",
      tags: ["local", "food", "shopping"]
    },
    // ... 8-10 cards total
  ];
  minSwipes: 5;
  skippable: true;
}
```

**Screen 3: Interest Selector**
```typescript
interface InterestSelector {
  type: "interests";
  prompt: "What's on your must-do list?";
  subtext: "Select as many as you'd like";
  multiSelect: true;
  categories: [
    {
      name: "Experiences",
      items: [
        { id: "sunrise", icon: "🌅", label: "Catch a sunrise" },
        { id: "cooking_class", icon: "👨‍🍳", label: "Cooking class" },
        { id: "spa", icon: "💆", label: "Spa day" },
        { id: "scuba", icon: "🤿", label: "Diving/Snorkeling" },
        { id: "hiking", icon: "🥾", label: "Hiking" },
        { id: "cycling", icon: "🚴", label: "Cycling tour" },
      ]
    },
    {
      name: "Food & Drink",
      items: [
        { id: "street_food", icon: "🍢", label: "Street food tour" },
        { id: "seafood", icon: "🦞", label: "Fresh seafood" },
        { id: "coffee", icon: "☕", label: "Vietnamese coffee" },
        { id: "craft_beer", icon: "🍺", label: "Craft beer scene" },
        { id: "fine_dining", icon: "🍽️", label: "Fine dining" },
        { id: "rooftop", icon: "🌃", label: "Rooftop bars" },
      ]
    },
    {
      name: "Culture & History",
      items: [
        { id: "temples", icon: "🛕", label: "Temples & pagodas" },
        { id: "museums", icon: "🏛️", label: "Museums" },
        { id: "art", icon: "🎨", label: "Art galleries" },
        { id: "local_life", icon: "🏘️", label: "Local neighborhoods" },
        { id: "markets", icon: "🛒", label: "Local markets" },
        { id: "festivals", icon: "🎊", label: "Local festivals" },
      ]
    }
  ];
  skippable: true;
}
```

**Screen 4: Activity Intensity**
```typescript
interface ActivityIntensity {
  type: "intensity";
  prompt: "What's your adventure pace?";
  subtext: "We'll match activities to your energy";
  singleSelect: true;
  options: [
    {
      id: "chill",
      title: "Easy Going",
      emoji: "🐢",
      description: "2-3 activities per day, plenty of downtime",
      avgLocationsPerDay: 3
    },
    {
      id: "balanced",
      title: "Balanced",
      emoji: "⚖️", 
      description: "4-5 activities, mix of adventure and rest",
      avgLocationsPerDay: 5,
      recommended: true
    },
    {
      id: "packed",
      title: "Adventure Packed",
      emoji: "⚡",
      description: "6+ activities, maximize every moment",
      avgLocationsPerDay: 7
    }
  ];
  skippable: true;
  defaultValue: "balanced";
}
```

**Screen 5: Budget Calibrator**
```typescript
interface BudgetCalibrator {
  type: "budget";
  prompt: "What's your spending style?";
  subtext: "This helps us suggest the right experiences";
  singleSelect: true;
  options: [
    {
      id: "budget",
      title: "Budget Savvy",
      emoji: "💰",
      description: "Street food, hostels, free attractions",
      dailyRange: "Under 500,000 VND (~$20)"
    },
    {
      id: "moderate",
      title: "Comfortable",
      emoji: "💳",
      description: "Mix of experiences, mid-range dining",
      dailyRange: "500K - 1.5M VND (~$20-60)",
      recommended: true
    },
    {
      id: "luxury",
      title: "Treat Yourself",
      emoji: "✨",
      description: "Fine dining, premium experiences",
      dailyRange: "1.5M+ VND (~$60+)"
    }
  ];
  skippable: true;
  defaultValue: "moderate";
}
```

#### 6.1.4 Context Display

After gamified questions, display real-time context:

```typescript
interface ContextDisplay {
  weather: {
    current: {
      temp: 28,
      condition: "Partly Cloudy",
      icon: "⛅",
      humidity: 75,
      uvIndex: 7
    },
    forecast: [
      { day: "Today", high: 30, low: 24, condition: "sunny" },
      { day: "Tomorrow", high: 28, low: 23, condition: "cloudy" },
      // ...
    ],
    recommendation: "Great beach weather! We've prioritized outdoor activities."
  },
  traffic: {
    status: "moderate",
    peakHours: ["7:00-9:00", "17:00-19:00"],
    recommendation: "Avoid Dragon Bridge area during rush hours"
  },
  events: [
    {
      name: "Dragon Bridge Fire Show",
      date: "Saturday 9PM",
      relevance: "Don't miss this weekly spectacle!"
    }
  ]
}
```

#### 6.1.5 Itinerary Results

Display 3-4 generated itineraries based on preferences:

```typescript
interface ItineraryResult {
  id: string;
  title: string; // "The Adventurer's Danang"
  tagline: string; // "3 days of thrills and discovery"
  matchScore: number; // 0-100, how well it matches preferences
  highlights: string[]; // ["Marble Mountains sunrise", "Hidden waterfall", ...]
  coverImage: string;
  stats: {
    duration: "3 days";
    locations: 12;
    walkingDistance: "8.5 km";
    estimatedBudget: "1,200,000 VND";
  };
  dayPreviews: [
    { day: 1, title: "Beach & Culture", locations: 4 },
    { day: 2, title: "Mountain Adventure", locations: 5 },
    { day: 3, title: "Local Immersion", locations: 3 }
  ];
  badges: ["adventure", "photography", "local_favorite"];
}
```

### 6.2 Trip Planning

#### 6.2.1 Planning Interface

**Main Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Trip Title + Actions (Save, Share, Export)                 │
├───────────────────────────────────┬─────────────────────────────────┤
│                                   │                                 │
│         INTERACTIVE MAP           │        ITINERARY SIDEBAR        │
│         (Mapbox GL)               │        (Scrollable)             │
│                                   │                                 │
│   - Location markers              │   Day 1: Beach Day              │
│   - Route lines                   │   ┌─────────────────────┐       │
│   - Click to select               │   │ 📍 My Khe Beach     │       │
│   - Drag markers (premium)        │   │ 9:00 AM - 11:00 AM  │       │
│                                   │   │ ≡ drag handle       │       │
│                                   │   └─────────────────────┘       │
│                                   │   ┌─────────────────────┐       │
│                                   │   │ 🚗 Grab Bike 15min  │       │
│                                   │   │ 25,000 VND          │       │
│                                   │   └─────────────────────┘       │
│                                   │   ┌─────────────────────┐       │
│                                   │   │ 📍 Marble Mountains │       │
│                                   │   │ 11:30 AM - 2:00 PM  │       │
│                                   │   └─────────────────────┘       │
│                                   │                                 │
│                                   │   [+ Add Location]              │
│                                   │                                 │
├───────────────────────────────────┴─────────────────────────────────┤
│  BOTTOM BAR: Trip Stats | [Optimize with Go AI ▼] | [Start Trip]   │
└─────────────────────────────────────────────────────────────────────┘
```

#### 6.2.2 Drag & Drop System

**Free Features:**
- Reorder locations within a day
- Move locations between days
- Remove locations
- Search and add new locations
- View location details

**Premium Features (Visual indicator: subtle ✨ or 👑):**

1. **Anva Smart Search**
   - Click on any location card
   - See "Find Similar" button
   - Options: Same category, Same price range, Same area, Higher rated
   - Shows alternatives in a modal with comparison

2. **Go AI Optimization**
   - Button with dropdown: "Optimize with Go AI"
   - Options:
     - 🎯 "Optimize Route" - Minimize travel time
     - 🌦️ "Weather Smart" - Adapt to forecast
     - 💰 "Budget Optimize" - Reduce costs
     - 🚶 "Minimize Walking" - For accessibility
     - 🌅 "Maximize Views" - Photo-friendly timing
     - ⚡ "Pack More In" - Maximize locations
   - Shows before/after comparison
   - Accept/Reject each suggestion

3. **Localize by Anva**
   - Button: "Discover Local Gems"
   - AI suggests replacing tourist spots with verified local alternatives
   - Each suggestion shows:
     - Original location
     - Anva-verified alternative
     - Why it's special (local insight)
     - Anva Stamp of Authenticity badge
   - Accept/Reject individually

4. **Booking Integration Panel**
   - Side panel showing bookable items:
     - Hotels (via Booking.com mock)
     - Activities (via Klook mock)
     - Transportation (via Grab mock)
   - Each item shows price, rating, book button

#### 6.2.3 Location Card Component

```typescript
interface LocationCard {
  // Display
  image: string;
  name: string;
  category: string;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4;
  duration: string; // "~2 hours"
  
  // Time slot
  startTime?: string;
  endTime?: string;
  
  // Status indicators
  isOptimal?: boolean; // Green check for well-placed items
  hasConflict?: boolean; // Red warning for timing issues
  weatherAlert?: string; // "☔ Rain expected"
  
  // Actions
  onDragStart: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onFindSimilar: () => void; // Premium
  
  // Badges
  badges: ("anva_verified" | "hidden_gem" | "popular" | "photo_spot")[];
}
```

### 6.3 Active Trip

#### 6.3.1 Trip View Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: "Your Danang Adventure" | Day 2 of 3 | ⏸️ Pause | ❌ End  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                         FULL-SCREEN MAP                             │
│                                                                     │
│   - Current location (pulsing blue dot)                             │
│   - Next destination (highlighted marker)                           │
│   - Route to next (animated dashed line)                            │
│   - Completed locations (muted markers)                             │
│   - Upcoming locations (numbered markers)                           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                     BOTTOM SHEET (Draggable)                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ═══════════════════ (drag handle) ═══════════════════════   │  │
│  │                                                               │  │
│  │  CURRENT: ✅ My Khe Beach (Completed at 11:30 AM)            │  │
│  │                                                               │  │
│  │  ─────────────────────────────────────────────────────────   │  │
│  │  UP NEXT: Marble Mountains                                    │  │
│  │  📍 8.2 km away | 🕐 25 min by Grab Bike                     │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  🛵 Book Grab Bike          💰 45,000 VND            │    │  │
│  │  │  [Book Now]                                          │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                               │  │
│  │  Or: 🚶 Walk (1h 45min) | 🚗 Grab Car (65,000 VND)          │  │
│  │                                                               │  │
│  │  [View Full Timeline]                                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

#### 6.3.2 Notification System

**In-App Notifications (Toast/Banner):**

```typescript
interface TripNotification {
  id: string;
  type: "transport" | "schedule" | "weather" | "suggestion" | "milestone";
  priority: "low" | "medium" | "high";
  
  // Content
  title: string;
  message: string;
  icon: string;
  
  // Actions
  primaryAction?: {
    label: string;
    action: () => void;
  };
  secondaryAction?: {
    label: string;
    action: () => void;
  };
  
  // Display
  autoDismiss?: boolean;
  duration?: number; // ms
}
```

**Notification Examples:**

1. **Transport Ready**
   ```
   🛵 Ready to move?
   "Book your Grab Bike to Marble Mountains"
   [Book Now] [Later]
   ```

2. **Weather Alert**
   ```
   ☔ Weather Update
   "Rain expected at 3 PM. We suggest visiting indoor attractions first."
   [Reroute Trip] [Keep Plan]
   ```

3. **Enjoying Longer**
   ```
   ⏰ No rush!
   "Looks like you're enjoying My Khe Beach. We've adjusted your schedule."
   [View New Schedule] [Dismiss]
   ```

4. **Smart Reroute (Premium)**
   ```
   🔄 Anva Smart Reroute
   "Traffic on Nguyen Van Linh. Alternative route saves 20 minutes."
   [Accept Reroute] [Keep Route]
   ```

5. **Milestone**
   ```
   🎉 Achievement Unlocked!
   "You've visited 5 locations today! Keep exploring!"
   [Share Progress] [Dismiss]
   ```

#### 6.3.3 Timeline View

```typescript
interface TimelineItem {
  id: string;
  time: string;
  type: "location" | "transport" | "break" | "meal";
  
  // Location
  location?: {
    name: string;
    image: string;
    duration: string;
  };
  
  // Transport
  transport?: {
    mode: "grab_bike" | "grab_car" | "walk" | "cyclo";
    duration: string;
    cost?: number;
  };
  
  // Status
  status: "completed" | "current" | "upcoming" | "skipped";
  
  // Adjustments
  originalTime?: string; // If rescheduled
  adjustmentReason?: string;
}
```

#### 6.3.4 Demo Mode (Simulation)

For hackathon presentation, implement simulation controls:

```typescript
interface DemoControls {
  // Time simulation
  simulateTime: (minutes: number) => void;
  setCurrentTime: (time: Date) => void;
  
  // Location simulation
  moveToLocation: (lat: number, lng: number) => void;
  simulateMovement: (from: Coords, to: Coords, durationMs: number) => void;
  
  // Event triggers
  triggerWeatherAlert: (type: "rain" | "heat" | "storm") => void;
  triggerTrafficAlert: (severity: "low" | "medium" | "high") => void;
  triggerArrival: (locationId: string) => void;
  
  // Speed controls
  simulationSpeed: 1 | 2 | 5 | 10; // 1x, 2x, 5x, 10x
}
```

---

## 7. UI/UX Specifications

### 7.1 Page Structure

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| Landing | `/` | No | Hero, features, CTA to start |
| Onboarding | `/discover` | No | Multi-step questionnaire |
| Results | `/discover/results` | No | Generated itineraries |
| Itinerary Detail | `/itinerary/:id` | No* | View itinerary details |
| Login | `/login` | No | Email + OAuth login |
| Register | `/register` | No | Email + OAuth signup |
| Dashboard | `/dashboard` | Yes | User's trips and itineraries |
| Trip Planning | `/plan/:id` | Yes | Edit itinerary |
| Active Trip | `/trip/:id` | Yes | Live trip tracking |
| Profile | `/profile` | Yes | User settings |
| Admin | `/admin` | Admin | Demo controls |

### 7.2 Key UI Components

**Onboarding Components:**
- `OnboardingProgress` - Step indicator with playful animation
- `PersonaCard` - Selectable persona card with emoji and description
- `VibeSwiper` - Tinder-like swipeable cards
- `InterestChip` - Selectable interest pill with icon
- `WeatherWidget` - Current weather display
- `ItineraryPreviewCard` - Result card with match score

**Planning Components:**
- `MapView` - Mapbox wrapper with markers and routes
- `ItineraryTimeline` - Day-by-day schedule
- `LocationCard` - Draggable location item
- `TransportConnector` - Visual connection between locations
- `OptimizeModal` - AI optimization interface
- `LocationSearch` - Search with filters
- `BookingPanel` - Side panel for integrations

**Trip Components:**
- `TripMap` - Full-screen map with tracking
- `BottomSheet` - Draggable info panel
- `CurrentLocationCard` - Current/next destination
- `TransportBookingCard` - Quick booking interface
- `TripTimeline` - Collapsible day timeline
- `NotificationToast` - In-app notifications

**Shared Components:**
- `Button` - Per design system
- `Card` - Per design system
- `Input`, `Select`, `Textarea` - Form elements
- `Badge` - Status/category badges
- `Modal` - Overlay dialogs
- `Drawer` - Side panels
- `Tooltip` - Helper text
- `Skeleton` - Loading states
- `Avatar` - User avatars

### 7.3 Animations & Transitions

**Page Transitions:**
- Fade + slide for navigation
- `framer-motion` for orchestration

**Micro-interactions:**
- Button press (shadow reduction per design system)
- Card hover (lift effect per design system)
- Selection feedback (scale + check animation)
- Swipe gestures (spring physics)

**Loading States:**
- Skeleton loaders matching content shape
- Spinner with brand color
- Progress indicators for multi-step processes

**Special Animations:**
- Confetti on trip completion
- Map marker bounce on selection
- Route drawing animation
- Notification slide-in

### 7.4 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom sheet |
| Tablet | 640-1024px | Sidebar collapsible |
| Desktop | > 1024px | Full layout with sidebar |

**Mobile-First Considerations:**
- Touch-friendly tap targets (44px minimum)
- Swipe gestures for cards
- Bottom sheet for trip info
- Floating action buttons

---

## 8. Admin Panel

### 8.1 Purpose

The admin panel serves as a demonstration and debugging tool for the hackathon:

1. **Demo Controls** - Simulate real-world scenarios
2. **Data Management** - View and modify test data
3. **Analytics Dashboard** - Show system metrics
4. **Walkthrough Mode** - Guided demo for judges

### 8.2 Admin Features

#### 8.2.1 Demo Control Center

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎮 DEMO CONTROL CENTER                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SIMULATION CONTROLS                                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  ▶️ Play  ⏸️ Pause  ⏹️ Reset                                │    │
│  │  Speed: [1x] [2x] [5x] [10x]                                │    │
│  │  Current Time: 10:30 AM (Simulated)                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  SCENARIO TRIGGERS                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  [☔ Trigger Rain Alert]                                    │    │
│  │  [🚗 Trigger Traffic]                                       │    │
│  │  [📍 Arrive at Location]                                    │    │
│  │  [⏰ Delay Detection]                                       │    │
│  │  [🎉 Complete Trip]                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ACTIVE TEST USER                                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Demo User: demo@anvago.com                                 │    │
│  │  Current Trip: "3-Day Danang Adventure"                     │    │
│  │  Status: Day 2, Location 3 of 5                             │    │
│  │  [Switch User ▼]  [Reset to Start]                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 8.2.2 Data Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 SYSTEM OVERVIEW                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │    12    │  │    45    │  │     8    │  │    156   │           │
│  │  Users   │  │Itineraries│  │  Trips  │  │Locations │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                     │
│  RECENT ACTIVITY                                                    │
│  • User "john@test.com" created itinerary "Beach Weekend"          │
│  • Trip #8 completed - 3 day adventure                             │
│  • AI generated 4 itineraries in last hour                         │
│                                                                     │
│  QUICK ACTIONS                                                      │
│  [Reset All Demo Data]  [Generate Test Users]  [Seed Locations]    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 8.2.3 Walkthrough Mode

Pre-configured demo flow for judges:

```typescript
interface WalkthroughStep {
  id: number;
  title: string;
  description: string;
  route: string;
  highlights: string[];
  autoActions?: {
    type: "click" | "scroll" | "wait" | "type";
    target?: string;
    value?: any;
    delay: number;
  }[];
  narration?: string; // Optional auto-generated notes
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 1,
    title: "Landing Experience",
    description: "First impression and value proposition",
    route: "/",
    highlights: [
      "Bold design language",
      "Clear call-to-action",
      "No login required to explore"
    ]
  },
  {
    id: 2,
    title: "Gamified Onboarding",
    description: "Understanding user preferences playfully",
    route: "/discover",
    highlights: [
      "Persona selection",
      "Tinder-style vibe matching",
      "Weather integration"
    ]
  },
  {
    id: 3,
    title: "AI-Generated Results",
    description: "Personalized itinerary recommendations",
    route: "/discover/results",
    highlights: [
      "Match scores",
      "Multiple options",
      "Reroll capability"
    ]
  },
  // ... continue through all features
];
```

### 8.3 Admin Authentication

Simple admin auth for hackathon:
- Admin route: `/admin`
- Login: Environment variable credentials
- No complex RBAC needed

---

## 9. Mock Data Strategy

### 9.1 Location Data

**Source Strategy:**
1. Use Google Places API to fetch real Danang locations
2. Enrich with custom fields (Anva verified, hidden gem, etc.)
3. Cache in database for demo stability
4. 100-150 locations across all categories

**Location Categories:**

| Category | Count | Examples |
|----------|-------|----------|
| Attractions | 25 | Marble Mountains, Dragon Bridge, Ba Na Hills |
| Beaches | 10 | My Khe, Non Nuoc, An Bang |
| Temples/Pagodas | 12 | Linh Ung Pagoda, Lady Buddha |
| Restaurants | 30 | Local pho shops, seafood restaurants |
| Cafes | 20 | Vietnamese coffee shops, rooftop cafes |
| Markets | 8 | Han Market, Con Market |
| Nightlife | 10 | Bars, clubs, rooftop lounges |
| Nature | 15 | Son Tra Peninsula, waterfalls |
| Cultural | 10 | Museums, Cham Islands |

### 9.2 Mock Integrations

#### Grab Mock

```typescript
interface MockGrabService {
  // Estimate fare (realistic pricing)
  getFareEstimate(from: Coords, to: Coords, vehicleType: string): {
    vehicleType: "bike" | "car" | "car_plus";
    estimatedFare: number; // VND
    currency: "VND";
    estimatedDuration: number; // minutes
    distance: number; // km
    surgeMultiplier?: number;
  };
  
  // Mock booking flow
  createBooking(params: BookingParams): {
    bookingId: string;
    status: "searching" | "driver_found" | "arriving" | "in_progress";
    driver: {
      name: string;
      rating: number;
      vehiclePlate: string;
      vehicleModel: string;
      photoUrl: string;
    };
    eta: number; // minutes
  };
  
  // Simulate driver states
  updateBookingStatus(bookingId: string): BookingStatus;
}
```

#### Booking.com Mock

```typescript
interface MockBookingService {
  searchAccommodations(params: {
    city: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    priceRange?: [number, number];
  }): {
    properties: Array<{
      id: string;
      name: string;
      type: "hotel" | "hostel" | "resort" | "apartment";
      rating: number;
      reviewScore: number;
      price: number;
      currency: "VND";
      image: string;
      amenities: string[];
      distanceToCenter: number;
    }>;
  };
  
  // Mock booking
  createReservation(propertyId: string, details: any): {
    confirmationNumber: string;
    status: "confirmed";
    // ... booking details
  };
}
```

#### Klook Mock

```typescript
interface MockKlookService {
  searchActivities(params: {
    city: string;
    category?: string;
    date?: Date;
  }): {
    activities: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      currency: "VND";
      rating: number;
      reviewCount: number;
      duration: string;
      image: string;
      highlights: string[];
      includes: string[];
    }>;
  };
}
```

### 9.3 Weather & Traffic Mock

**Weather:**
- Real data from OpenWeatherMap for current conditions
- Fallback mock for demos

**Traffic:**
- Mock data with configurable congestion levels
- Trigger-able via admin panel

```typescript
interface MockTrafficService {
  getTrafficConditions(city: string): {
    overallStatus: "low" | "moderate" | "heavy";
    hotspots: Array<{
      area: string;
      status: "low" | "moderate" | "heavy";
      reason?: string;
    }>;
    recommendation: string;
  };
  
  // Admin trigger
  setTrafficCondition(area: string, status: string): void;
}
```

### 9.4 AI Mock (Fallback)

If Gemini unavailable, use template-based generation:

```typescript
interface MockAIService {
  generateItinerary(preferences: UserPreferences): Itinerary {
    // 1. Select template based on personas
    // 2. Filter locations by preferences
    // 3. Apply time optimization algorithm
    // 4. Add variety (not same category back-to-back)
    // 5. Consider weather/traffic
    // 6. Return structured itinerary
  };
  
  optimizeItinerary(itinerary: Itinerary, criterion: string): OptimizedItinerary {
    // Template-based optimization
    // Swap locations, reorder, suggest alternatives
  };
  
  generateLocalizations(itinerary: Itinerary): LocalizationSuggestion[] {
    // Find Anva-verified alternatives for tourist spots
  };
}
```

---

## 10. Implementation Timeline

### 10.1 9-Day Sprint Plan

#### Days 1-2: Foundation (Current)

- [x] Design System documentation
- [x] Requirements documentation
- [ ] Project scaffolding (monorepo setup)
- [ ] Database schema implementation
- [ ] Basic backend API structure
- [ ] Authentication (email + OAuth)
- [ ] Core UI components

#### Days 3-4: Onboarding Flow

- [ ] Landing page
- [ ] Onboarding UI components
- [ ] Question flow logic
- [ ] Weather API integration
- [ ] Mock data seeding (locations)
- [ ] AI itinerary generation (Gemini or mock)
- [ ] Results display

#### Days 5-6: Trip Planning

- [ ] Map integration (Mapbox)
- [ ] Itinerary editor UI
- [ ] Drag-and-drop functionality
- [ ] Location search
- [ ] Route visualization
- [ ] Premium features UI (optimization, localization)

#### Days 7-8: Active Trip & Polish

- [ ] Trip tracking view
- [ ] Mock location simulation
- [ ] Notification system
- [ ] Transportation mock (Grab)
- [ ] Admin panel
- [ ] Demo mode

#### Day 9: Final Polish & Testing

- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Demo walkthrough preparation
- [ ] Documentation
- [ ] Deployment

### 10.2 Priority Matrix

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| P0 (Must) | Onboarding flow | High | Medium |
| P0 (Must) | Itinerary generation | High | Medium |
| P0 (Must) | Basic planning view | High | Medium |
| P0 (Must) | Authentication | Medium | Low |
| P1 (Should) | Map integration | High | Medium |
| P1 (Should) | Drag-and-drop editor | Medium | Medium |
| P1 (Should) | Trip tracking view | High | High |
| P1 (Should) | Admin panel | Medium | Low |
| P2 (Nice) | AI optimization | High | Medium |
| P2 (Nice) | Grab mock booking | Medium | Low |
| P2 (Nice) | Weather alerts | Medium | Low |
| P3 (Bonus) | Booking.com mock | Low | Low |
| P3 (Bonus) | Animations polish | Medium | Medium |

### 10.3 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API rate limits | Implement caching, have mock fallbacks |
| AI unavailable | Template-based generation ready |
| Time overrun | Priority matrix guides cuts |
| Demo failures | Admin panel with manual triggers |
| Auth issues | Simple JWT, OAuth optional |

---

## 11. Success Metrics

### 11.1 Demo Success Criteria

**Must Demonstrate:**
- [ ] Complete onboarding in < 3 minutes
- [ ] AI generates coherent, personalized itinerary
- [ ] Map shows locations and routes
- [ ] Drag-and-drop works smoothly
- [ ] Trip view shows current location
- [ ] Notifications appear at right times
- [ ] Premium features are visually distinct

**Wow Factors:**
- [ ] Beautiful, distinctive UI (not generic)
- [ ] Smooth animations throughout
- [ ] Weather affects recommendations
- [ ] Realistic mock integrations
- [ ] Zero crashes during demo
- [ ] Admin can control demo flow

### 11.2 Judge Impressions

Target feedback:
- "This feels like a real product"
- "The AI recommendations are smart"
- "I would use this for my next trip"
- "The design is beautiful and unique"
- "Great integration with Grab"

---

## Appendix A: Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/anvago"

# Auth
JWT_SECRET="your-jwt-secret-min-32-chars"
JWT_EXPIRES_IN="7d"

# OAuth (dummy keys - replace in production)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# External APIs
GOOGLE_PLACES_API_KEY="your-google-places-key"
MAPBOX_ACCESS_TOKEN="your-mapbox-token"
OPENWEATHER_API_KEY="your-openweather-key"
GEMINI_API_KEY="your-gemini-key"

# App Config
NODE_ENV="development"
PORT=3001
CLIENT_URL="http://localhost:5173"

# Admin
ADMIN_EMAIL="admin@anvago.com"
ADMIN_PASSWORD="admin-password-for-demo"
```

---

## Appendix B: Key User Journeys

### Journey 1: First-Time Tourist

```
1. Lands on homepage → Sees "Start Your Adventure"
2. Clicks CTA → Enters onboarding
3. Selects "3 days" duration
4. Picks "Foodie" + "Culture Seeker" personas
5. Swipes through vibe cards (likes 6/10)
6. Selects interests: street food, temples, photography
7. Chooses "Comfortable" budget
8. Sees weather: Sunny, 28°C
9. Views 3 generated itineraries
10. Picks "Culture & Cuisine Explorer" (92% match)
11. Views detailed itinerary
12. Clicks "Customize" → Prompted to login
13. Registers with Google OAuth
14. Enters trip editor
15. Drags "Linh Ung Pagoda" to Day 1
16. Clicks "Optimize with Go AI" → Accepts suggestions
17. Clicks "Schedule" → Sets start date
18. Later: Opens "Active Trip" view
19. Sees current location, books Grab to next stop
20. Completes trip, sees summary
```

### Journey 2: Returning User

```
1. Opens app → Already logged in
2. Sees dashboard with past/upcoming trips
3. Clicks "New Adventure"
4. Fast-tracks through onboarding (remembers preferences)
5. Generates new itinerary
6. Uses "Localize by Anva" to find hidden gems
7. Schedules trip
```

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-12-11  
**Authors:** Anvago Development Team

