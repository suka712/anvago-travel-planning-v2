# 3. Implementation

## 3.0 Current Prototype Walkthrough

### User Journey Flow

```
Landing Page → Discover (Preferences) → Generating → Results → Plan → Trip (Live) → Itinerary (Complete)
```

| Stage | Description | Key Features |
|-------|-------------|--------------|
| **Discover** | 8-step onboarding quiz | Destination, Duration, Dates, Persona, Vibe, Interests, Activity Level, Budget |
| **Generating** | AI processing animation | Animated loading with contextual messages (2-3 seconds) |
| **Results** | Curated itinerary templates | Multiple trip options with different vibes, swipe to explore |
| **Plan** | Trip customization | Drag-and-drop editing, AI Optimize, Smart Replace, duration adjustments |
| **Trip** | Live trip tracking | Current stop, next stop, progress bar, smart rerouting, weather alerts |
| **Itinerary** | Post-trip view | Completed trip summary, map view, day-by-day breakdown |

### Demo Script (3-5 minutes)
1. **Start at Landing** → Click "Discover" to begin
2. **Onboarding Flow** → Select "Danang", 3 days, Solo Traveler, "Chill & Relax" vibe
3. **Watch Generation** → AI processes preferences with animated feedback
4. **Results Page** → Show multiple trip options, select one
5. **Plan Page** → Demonstrate drag-and-drop, AI Optimize modal, Smart Replace
6. **Start Trip** → Show live tracking with current stop, complete a few stops
7. **Day Complete** → Show rating modal for feedback
8. **Trip Complete** → Show overall trip rating

---

## 3.1 UX/UI Implementations

### 3.1.1 Gamified Experience

**Swipe-Based Selection**
- Results page uses card-based browsing similar to dating apps
- Users swipe through trip options rather than scrolling lists
- Instant visual feedback on selection

**Persona & Vibe Selection**
```
Personas: Solo Explorer, Couple, Family, Friends Group, Business
Vibes: Adventure, Chill & Relax, Cultural, Foodie, Nightlife, Photography
```
- Large, tappable cards with icons and minimal text
- Single-tap selection, no forms to fill
- Visual confirmation with animations

**Keyword & Image Oriented**
- Each location card shows:
  - Hero image (primary decision factor)
  - 2-3 word category tag (e.g., "Local Gem", "Must Visit")
  - Star rating and price indicator
  - Duration estimate
- Users make decisions based on visuals, not text descriptions

**Rerolling Mechanism**
- "Regenerate" button on Results page for new suggestions
- "Smart Replace" on individual items for alternatives
- "AI Optimize" for full itinerary reshuffling
- Never stuck with unwanted options

### 3.1.2 Drag-and-Drop Design

**Card-Based Architecture**
```tsx
// Every interactive element is a card
<Card>
  <CardImage />
  <CardContent>
    <Title />
    <Metadata /> {/* time, cost, rating */}
  </CardContent>
  <CardActions /> {/* buttons appear on hover/tap */}
</Card>
```

**Drag-and-Drop Implementation**
- Built with `@dnd-kit/core` for accessibility and mobile support
- Visual drop zones appear when dragging
- Cards can be:
  - Reordered within a day
  - Moved between days
  - Dropped from search results into itinerary
- Automatic time recalculation on drop

**Slide-Based Modals**
- Modals slide up from bottom (mobile-native feel)
- Multi-step flows with progress indicators
- Swipe to dismiss

### 3.1.3 One-Touch Optimizations

**Surface-Level Controls**
| User Sees | What It Does |
|-----------|--------------|
| "AI Optimize" button | Opens optimization options modal |
| "Replace" icon | Opens Smart Replace with AI suggestions |
| "Complete" button | Marks stop done, advances trip |
| "+/-" on duration | Adjusts time in 15-min increments |

**Hidden Complexity**
- Route optimization algorithms run server-side
- Weather data fetched and processed automatically
- Cost calculations aggregated from multiple sources
- Opening hours validation happens silently
- Users never see: API calls, database queries, ML inference

**Progressive Disclosure**
```
Primary Action → Secondary Options → Advanced Settings (hidden)

Example:
[AI Optimize] → Select optimization type → (Advanced: custom weights, constraints)
```

