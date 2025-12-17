# AI Optimize Feature - Real Implementation Guide

This document outlines how to implement the "Go AI Optimize" feature with real AI/ML capabilities instead of the current mock data.

## Current Mock Implementation

The current implementation in `packages/client/src/pages/Plan.tsx`:
- Shows a selection of optimization options (route, budget, time, etc.)
- Simulates a 2-second "processing" delay
- Returns hardcoded mock changes (swapping items in the itinerary)
- Displays mock statistics (-25 min travel time, etc.)

## Production Implementation Architecture

### 1. Backend API Endpoint

Create a new endpoint in `packages/server/src/routes/itineraries.ts`:

```typescript
// POST /itineraries/:id/optimize
router.post('/:id/optimize', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { optimizationType, preferences } = req.body;

    // 1. Fetch the itinerary with all items and locations
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        items: {
          include: { location: true },
          orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }],
        },
      },
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    // 2. Call the optimization service
    const optimizationResult = await optimizeItinerary(itinerary, {
      type: optimizationType,
      preferences,
    });

    // 3. Return the optimized itinerary and changes
    res.json({
      success: true,
      data: {
        optimizedItinerary: optimizationResult.itinerary,
        changes: optimizationResult.changes,
        statistics: optimizationResult.statistics,
      },
    });
  } catch (error) {
    next(error);
  }
});
```

### 2. Optimization Service Options

#### Option A: Claude AI Integration (Recommended)

Use Anthropic's Claude API for intelligent optimization with natural language reasoning.

```typescript
// packages/server/src/services/optimizationService.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface OptimizationRequest {
  type: 'route' | 'budget' | 'time' | 'walking' | 'weather' | 'crowd';
  preferences?: Record<string, any>;
}

export async function optimizeItinerary(
  itinerary: Itinerary,
  options: OptimizationRequest
) {
  const prompt = buildOptimizationPrompt(itinerary, options);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Parse Claude's response (expecting JSON with optimized order and explanations)
  const result = parseOptimizationResponse(response.content[0].text);

  return {
    itinerary: applyOptimizations(itinerary, result.changes),
    changes: result.changes,
    statistics: result.statistics,
  };
}

function buildOptimizationPrompt(itinerary: Itinerary, options: OptimizationRequest): string {
  const itemsDescription = itinerary.items.map((item, idx) =>
    `${idx + 1}. ${item.location.name} (${item.location.category})
       - Duration: ${item.location.estimatedDuration} mins
       - Location: ${item.location.latitude}, ${item.location.longitude}
       - Price Level: ${item.location.priceLevel}
       - Rating: ${item.location.rating}`
  ).join('\n');

  return `You are an expert travel itinerary optimizer. Analyze this itinerary and suggest optimizations.

ITINERARY:
${itemsDescription}

OPTIMIZATION GOAL: ${getOptimizationGoalDescription(options.type)}

INSTRUCTIONS:
1. Analyze the current order of activities
2. Consider geographical proximity, opening hours, and logical flow
3. Suggest reordering to achieve the optimization goal
4. Provide clear reasoning for each change

RESPOND IN JSON FORMAT:
{
  "changes": [
    {
      "type": "moved" | "swapped" | "removed" | "timing_adjusted",
      "itemIndex": number,
      "newIndex": number,
      "itemName": string,
      "from": string,
      "to": string,
      "reason": string
    }
  ],
  "statistics": {
    "travelTimeSaved": number (in minutes),
    "walkingDistanceSaved": number (in meters),
    "costSaved": number (in VND),
    "summary": string
  }
}`;
}
```

#### Option B: Google OR-Tools (Route Optimization)

For pure route optimization, use Google's Operations Research tools:

```typescript
// packages/server/src/services/routeOptimizer.ts
import { RoutingModel, RoutingIndexManager } from 'google-or-tools';

export async function optimizeRoute(locations: Location[]): Promise<number[]> {
  // Create distance matrix using Google Maps Distance Matrix API
  const distanceMatrix = await calculateDistanceMatrix(locations);

  // Create routing model
  const manager = new RoutingIndexManager(
    locations.length,
    1, // number of vehicles (1 for walking)
    0  // depot (starting point)
  );

  const routing = new RoutingModel(manager);

  // Define cost function (travel time)
  const transitCallback = (fromIndex: number, toIndex: number) => {
    const fromNode = manager.indexToNode(fromIndex);
    const toNode = manager.indexToNode(toIndex);
    return distanceMatrix[fromNode][toNode];
  };

  routing.setArcCostEvaluatorOfAllVehicles(transitCallback);

  // Solve
  const solution = routing.solveWithParameters({
    firstSolutionStrategy: 'PATH_CHEAPEST_ARC',
    localSearchMetaHeuristic: 'GUIDED_LOCAL_SEARCH',
    timeLimit: 5, // seconds
  });

  // Extract optimized order
  return extractRoute(routing, manager, solution);
}
```

#### Option C: Custom Heuristic Algorithm

For simpler optimization without external APIs:

