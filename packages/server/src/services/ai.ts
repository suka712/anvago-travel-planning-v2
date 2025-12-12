import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../config/database.js';
import type { ItineraryGenerationRequest, ItineraryResult, OptimizationCriterion, LocalizationSuggestion } from '@anvago/shared';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Generate itineraries based on user preferences
export async function generateItinerary(
  request: ItineraryGenerationRequest
): Promise<ItineraryResult[]> {
  const { city, durationDays, preferences } = request;
  
  // Get all locations for the city
  const locations = await prisma.location.findMany({
    where: { city },
    orderBy: { rating: 'desc' },
  });

  if (locations.length === 0) {
    return generateMockItineraries(request);
  }

  // Try AI generation first
  if (genAI) {
    try {
      return await generateWithAI(request, locations);
    } catch (error) {
      console.error('AI generation failed, falling back to template:', error);
    }
  }

  // Fallback to template-based generation
  return generateTemplateItineraries(request, locations);
}

// AI-powered generation using Gemini
async function generateWithAI(
  request: ItineraryGenerationRequest,
  locations: any[]
): Promise<ItineraryResult[]> {
  const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a travel planning AI for Anvago, a personalized travel app.

Generate 3 unique itinerary suggestions for a ${request.durationDays}-day trip to ${request.city}.

User Preferences:
- Traveler personas: ${request.preferences.personas.join(', ') || 'Not specified'}
- Vibe preferences: ${request.preferences.vibes.join(', ') || 'Not specified'}
- Interests: ${request.preferences.interests.join(', ') || 'Not specified'}
- Budget: ${request.preferences.budgetLevel}
- Activity level: ${request.preferences.activityLevel}

Available locations (use only these IDs):
${locations.slice(0, 50).map(l => `- ${l.id}: ${l.name} (${l.category}, rating: ${l.rating}, price: ${'$'.repeat(l.priceLevel)})`).join('\n')}

For each itinerary, respond in this JSON format:
{
  "itineraries": [
    {
      "title": "Creative title matching the vibe",
      "tagline": "Short catchy description",
      "matchScore": 85,
      "highlights": ["highlight 1", "highlight 2", "highlight 3"],
      "badges": ["adventure", "local_favorite"],
      "days": [
        {
          "dayNumber": 1,
          "title": "Day theme",
          "locationIds": ["id1", "id2", "id3"]
        }
      ]
    }
  ]
}

Make each itinerary distinct - one could be more adventurous, one more relaxed, one focused on food/culture.
Match ${request.preferences.activityLevel === 'packed' ? '6-7' : request.preferences.activityLevel === 'chill' ? '2-3' : '4-5'} locations per day.
Consider logical routing (locations close to each other grouped).`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Parse JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }
  
  const parsed = JSON.parse(jsonMatch[0]);
  
  // Convert to ItineraryResult format
  return parsed.itineraries.map((it: any, index: number) => {
    const totalLocations = it.days.reduce((sum: number, d: any) => sum + d.locationIds.length, 0);
    
    return {
      id: `ai-${Date.now()}-${index}`,
      title: it.title,
      tagline: it.tagline,
      matchScore: it.matchScore,
      highlights: it.highlights,
      coverImage: locations[0]?.imageUrl || '/images/default-cover.jpg',
      stats: {
        duration: `${request.durationDays} days`,
        locations: totalLocations,
        walkingDistance: `${(totalLocations * 1.5).toFixed(1)} km`,
        estimatedBudget: calculateBudget(request.preferences.budgetLevel, request.durationDays),
      },
      dayPreviews: it.days.map((d: any) => ({
        day: d.dayNumber,
        title: d.title,
        locations: d.locationIds.length,
      })),
      badges: it.badges,
      _locationIds: it.days.flatMap((d: any) => d.locationIds),
    };
  });
}

// Template-based fallback generation
function generateTemplateItineraries(
  request: ItineraryGenerationRequest,
  locations: any[]
): ItineraryResult[] {
  const { durationDays, preferences } = request;
  
  // Categorize locations
  const byCategory: Record<string, any[]> = {};
  locations.forEach(loc => {
    if (!byCategory[loc.category]) byCategory[loc.category] = [];
    byCategory[loc.category].push(loc);
  });

  // Score locations based on preferences
  const scoredLocations = locations.map(loc => {
    let score = loc.rating * 10;
    
    // Boost for matching tags
    if (preferences.personas.some(p => loc.tags.includes(p))) score += 20;
    if (preferences.vibes.some(v => loc.tags.includes(v))) score += 15;
    if (preferences.interests.some(i => loc.tags.includes(i))) score += 15;
    
    // Budget matching
    const budgetMap: Record<string, number[]> = {
      budget: [1, 2],
      moderate: [2, 3],
      luxury: [3, 4],
    };
    if (budgetMap[preferences.budgetLevel]?.includes(loc.priceLevel)) score += 10;
    
    // Boost verified/hidden gems
    if (loc.isAnvaVerified) score += 10;
    if (loc.isHiddenGem) score += 5;
    
    return { ...loc, score };
  }).sort((a, b) => b.score - a.score);

  // Determine locations per day
  const locsPerDay = preferences.activityLevel === 'packed' ? 6 : 
                     preferences.activityLevel === 'chill' ? 3 : 4;
  
  // Generate 3 different itineraries
  const templates = [
    { name: 'Highlights Tour', bias: 'popular', offset: 0 },
    { name: 'Hidden Gems', bias: 'hidden', offset: 10 },
    { name: 'Balanced Explorer', bias: 'mixed', offset: 20 },
  ];

  return templates.map((template, idx) => {
    const itineraryLocations: any[][] = [];
    const usedIds = new Set<string>();
    
    // Select locations for each day
    for (let day = 0; day < durationDays; day++) {
      const dayLocations: any[] = [];
      let source = scoredLocations;
      
      // Apply bias
      if (template.bias === 'hidden') {
        source = scoredLocations.filter(l => l.isHiddenGem || l.isAnvaVerified);
        if (source.length < locsPerDay * durationDays) source = scoredLocations;
      }
      
      // Pick locations
      for (let i = 0; i < locsPerDay && dayLocations.length < locsPerDay; i++) {
        const startIdx = template.offset + day * locsPerDay + i;
        const loc = source.find((l, idx) => idx >= startIdx && !usedIds.has(l.id));
        if (loc) {
          dayLocations.push(loc);
          usedIds.add(loc.id);
        }
      }
      
      itineraryLocations.push(dayLocations);
    }

    const totalLocations = itineraryLocations.flat().length;
    const matchScore = Math.min(95, 70 + idx * 5 + Math.floor(Math.random() * 10));

    return {
      id: `template-${Date.now()}-${idx}`,
      title: generateTitle(template.name, preferences.personas),
      tagline: generateTagline(durationDays, preferences),
      matchScore,
      highlights: itineraryLocations.flat().slice(0, 3).map(l => l.name),
      coverImage: itineraryLocations[0]?.[0]?.imageUrl || '/images/default-cover.jpg',
      stats: {
        duration: `${durationDays} days`,
        locations: totalLocations,
        walkingDistance: `${(totalLocations * 1.2).toFixed(1)} km`,
        estimatedBudget: calculateBudget(preferences.budgetLevel, durationDays),
      },
      dayPreviews: itineraryLocations.map((locs, day) => ({
        day: day + 1,
        title: getDayTitle(locs, day),
        locations: locs.length,
      })),
      badges: getBadges(itineraryLocations.flat(), preferences),
      _locations: itineraryLocations,
    };
  });
}

// Mock itineraries when no locations available
function generateMockItineraries(request: ItineraryGenerationRequest): ItineraryResult[] {
  return [
    {
      id: 'mock-1',
      title: 'Danang Discovery',
      tagline: `${request.durationDays} days of adventure awaits`,
      matchScore: 88,
      highlights: ['Dragon Bridge', 'My Khe Beach', 'Marble Mountains'],
      coverImage: '/images/danang-cover.jpg',
      stats: {
        duration: `${request.durationDays} days`,
        locations: request.durationDays * 4,
        walkingDistance: '8.5 km',
        estimatedBudget: calculateBudget(request.preferences.budgetLevel, request.durationDays),
      },
      dayPreviews: Array.from({ length: request.durationDays }, (_, i) => ({
        day: i + 1,
        title: ['Beach & Culture', 'Mountain Adventure', 'Local Immersion', 'Foodie Paradise'][i % 4],
        locations: 4,
      })),
      badges: ['adventure', 'photography'],
    },
    {
      id: 'mock-2',
      title: 'Local\'s Danang',
      tagline: 'Experience the city like a local',
      matchScore: 82,
      highlights: ['Han Market', 'Local Street Food', 'Son Tra Peninsula'],
      coverImage: '/images/local-cover.jpg',
      stats: {
        duration: `${request.durationDays} days`,
        locations: request.durationDays * 3,
        walkingDistance: '6.2 km',
        estimatedBudget: calculateBudget(request.preferences.budgetLevel, request.durationDays),
      },
      dayPreviews: Array.from({ length: request.durationDays }, (_, i) => ({
        day: i + 1,
        title: ['Market Morning', 'Hidden Gems', 'Sunset Views'][i % 3],
        locations: 3,
      })),
      badges: ['local_favorite', 'foodie'],
    },
    {
      id: 'mock-3',
      title: 'Relax in Danang',
      tagline: 'Slow travel, deep experiences',
      matchScore: 79,
      highlights: ['Spa Day', 'Beach Sunset', 'Quiet Cafes'],
      coverImage: '/images/relax-cover.jpg',
      stats: {
        duration: `${request.durationDays} days`,
        locations: request.durationDays * 2,
        walkingDistance: '4.0 km',
        estimatedBudget: calculateBudget(request.preferences.budgetLevel, request.durationDays),
      },
      dayPreviews: Array.from({ length: request.durationDays }, (_, i) => ({
        day: i + 1,
        title: ['Beach Day', 'Spa & Wellness', 'Leisurely Exploration'][i % 3],
        locations: 2,
      })),
      badges: ['relaxation', 'wellness'],
    },
  ];
}

// Optimize existing itinerary
export async function optimizeItinerary(
  itinerary: any,
  criterion: OptimizationCriterion
): Promise<any> {
  // For demo, return mock optimization results
  const changes = [];
  const improvements: any = {};

  switch (criterion) {
    case 'route':
      changes.push({
        type: 'reorder',
        description: 'Reordered locations to minimize travel time',
      });
      improvements.timeSaved = 45;
      improvements.distanceReduced = 3.2;
      break;
    case 'budget':
      changes.push({
        type: 'replace',
        description: 'Suggested more budget-friendly alternatives',
      });
      improvements.moneySaved = 250000;
      break;
    case 'weather':
      changes.push({
        type: 'reorder',
        description: 'Moved outdoor activities to avoid rain forecast',
      });
      break;
    case 'walking':
      changes.push({
        type: 'reorder',
        description: 'Grouped nearby locations together',
      });
      improvements.distanceReduced = 2.5;
      break;
  }

  return {
    original: itinerary,
    optimized: itinerary, // In real impl, would be modified copy
    changes,
    improvements,
  };
}

// Localize itinerary with Anva-verified spots
export async function localizeItinerary(itinerary: any): Promise<LocalizationSuggestion[]> {
  const suggestions: LocalizationSuggestion[] = [];
  
  // Find Anva-verified alternatives for non-verified locations
  for (const item of itinerary.items) {
    if (!item.location.isAnvaVerified) {
      const alternative = await prisma.location.findFirst({
        where: {
          category: item.location.category,
          city: item.location.city,
          isAnvaVerified: true,
          id: { not: item.location.id },
        },
        orderBy: { rating: 'desc' },
      });

      if (alternative) {
        suggestions.push({
          originalItem: item,
          suggestedLocation: alternative as any,
          reason: 'Anva-verified local favorite',
          localInsight: `This spot is loved by locals for its authentic ${alternative.category} experience. Less crowded and more genuine than tourist alternatives.`,
        });
      }
    }
  }

  return suggestions;
}

// Helper functions
function generateTitle(template: string, personas: string[]): string {
  const personaTitles: Record<string, string[]> = {
    adventurer: ['Adventure Awaits', 'Thrill Seeker\'s Journey'],
    foodie: ['Culinary Explorer', 'Taste of Danang'],
    culture_seeker: ['Cultural Immersion', 'Heritage Trail'],
    relaxer: ['Tranquil Escape', 'Zen Journey'],
    photographer: ['Picture Perfect', 'Golden Hour Tour'],
  };

  const persona = personas[0];
  if (persona && personaTitles[persona]) {
    return personaTitles[persona][Math.floor(Math.random() * personaTitles[persona].length)];
  }
  
  return template;
}

function generateTagline(days: number, preferences: any): string {
  return `${days} days of ${preferences.activityLevel === 'packed' ? 'non-stop adventure' : 
           preferences.activityLevel === 'chill' ? 'relaxed exploration' : 'balanced discovery'}`;
}

function calculateBudget(level: string, days: number): string {
  const daily: Record<string, number> = {
    budget: 400000,
    moderate: 1000000,
    luxury: 2500000,
  };
  const total = (daily[level] || daily.moderate) * days;
  return `${(total / 1000000).toFixed(1)}M VND`;
}

function getDayTitle(locations: any[], dayIndex: number): string {
  const categories = locations.map(l => l.category);
  if (categories.includes('beach')) return 'Beach Day';
  if (categories.includes('temple')) return 'Cultural Discovery';
  if (categories.includes('nature')) return 'Nature Adventure';
  if (categories.includes('restaurant')) return 'Foodie Paradise';
  return ['Morning Exploration', 'Day Adventures', 'Evening Delights'][dayIndex % 3];
}

function getBadges(locations: any[], preferences: any): string[] {
  const badges = new Set<string>();
  
  if (locations.some(l => l.isAnvaVerified)) badges.add('local_favorite');
  if (locations.some(l => l.isHiddenGem)) badges.add('hidden_gem');
  if (locations.some(l => l.category === 'nature')) badges.add('adventure');
  if (locations.some(l => l.category === 'restaurant')) badges.add('foodie');
  
  preferences.personas.forEach((p: string) => badges.add(p));
  
  return Array.from(badges).slice(0, 3);
}