---

## 3.2 Application Layer

### 3.2.1 Two-App Architecture

**Consumer App (Anvago)**
- Target: Tourists and travelers
- Features: Trip discovery, planning, live tracking, ratings
- Platforms: Web (React), Mobile (React Native - planned)

**Business App (Anvago Business) - Planned**
- Target: Local businesses, tour operators, restaurants
- Features:
  - Listing management
  - Analytics dashboard (views, bookings, ratings)
  - Promotion tools
  - Real-time availability updates
- Revenue model: Subscription + commission on bookings

### 3.2.2 Backend Architecture

**Current: Node.js + Express (Prototyping)**
```
packages/server/
├── src/
│   ├── routes/          # API endpoints
│   │   ├── auth.ts
│   │   ├── itineraries.ts
│   │   ├── locations.ts
│   │   ├── trips.ts
│   │   └── users.ts
│   ├── services/        # Business logic
│   │   ├── optimizationService.ts
│   │   └── weatherService.ts
│   ├── middleware/      # Auth, validation
│   └── utils/           # Helpers
```

**Production: Go (Planned)**
- Why Go?
  - 10-40x faster than Node.js for compute-heavy operations
  - Native concurrency for handling multiple optimization requests
  - Lower memory footprint for scaling
  - Strong typing catches bugs at compile time

**API Design**
```
REST Endpoints:
POST   /api/auth/register
POST   /api/auth/login
GET    /api/itineraries
POST   /api/itineraries
GET    /api/itineraries/:id
POST   /api/itineraries/:id/optimize    ← AI optimization
GET    /api/locations
GET    /api/locations/search
POST   /api/trips
GET    /api/trips/:id
POST   /api/trips/:id/advance           ← Live tracking
```

### 3.2.3 Database: PostgreSQL + PostGIS

**Why PostgreSQL?**
- ACID compliance for transaction safety
- JSON support for flexible schema (user preferences, AI responses)
- Excellent query performance with proper indexing

**Why PostGIS?**
- Geospatial queries are core to travel planning:
  ```sql
  -- Find locations within 2km of user's current position
  SELECT * FROM locations
  WHERE ST_DWithin(
    geom,
    ST_MakePoint(108.2208, 16.0544)::geography,
    2000
  );

  -- Calculate optimal route order (nearest neighbor)
  SELECT * FROM locations
  ORDER BY geom <-> ST_MakePoint(108.2208, 16.0544);
  ```
- Native support for:
  - Distance calculations
  - Polygon containment (city boundaries)
  - Route optimization
  - Clustering nearby locations

**Schema Overview**
```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  subscriptionTier String  @default("free")
  preferences     Json?    // Stored vibe/persona preferences
}

model Itinerary {
  id           String   @id @default(uuid())
  title        String
  city         String
  durationDays Int
  items        ItineraryItem[]
}

model Location {
  id           String   @id @default(uuid())
  name         String
  category     String
  latitude     Float
  longitude    Float
  rating       Float?
  priceLevel   Int?
  isLocalGem   Boolean  @default(false)
  // PostGIS: geom GEOGRAPHY(Point, 4326)
}
```

### 3.2.4 Frontend: React + React Native

**Web (React + Vite + TypeScript)**
```
packages/client/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable: Button, Card, Badge, Modal
│   │   ├── layouts/         # Header, Footer, Navigation
│   │   ├── onboarding/      # Step components for Discover flow
│   │   └── modals/          # PremiumModal, etc.
│   ├── pages/               # Route components
│   ├── stores/              # Zustand state management
│   ├── services/            # API client
│   └── hooks/               # Custom React hooks
```

**Key Libraries**
| Library | Purpose |
|---------|---------|
| `@dnd-kit/core` | Drag and drop |
| `framer-motion` | Animations |
| `zustand` | State management |
| `react-router-dom` | Routing |
| `tailwindcss` | Styling |
| `lucide-react` | Icons |

**Mobile (React Native - Planned)**
- 90% code sharing with web via shared components
- Platform-specific: Maps, Push notifications, Offline storage
- Expo for rapid development

**Repository**
- GitHub: https://github.com/suka712/anvago-travel-planning-v2
- Monorepo structure with pnpm workspaces