```typescript
// packages/server/src/services/heuristicOptimizer.ts
import { haversineDistance } from '../utils/geo';

interface OptimizationConfig {
  type: string;
  weights: {
    distance: number;
    time: number;
    cost: number;
    rating: number;
  };
}

export function optimizeWithHeuristics(
  items: ItineraryItem[],
  config: OptimizationConfig
): OptimizationResult {
  const changes: Change[] = [];
  let optimizedItems = [...items];

  switch (config.type) {
    case 'route':
      // Nearest neighbor algorithm for route optimization
      optimizedItems = nearestNeighborSort(items);
      break;

    case 'budget':
      // Sort expensive activities to later in day (can be skipped if tired)
      optimizedItems = sortByPriceLevel(items, 'asc');
      break;

    case 'time':
      // Group nearby activities together
      optimizedItems = clusterByProximity(items);
      break;

    case 'walking':
      // Minimize total walking distance using TSP approximation
      optimizedItems = minimizeWalkingDistance(items);
      break;
  }

  // Calculate changes by comparing original vs optimized
  changes.push(...detectChanges(items, optimizedItems));

  // Calculate statistics
  const statistics = calculateStatistics(items, optimizedItems);

  return { items: optimizedItems, changes, statistics };
}

function nearestNeighborSort(items: ItineraryItem[]): ItineraryItem[] {
  const sorted: ItineraryItem[] = [items[0]];
  const remaining = items.slice(1);

  while (remaining.length > 0) {
    const current = sorted[sorted.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    remaining.forEach((item, idx) => {
      const dist = haversineDistance(
        current.location.latitude,
        current.location.longitude,
        item.location.latitude,
        item.location.longitude
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });

    sorted.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return sorted;
}
```

### 3. External API Integrations

#### Google Maps Platform

Required for accurate distance/time calculations:

```typescript
// packages/server/src/services/googleMaps.ts
import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function calculateDistanceMatrix(locations: Location[]) {
  const origins = locations.map(l => ({ lat: l.latitude, lng: l.longitude }));
  const destinations = origins;

  const response = await client.distancematrix({
    params: {
      key: process.env.GOOGLE_MAPS_API_KEY,
      origins,
      destinations,
      mode: 'walking', // or 'driving'
    },
  });

  return response.data.rows.map(row =>
    row.elements.map(el => el.duration?.value || Infinity)
  );
}
```

#### Weather API

For weather-smart optimization:

```typescript
// packages/server/src/services/weatherService.ts
export async function getWeatherForecast(
  lat: number,
  lng: number,
  date: Date
): Promise<WeatherForecast> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}`
  );

  const data = await response.json();

  // Find forecast for the specific date
  return parseWeatherData(data, date);
}

// Use weather data to suggest indoor activities during rain
export function adjustForWeather(
  items: ItineraryItem[],
  forecast: WeatherForecast
): ItineraryItem[] {
  // Move outdoor activities to times with good weather
  // Move indoor activities (museums, cafes) to rainy periods
}
```

### 4. Database Schema Updates

Add optimization history tracking:

```prisma
// packages/server/prisma/schema.prisma

model OptimizationHistory {
  id              String   @id @default(uuid())
  itineraryId     String
  itinerary       Itinerary @relation(fields: [itineraryId], references: [id])
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  optimizationType String
  changesApplied  Json     // Array of changes that were applied
  statisticsBefore Json    // Stats before optimization
  statisticsAfter  Json    // Stats after optimization
  wasAccepted     Boolean  @default(false)
  createdAt       DateTime @default(now())
}
```

### 5. Frontend Integration

Update the client to call the real API:

```typescript
// packages/client/src/pages/Plan.tsx

const handleOptimize = async () => {
  setOptimizeStep('loading');

  try {
    const response = await itinerariesAPI.optimize(id, {
      type: selectedOptimization,
      preferences: {
        // Additional preferences from user
      },
    });

    if (response.data?.data) {
      setOptimizedItinerary(response.data.data.optimizedItinerary);
      setOptimizationChanges(response.data.data.changes);
      setOptimizationStats(response.data.data.statistics);
      setOptimizeStep('results');
    }
  } catch (error) {
    console.error('Optimization failed:', error);
    setOptimizeStep('select');
    toast.error('Optimization failed. Please try again.');
  }
};
```

### 6. Cost Considerations

| Service | Estimated Cost | Best For |
|---------|---------------|----------|
| Claude API | ~$0.003/request | Complex reasoning, explanations |
| Google Maps API | ~$0.005/request | Accurate distances, traffic |
| OpenWeather API | Free tier available | Weather-based optimization |
| Custom Heuristics | Free | Basic route optimization |

### 7. Recommended Implementation Phases

**Phase 1: Basic Route Optimization**
- Implement nearest-neighbor heuristic
- Calculate real distances using Haversine formula
- No external API costs

**Phase 2: Enhanced with Maps API**
- Add Google Distance Matrix for accurate travel times
- Include traffic data for time-based optimization

**Phase 3: AI-Powered Insights**
- Integrate Claude for natural language explanations
- Provide context-aware suggestions
- Learn from user acceptance patterns

**Phase 4: Advanced Features**
- Weather integration
- Real-time crowd data
- User preference learning

## Environment Variables Required

```env
# AI/ML
ANTHROPIC_API_KEY=sk-ant-...

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# Weather
OPENWEATHER_API_KEY=...
```

## Testing

```typescript
// packages/server/src/tests/optimization.test.ts
describe('Optimization Service', () => {
  it('should minimize route distance', async () => {
    const items = mockItineraryItems();
    const result = await optimizeItinerary(items, { type: 'route' });

    const originalDistance = calculateTotalDistance(items);
    const optimizedDistance = calculateTotalDistance(result.items);

    expect(optimizedDistance).toBeLessThan(originalDistance);
  });

  it('should provide explanations for each change', async () => {
    const result = await optimizeItinerary(mockItems, { type: 'route' });

    result.changes.forEach(change => {
      expect(change.reason).toBeTruthy();
      expect(change.reason.length).toBeGreaterThan(10);
    });
  });
});
```