---

## 3.3 AI Implementation

### Current: Mock Implementation (Prototype)

**AI Optimize (Plan Page)**
- Simulates 2-second processing delay
- Returns predefined optimizations based on selected type
- Shows before/after comparison with explanations

**Smart Replace (Plan Page)**
- Context-aware suggestions based on:
  - Previous activity in itinerary
  - Next activity in itinerary
  - Current item's category
- Categories: Similar, Higher Rated, Budget Friendly, Local Gems, Best for Moment

### Production: Claude AI Integration (Planned)

**Architecture**
```
User Request → Backend API → Claude API → Parse Response → Return to Client
```

**Optimization Prompt Template**
```typescript
const prompt = `You are an expert travel itinerary optimizer.

ITINERARY:
${items.map((item, idx) =>
  `${idx + 1}. ${item.name} (${item.category})
   - Duration: ${item.duration} mins
   - Location: ${item.lat}, ${item.lng}
   - Price: ${item.priceLevel}`
).join('\n')}

OPTIMIZATION GOAL: ${optimizationType}
- route: Minimize travel time between locations
- budget: Reduce overall cost while maintaining quality
- time: Fit more activities by reducing transit
- walking: Minimize walking distance

RESPOND IN JSON:
{
  "changes": [...],
  "statistics": { "timeSaved": X, "costSaved": Y },
  "reasoning": "..."
}`;
```

**Cost Estimate**
- Claude Sonnet: ~$0.003 per optimization request
- 10,000 optimizations/month = $30

### Hybrid Approach (Recommended)

**Use Heuristics for**
- Route optimization (nearest neighbor algorithm)
- Distance calculations (Haversine formula)
- Time slot fitting
- Budget filtering

**Use AI for**
- Natural language explanations
- Context-aware suggestions
- Vibe matching
- Handling edge cases

---

## 3.4 Content Strategy

### 3.4.1 Authentic Content Curation

**Local Gems Identification**
- Partner with local influencers and content creators
- Verify authenticity through:
  - Not on major tourist platforms (TripAdvisor top 10)
  - Primarily Vietnamese customer base
  - Owner-operated businesses
  - Unique/traditional offerings

**Content Sources**
| Source | Type | Authenticity Score |
|--------|------|-------------------|
| Local partnerships | Primary | High |
| Vietnamese food bloggers | Curated | High |
| Google Places API | Supplementary | Medium |
| User submissions | Community | Verified |

**Anti-Tourist-Trap Measures**
- Exclude locations with:
  - Dual pricing (tourist vs local)
  - Commission-based taxi partnerships
  - Predominantly negative Vietnamese reviews
- Prioritize:
  - Family-run establishments
  - Locations off main tourist strips
  - Places with Vietnamese language menus

### 3.4.2 Social Media Integration

**User-Generated Content**
- In-app photo sharing at each stop
- Automatic trip story generation
- Share completed itineraries as templates

**Influencer Partnerships**
- Partner with Vietnamese travel content creators
- Co-create "Local's Guide" itineraries
- Feature verified local experiences

**Content Pipeline**
```
Discovery → Verification → Photography → Copywriting → Publishing

1. Identify potential location (social media, local tips)
2. Physical verification visit
3. Professional photography session
4. Write descriptions in user's voice
5. Add to database with "Local Gem" badge
```

---

## Technical Differentiators

| Feature | Our Approach | Competitors |
|---------|--------------|-------------|
| **Optimization** | Real-time AI + heuristics | Static suggestions |
| **Live Tracking** | Multi-day, multi-stop | Single-day only |
| **Content** | Curated local gems | Aggregated reviews |
| **UX** | Gamified, visual-first | Form-heavy, text-based |
| **Personalization** | Vibe + Persona matching | Basic filters |

---

## Future Roadmap

**Phase 1 (Current): MVP**
- Web prototype with mock data
- Core flows implemented
- Demo-ready for hackathon

**Phase 2: Production**
- Go backend migration
- Real AI integration
- Mobile app launch

**Phase 3: Scale**
- Business portal
- Booking integration
- Multi-city expansion

**Phase 4: Platform**
- User-generated itineraries
- Local guide marketplace
- Real-time crowd data
